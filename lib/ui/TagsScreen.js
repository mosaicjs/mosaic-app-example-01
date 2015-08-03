import React from 'react';
import { DataSet, DerivativeDataSet, DataSetPaginated, DataSetSelection } from 'mosaic-dataset';
import { SearchCriteriaDataSet } from 'mosaic-dataset-index';
import { AutocompleteBox } from 'mosaic-ui-autocomplete';
import { ListView,  ListPaginationView, ListSizeView } from 'mosaic-ui-list';

import BackofficeScreen from './BackofficeScreen';

export default class TagsViewScreen extends BackofficeScreen {

    constructor(options){
        super(options);
        const model = this.app.model;
        const dataSet = model.tags;

        this._tags = new DerivativeDataSet({dataSet});
        this._tags.items = model.tags.items;
        const paginatedDataSet = new DataSetPaginated({dataSet: this._tags});
        paginatedDataSet.pageSize = 100;
        
        this._tagsSearchCriteria = new SearchCriteriaDataSet({dataSet});
        
        const that = this;
        this._tagsSearchCriteria.addListener('update', function(intent){
            intent.then(function(){
                let array = [];
                that._tagsSearchCriteria.forEach(function(item){
                    array = array.concat(item.values);
                });
                let query = array.join(' ');
                return that.app.model.suggestTags(query).then(function(list){
                    return that._tags.setItems(list);
                });
            })
        });

        const selectedItems = this._selectedTags = new DataSetSelection({dataSet});
        const selectedPaginatedItems  = new DataSetPaginated({dataSet: selectedItems});
        selectedPaginatedItems.pageSize = 100;
        
        this._paginationView = dataSet.getAdapter(ListPaginationView, {
            dependencies : [paginatedDataSet],
            dataSet : paginatedDataSet,
        });
        
        this._listSizeView = dataSet.getAdapter(ListSizeView, {
            dependencies : [selectedItems],
            dataSet : selectedItems,
        });
        
        this._listView = dataSet.getAdapter(ListView, {
            dependencies : [paginatedDataSet, selectedItems],
            selectedItems : selectedItems, 
            dataSet : paginatedDataSet,
            emptyList : this._itemsEmptyMessage.bind(this)
        });
        this._selectionPaginationView = selectedItems.getAdapter(ListPaginationView, {
            dependencies : [selectedPaginatedItems],
            dataSet : selectedPaginatedItems,
        });
        this._selectedListView = selectedItems.getAdapter(ListView, {
            dependencies : [selectedPaginatedItems, selectedItems],
            selectedItems : selectedItems, 
            dataSet : selectedItems,
            emptyList : this._selectionItemsEmptyMessage.bind(this)
        });
        
        that._selectedTags.addListener('update', function(intent){
             intent.then(function(){
                 let query = SearchCriteriaDataSet.getQuery(that._selectedTags);
                 console.log('>>> selection updated!', query);
             });
        });
        that.app.model.addListener('updateItems', this._showClocks.bind(this));

    }
    
    _onRenameBtn(ev){
        ev.stopPropagation();
        ev.preventDefault();
        if (!this._selectedTags.length)
            return ;
        // TODO: externalize messages
        var newTag = prompt("Please enter a new tag name", "");
        if (newTag === null) return;
        this.app.model.renameTags(this._selectedTags, newTag);
    }
    
    _showClocks(intent){
        console.log('Start process...');
        intent.then(function(){
            console.log('End process.');
        }, function(err){
            console.log('End process with an error.', err);
        });
    }
    
    _suggestTags(query){
        const model = this.app.model;
        const maxNumber = 4;
        return model.aggregateSuggestions([
            model.suggestTextQuery(query, maxNumber),
            model.suggestTags(query, maxNumber)
        ]);
    }
    
    _selectionItemsEmptyMessage(){
        if (this._selectedTags.length > 0)
            return ;
        // TODO: externalize messages
        return <strong>No selected tags</strong>;
    }
    _itemsEmptyMessage(){
        if (this._selectedTags.length > 0)
            return ;
        // TODO: externalize messages
        return <strong>No tags found</strong>;
    }
    renderContent(){
        // TODO: externalize messages
        const selectOptions = {
            placeholder: 'Search tags...',
            searchPromptText: 'Enter a tag',
            noResultsText: 'Nothing was found'
        };
        const selectionBlockLabel = 'Selected tags';
        let listLayout = this._listView.renderView();
        return (
            <div className="row" key="screen-tags">
                <div key="first" className="col-md-6">
                    <AutocompleteBox 
                        key="tags"
                        search={this._suggestTags.bind(this)}
                        selected={this._tagsSearchCriteria}
                        selectOptions={selectOptions} />
                    
                    {this._listSizeView.renderView({ className: "label label-default pull-right"})}
                    {this._paginationView.renderView()}
                    {listLayout}
                    {this._paginationView.renderView()}
                </div>
                <div key="second" className="col-md-6">
                    <h3>{selectionBlockLabel}</h3>
                    <button className="btn btn-default" onClick={this._onRenameBtn.bind(this)}>Rename tags</button>
                    {this._selectionPaginationView.renderView()}
                    {this._selectedListView.renderView()}
                    {this._selectionPaginationView.renderView()}
                </div>
            </div>
        ); 
    }
    
    renderContent1(){
        // TODO: externalize messages
        const selectOptions = {
            placeholder: 'Search tags...',
            searchPromptText: 'Enter a tag',
            noResultsText: 'Nothing was found'
        };
        const selectionBlockLabel = 'Selected tags';
        return (
            <div className="row">
                <div className="col-md-6">
                    <AutocompleteBox 
                        search={this._suggestTags.bind(this)}
                        selected={this._tagsSearchCriteria}
                        selectOptions={selectOptions} />
                    {this._paginationView.renderView()}
                    {this._listView.renderView()}
                    {this._paginationView.renderView()}
                </div>
                <div className="col-md-6">
                    <h3>{selectionBlockLabel}</h3>
                    <button className="btn btn-default" onClick={this._onRenameBtn.bind(this)}>Rename tags</button>
                    {this._selectionPaginationView.renderView()}
                    {this._selectedListView.renderView()}
                    {this._selectionPaginationView.renderView()}
                </div>
            </div>
        ); 
    }
    
}


