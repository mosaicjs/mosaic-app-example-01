import { Data, DataSet, DataSetPaginated, DataSetSelection } from 'mosaic-dataset';
import { DataSetIndex, SearchableDataSet, SearchCriteria, SearchCriteriaDataSet } from 'mosaic-dataset-index';

import TextSearchCriteria from './TextSearchCriteria';
import TagSearchCriteria from './TagSearchCriteria';
import CategorySearchCriteria from './CategorySearchCriteria';

export default class AppModel extends DataSet {

    constructor(...params){
        super(...params)
        const adapters = this.adapters;
        
        // Tags
        this.tags = new DataSet({adapters, DataType : TagSearchCriteria });
        this.tagsIndex = this.tags.getAdapter(DataSetIndex, {
            fields: TagSearchCriteria.suggestionFields
        });
        
        // Categories
        this.categories = new DataSet({adapters, DataType : CategorySearchCriteria });
        this.categoriesIndex = this.categories.getAdapter(DataSetIndex, {
            fields : CategorySearchCriteria.suggestionFields
        });
        
        // Search criteria and index
        this.searchCriteria = new SearchCriteriaDataSet({ adapters });
        
        this.searchIndex = new SearchableDataSet({
            dataSet : this,
            indexFields: {
                [TextSearchCriteria.indexKey] : TextSearchCriteria.indexFields,
                [TagSearchCriteria.indexKey] : TagSearchCriteria.indexFields,
                [CategorySearchCriteria.indexKey] : CategorySearchCriteria.indexFields
            } 
        });
        
        // Bind event listeners to this object
        this._reindexTags = this._reindexTags.bind(this); 
        this._runSearch = this._runSearch.bind(this);
    }

    // ------------------------------------------------------------------------
    
    open(){
        const that = this;
        return Promise.resolve().then(function(){
            // Activate tags re-indexing
            that.addListener('update', that._reindexTags);
            // Automatically launch search when search criteria changes
            that.addListener('update', that._runSearch);
            that.searchCriteria.addListener('update', that._runSearch);

            const categories = require('../../data/categories.json');
            categories.forEach(function(cat){
                cat.id = 'category:' + cat.key;
                cat.values = [ cat.key ];
            });
            that.categories.items = categories;
        });
    }
    
    close(){
        const that = this;
        const result = super.close();
        return Promise.resolve().then(function(){
            that.searchCriteria.removeListener('update', that._runSearch);
            that.removeListener('update', that._runSearch);
            that.removeListener('update', that._reindexTags)
            return result;
        })
    }
    
    // ------------------------------------------------------------------------

    /**
     * Returns a promise with SearchCriteria objects corresponding to the
     * specified query.
     */
    suggest(query){
        let maxNumber = 4;
        return this.aggregateSuggestions([
            this.suggestTextQuery(query, maxNumber),
            this.suggestCategories(query, maxNumber),
            this.suggestTags(query, maxNumber)
        ]);
    }
    
    aggregateSuggestions(suggestions) {
        return Promise.all(suggestions).then(function(lists){
            const result = [];
            lists.forEach(function(list){
                if (!list || !list.length)
                    return ;
                list.forEach(function(item){
                    result.push(item);
                })
            })
            return result;
        });
    }
    
    suggestTextQuery(query) {
        const that = this;
        const adapters = that.adapters;
        return Promise.resolve().then(function(){
            if (!query || !query.length)
                return [];
            let id = 'q:' + query;
            let data = {
                id,
                values : [ query ]
             };
            return [ new TextSearchCriteria({ data, adapters }) ];
        });
    }
    
    suggestTags(query, maxNumber){
        return this._limitNumber(this.tagsIndex.search(query), maxNumber);
    }

    suggestCategories(query, maxNumber) {
        return this._limitNumber(this.categoriesIndex.search(query), maxNumber);
    }

    _limitNumber(promise, number){
        return promise.then(function(list){
            list = list || [];
            if (!number)
                return list;
            const len = Math.min(number, list.length);
            if (len >= list.length)
                return list;
            const result = [];
            for (let i=0; i<len; i++){
                result.push(list[i]);
            }
            return result;
        });
    }
    
    // ------------------------------------------------------------------------
    
    renameTags(tags, newTag) {
        const that = this;
        return that.action('updateItems', function(intent){
            let query = SearchCriteriaDataSet.getQuery(tags);
            let index = {};
            query.tags.forEach(function(tag){
                index[tag] = true;
            });
            let items = [];
            that.forEach(function(item){
                items.push(that._renameTag(index, item, newTag));
            });
            that.items = items;
            return true;
        });
    }
    
    _renameTag(index, item, newTag){
        // TODO: made these modifications on a edit copy of the data    
        let tags = item.get('properties.tags') || [];
        let newTags = {};
        tags.forEach(function(tag){
            if (tag in index){
                tag = newTag;
            }
            newTags[tag] = true;
        });
        tags = Object.keys(newTags).sort();
        item.set('properties.tags', tags);
        return item;
    }
    
    
    _reindexTags(intent){
        const that = this;
        intent.then(function(){
            const tags = that._extractFieldValues('tag:', 'properties.tags');
            that.tags.items = tags;
        });
    }

    // ------------------------------------------------------------------------
    
    search(query) {
        return this.searchIndex.search(query);
    }
    
    _runSearch(intent){
        const that = this;
        intent.then(function(){
            let query = that.searchCriteria.getQuery();
            return that.searchIndex.search(query);
        });
    }        
    
    _extractFieldValues(prefix, path){
        const index = {};
        this.forEach(function(r){
            let values = r.get(path);
            if (!values)
                return ;
            if (!Array.isArray(values)) {
                values = [values];
            }
            values.forEach(function(val) {
                let key = val.toLowerCase();
                let obj = index[key] = index[key] || {
                    id : prefix + key,
                    values : []
                };
                if (obj.values.indexOf(val) < 0) {
                    obj.values.push(val);
                    obj.values.sort();
                }
            });
        });
        return Object.keys(index).sort().map(function(key) {
            return index[key];
        });
    }
    
    
}