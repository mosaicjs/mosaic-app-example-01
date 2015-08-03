import React from 'react';
import { SuggestionView } from 'mosaic-ui-autocomplete';

export default class SearchCriteriaSuggestionView extends SuggestionView {
    renderView(){
        const iconClass = this.item.icon;
        let icon;
        if (iconClass){
            icon = <i className={iconClass}></i>
        }
        return <span>{icon} {this.item.label}</span>;
    }
}