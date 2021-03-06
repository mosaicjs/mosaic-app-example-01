import React from 'react';
import SearchCriteriaSuggestionView from './SearchCriteriaSuggestionView';

export default class TextSearchCriteriaSuggestionView extends SearchCriteriaSuggestionView {
    renderView(){
        const iconClass = this.item.icon;
        let icon;
        if (iconClass){
            icon = <i className={iconClass}></i>
        }
        return (
            <span style={{color:'gray'}}>
                {icon}{' '}
                Search for &laquo;
                <span style={{color:'black'}}>{this.item.label}</span>
                &raquo;
            </span>
        );
    }
}