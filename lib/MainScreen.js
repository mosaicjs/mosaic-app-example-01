import React from 'react';

import { AppModule } from 'mosaic-app';
import { Data, DataSet, DataSetPaginated, DataSetSelection } from 'mosaic-dataset';
import { DataSetIndex, SearchableDataSet } from 'mosaic-dataset-index';

import AppUi from 'mosaic-app-ui';
const { Resource } = AppUi.model;
const { ListView, ListItemView, ResourceListItemView, ListPaginationView } = AppUi.views.list;
const { AutocompleteBox } = AppUi.views.autocomplete;
const {
    SearchCriteria,
    SearchCriteriaDataSet,
    SearchCriteriaSuggestionView,
    SearchCriteriaSelectionView,
    TextSearchCriteria
} = AppUi.views.search;

import data from '../data/data.json';
import BackofficeScreen from './BackofficeScreen';

// --------------------------------------------------------------------------
// Search criteria of different types

class TagSearchCriteria extends SearchCriteria {
    get iconClass(){ return 'glyphicon glyphicon-tag'; }
}

class CategoriesSearchCriteria extends SearchCriteria {
    get iconClass() { return 'glyphicon glyphicon-folder-open'; }
    get label() { return this.get('label'); }
}

// --------------------------------------------------------------------------
// Search criteria visualization

class TextSearchCriteriaSuggestionView extends SearchCriteriaSuggestionView {
    renderView(){
        const iconClass = this.item.iconClass;
        let icon;
        if (iconClass){
            icon = <i className={iconClass}></i>
        }
        return (
            <span style={{color:'gray'}}>
                {icon}{' '}
                Search for &laquo;
                <span style={{color:'black'}}>{this.item.fullLabel}</span>
                &raquo;
            </span>
        );
    }
}

// --------------------------------------------------------------------------
// Visualization views for specific data types

class InvestisseurItemView extends ResourceListItemView {
    get className(){ return 'invest'; }
    get style(){
        return {
            backgroundColor: 'silver',
            color: 'white'
        }; 
    }
}



// --------------------------------------------------------------------------

export default class MainScreen extends BackofficeScreen {
    
    _suggest(query){
        const that = this;
        return Promise.all([
            that._suggestTextQuery(query),
            that._suggestCategories(query),
            that._suggestTags(query)
        ]).then(function(lists){
            const result = [];
            lists.forEach(function(list){
                if (!list || !list.length)
                    return ;
                let maxNumber = 4;
                let len = Math.min(list.length, maxNumber);
                for (let i = 0; i < len; i++) {
                    result.push(list[i]);
                }
            })
            return result;
        });
    }
    
    _suggestTextQuery(query) {
        const adapters = this.app.adapters;
        return Promise.resolve().then(function(){
            let item;
            if (query && query.length) {
                query = !!query ? ('' + query) : '';
                let id = query; // query.replace(/\s/gim, '_');
                if (id) {
                    id = 'q=' + id;
                    item = new TextSearchCriteria({
                        adapters,
                        data : {
                            id,
                            q : query
                        }
                    });
                }
            }
            return item ? [item] : [];
        });
    }
    
    _suggestTags(query){
        const that = this;
        return that._tagsSuggestionSet.search(query).then(function(){
            return that._tagsSuggestionSet.items;
        });
    }
    
    _suggestCategories(query) {
        const that = this;
        return that._categoriesSuggestionSet.search(query).then(function(){
            return that._categoriesSuggestionSet.items;
        });
    }
    
    _buildQuery(searchCriteria){
        const query = {
            full : [],
            tags : [],
            categories : []
        };
        searchCriteria.each(function(criteria){
            if (criteria instanceof TagSearchCriteria) {
                query.tags = query.tags.concat(criteria.values);
            } else if (criteria instanceof CategoriesSearchCriteria) {
                query.categories = query.categories.concat(criteria.get('key'));
            } else if (criteria instanceof TextSearchCriteria) {
                query.full.push(criteria.query);
            }
        });
        return query;
    }
    
