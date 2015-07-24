import React from 'react';

import { AppModule } from 'mosaic-app';
import { Data, DataSet, DataSetPaginated, DataSetSelection } from 'mosaic-dataset';
import { DataSetIndex } from 'mosaic-dataset-index';

import AppUi from 'mosaic-app-ui';
const { AppScreen } = AppUi;
const { Resource, FocusDataSet } = AppUi.model;
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
import AppStatePanel from './AppStatePanel';

// --------------------------------------------------------------------------
// Search criteria of different types

class FieldSearchCriteria extends SearchCriteria {
    get iconClass(){ return 'glyphicon glyphicon-tag'; }
}


class TagSearchCriteria extends SearchCriteria {
    get iconClass(){ return 'glyphicon glyphicon-tag'; }
}

class CategoriesSearchCriteria extends SearchCriteria {
    get iconClass() { return 'glyphicon glyphicon-folder-open'; }
    get label() { return this.get('label'); }
}

//--------------------------------------------------------------------------
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

/**
 * This dataset aggregates results from other searchable datasets and provides
 * access to an aggregated list.
 */ 
class SearchableDataSet extends DataSet {
    constructor(options, ...params){
        super(options, ...params);
        this.searchActions = this.options.dataSets;
    }
    get limitPerGroup() { return this.options.limitPerGroup || 3; }
    get searchActions() { return this._searchActions || []; }
    set searchActions(list) {
        this._searchActions = list || [];
    }
    
    search(query) {
        const that = this;
        const actions = that.searchActions;
        let promise = Promise.resolve();
        let result = [];
        actions.forEach(function(action){
            promise = promise.then(function(){
                return action(query);
            }).then(function(list){
                if (!list || !list.length)
                    return ;
                result = result.concat(list);
            });
        });
        return promise.then(function(){
            return that.setItems(result).then(function(){
                return that;
            })
        });
     }
} 

export default class MainScreen extends AppScreen {
    
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
    
    setSearchCriteria(searchCriteria, indexDataSet){
        function addFilter(list, field, criteria) {
            const index = {};
            criteria.values.forEach(function(val) {
                index[val] = true;
            })
            list.push(function(item) {
                let values = item.get(field) || [];
                let result = false;
                for (let i = 0, len = values.length; !result && i<len; i++) {
                    result = (values[i] in index);
                }
                return result;
            });
        }
        function addSearch(criteria, list){
            list.push(criteria.query);
        }
        
        const filters = [];
        const queries = [];
        searchCriteria.each(function(criteria){
            if (criteria instanceof TagSearchCriteria) {
                addFilter(filters, 'properties.tags', criteria);
            } else if (criteria instanceof CategoriesSearchCriteria) {
                addFilter(filters, 'properties.category', criteria);
            } else if (criteria instanceof TextSearchCriteria) {
                addSearch(criteria, queries);
            }
        });
        console.log('???', queries, filters);
        indexDataSet.updateSearchParams({
            query : queries.join(' '),
            filter : function(item){
                let result = true;
                for (let i = 0, len = filters.length; result && i < len; i++) {
                    result &= filters[i](item);
                }
                return result;
            }
        });
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
        this.dataSet.items = data;
        
        this._tagsSuggestionSet = this._buildSearchableSet(this.dataSet, 'tag', 'properties.tags');
        this._categoriesSuggestionSet = this._loadCategories();
        
        const that = this;
        that._searchCriteria = new SearchCriteriaDataSet({ adapters });
        that._searchCriteria.on('update', function(intent){
            intent.then(function(){
                let index = that.dataSet.getAdapter(DataSetIndex);
                that.setSearchCriteria(that._searchCriteria, index);
            });
        });
    }
    
    renderTitle(){ return 'Main Screen Title'; }

    _loadCategories(){
        const categories = require('../data/categories.json');
        categories.forEach(function(cat){
            cat.id = 'category=' + cat.key;
            delete cat.key;
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
    
    _buildSearchableSet(dataSet, prefix, path){
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
        //  selected suggestions are added to the search criteria set
         
        const dataSet = this.dataSet;
        const selection = dataSet.getAdapter(DataSetSelection);
        const focusDataSet = new DataSetSelection({dataSet});
        const searchDataSet = dataSet.getAdapter(DataSetIndex);
        const paginatedDataSet = searchDataSet.getAdapter(DataSetPaginated);
        
        paginatedDataSet.pageSize = 20;
        const paginationView = new ListPaginationView({
            dependencies : [paginatedDataSet],
            dataSet : paginatedDataSet,
        });

        const listView = this.dataSet.getAdapter(ListView, {
            dependencies : [paginatedDataSet, selection, focusDataSet],
            focusDataSet : focusDataSet, 
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
                <AppStatePanel app={this.app} />
                <hr />
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
