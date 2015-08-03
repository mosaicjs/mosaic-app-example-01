import React from 'react';
import { DataSetPaginated, DataSetSelection } from 'mosaic-dataset';
import { SearchCriteria, SearchCriteriaSuggestionView, SearchCriteriaSelectionView } from 'mosaic-dataset-index';
import 'mosaic-ui-autocomplete/styles';
import { ListView,  ListPaginationView } from 'mosaic-ui-list';
import 'mosaic-ui-list/styles';
import { AutocompleteBox } from 'mosaic-ui-autocomplete';
import BackofficeScreen from './BackofficeScreen';

// --------------------------------------------------------------------------

export default class MainScreen extends BackofficeScreen {

    constructor(options){
        super(options);
        const dataSet = this.app.model;
        const searchableSet = dataSet.searchIndex; 
        
        const paginatedDataSet = new DataSetPaginated({dataSet: searchableSet});
        paginatedDataSet.pageSize = 20;
        
        const selectedItems = new DataSetSelection({dataSet});
        const openItems = new DataSetSelection({dataSet});
        
        this._paginationView = new ListPaginationView({
            dependencies : [paginatedDataSet],
            dataSet : paginatedDataSet,
        });

        this._listView = dataSet.getAdapter(ListView, {
            dependencies : [paginatedDataSet, selectedItems, openItems],
            openItems : openItems, 
            selectedItems : selectedItems,
            dataSet : paginatedDataSet
        });        
    }
    
    renderContent(){
        const selectOptions = {
            placeholder: 'Type something...',
            searchPromptText: 'Enter a text',
            noResultsText: 'Nothing was found'
        };
        const searchCriteria = this.app.model.searchCriteria;
        const suggest = this.app.model.suggest.bind(this.app.model);
        return (
            <div key="screen-main">
                <AutocompleteBox 
                    key="organizations"
                    search={suggest}
                    selected={searchCriteria}
                    selectOptions={selectOptions} />
                {this._paginationView.renderView()}
                {this._listView.renderView()}
                {this._paginationView.renderView()}
            </div>
        ); 
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
    
}