    constructor(options){
        super(options);
        const adapters = this.app.adapters;
        adapters.registerAdapter(Resource, ListItemView, ResourceListItemView);
        adapters.registerAdapter('Resource/Investisseur', ListItemView, InvestisseurItemView);

        adapters.registerAdapter(SearchCriteria, AutocompleteBox.SuggestionView, SearchCriteriaSuggestionView); 
        adapters.registerAdapter(SearchCriteria, AutocompleteBox.SelectionView, SearchCriteriaSelectionView);
        adapters.registerAdapter(TextSearchCriteria, AutocompleteBox.SuggestionView, TextSearchCriteriaSuggestionView);
        this.dataSet = new DataSet({adapters, DataType:Resource});
        
        this._index = new SearchableDataSet({
            dataSet : this.dataSet,
            indexFields: {
                "full" : {
                    "properties.name" : {
                        "boost" : 10
                    },
                    "properties.description" : {
                        "boost" : 5
                    },
                    "properties.tags" : {
                        "boost" : 15,
                        "filter" : true
                    },
                    "properties.address" : {
                        "boost" : 1
                    },
                    "properties.postcode" : {
                        "boost" : 1,
                        "filter" : "prefix"
                    },
                    "properties.city" : {
                        "boost" : 2
                    },
                    "properties.url" : {
                        "boost" : 0.5
                    }
                },
                "tags" : {
                    "properties.tags" : {
                        "boost" : 15,
                        "filter" : "prefix"
                    },
                },
                "categories" : {
                    "properties.category" : {
                        "boost" : 15
                    }
                }
            } 
        });
        
        this._showIndexingProgress = this._showIndexingProgress.bind(this);
        this._index.addListener('indexing', this._showIndexingProgress);
        
        const that = this;
        that._searchCriteria = new SearchCriteriaDataSet({ adapters });
        that._searchCriteria.addListener('update', function(intent){
            intent.then(function(){
                let query = that._buildQuery(that._searchCriteria);
                return that._index.search(query);
            });
        });
        
        this.dataSet.items = data;
        this._tagsSuggestionSet = this._buildDataSetFromField(this.dataSet, 'tag', 'properties.tags');
        this._categoriesSuggestionSet = this._loadCategories();
        this._index.search({});
    }
    
    _showIndexingProgress(intent){
        let dialogBox = this.newDialogBox();
        const title = 'Indexing';
        dialogBox.setContent({
            title
        });
        function finalize(){
            dialogBox.setContent({
                title,
                footer : (<button className="btn btn-default" onClick={function(){ dialogBox.close(); }}>Done</button>),
                body : null
            });
            setTimeout(function(){
                dialogBox.close();
            }, 1500);
        }
        intent.then(finalize, finalize);
        let progressBars = {};
        intent.on('progress', function(event){
            let progress = Math.round(100 * event.pos / event.len);
            let show = false;
            if (progress % 10 === 0) {
                progressBars[event.indexKey] = (
                    <div key={'progress-' + event.indexKey} className="progress">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{width: progress + '%'}}>
                          <span className="sr-only">{progress}%</span>
                        </div>
                    </div>
                ); 
                show = true;
            }
            if (show) {
                let body = Object.keys(progressBars).map(function(indexKey){
                    return progressBars[indexKey];
                });
                body = (<div>{body}</div>);
                dialogBox.setContent({
                    title,
                    body
                });
            }
        });
    }
    
    _loadCategories(){
        const categories = require('../data/categories.json');
        categories.forEach(function(cat){
            cat.id = 'category=' + cat.key;
        });
        const adapters = this.app.adapters;
        const dataSet = new DataSet({
            adapters,
            DataType: CategoriesSearchCriteria
        });
        dataSet.items = categories;
        let suggestionSet = dataSet.getAdapter(DataSetIndex, {
            fields : {
                'tags' : { boost : 1, type: 'field' },
                'label' : { boost: 2, type : 'field' },
            }
        });
        return suggestionSet;
    }
    
    _buildDataSetFromField(dataSet, prefix, path){
        const index = {};
        dataSet.each(function(r){
            let values = r.get(path);
            if (!values)
                return ;
            if (!Array.isArray(values)) {
                values = [values];
            }
            values.forEach(function(val) {
                let key = val.toLowerCase();
                let obj = index[key] = index[key] || {
                    id : key,
                    values : []
                };
                if (obj.values.indexOf(val) < 0) {
                    obj.values.push(val);
                    obj.values.sort();
                }
            });
        });
        const result = new DataSet({
            adapters : dataSet.adapters,
            DataType: TagSearchCriteria
        });
        let indexedSet = result.getAdapter(DataSetIndex, { 
            fields: { 'values' : { boost : 1 } }
        });
        result.items = Object.keys(index).sort().map(function(key) {
            return index[key];
        });
        return indexedSet;
    }
    
    
    renderContent(){
        // Search:
        // * dataSet - where we search
        // * searchCriteria - contains all selected search criteria
        // * auto-completion search - method "search" providing suggestions
        // selected suggestions are added to the search criteria set
         
        const dataSet = this.dataSet;
        const selectedItems = new DataSetSelection({dataSet});
        const openItems = new DataSetSelection({dataSet});
        const paginatedDataSet = new DataSetPaginated({dataSet:this._index});
        
        paginatedDataSet.pageSize = 20;
        const paginationView = new ListPaginationView({
            dependencies : [paginatedDataSet],
            dataSet : paginatedDataSet,
        });

        const listView = this.dataSet.getAdapter(ListView, {
            dependencies : [paginatedDataSet, selectedItems, openItems],
            openItems : openItems, 
            dataSet : paginatedDataSet
        });
        // ----------------------------------------------------------
        const selectOptions = {
            placeholder: 'Type something...',
            searchPromptText: 'Enter a text',
            noResultsText: 'Nothing was found'
        };
        return (
            <div>
                <AutocompleteBox 
                    search={this._suggest.bind(this)}
                    selected={this._searchCriteria}
                    selectOptions={selectOptions} />
                {paginationView.renderView()}
                {listView.renderView()}
                {paginationView.renderView()}
            </div>
        ); 
    }

}
