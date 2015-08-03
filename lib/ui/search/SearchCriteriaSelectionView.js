import React from 'react';
import { SelectionView } from 'mosaic-ui-autocomplete';

export default class SearchCriteriaSelectionView extends SelectionView {
    renderView(){
        const iconClass = this.item.icon;
        let icon;
        if (iconClass){
            icon = <i className={iconClass}></i>
        }
        return <span>{icon} {this.item.label}</span>;
    }
}