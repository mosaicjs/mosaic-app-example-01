import React from 'react';
import { View, ViewLayout } from 'mosaic-ui';
import { ListItemView } from 'mosaic-ui-list';
import { FormView } from 'mosaic-ui-form'; 
import ResourceListItemView from './ResourceListItemView';

import Schema from './schema';

export default class InvestisseurItemView extends ResourceListItemView {
    constructor(...params){
        super(...params);
        this._view = this.object.getAdapter(FormView, {
            buttons: ['Dismissed', 'Energise'],
            onSubmit : this._onFormSubmit.bind(this),
            schema : Schema,
            key : this.object.id
        });
    }
    get className(){ return 'panel panel-info invest'; }
    get style(){
        return {
            backgroundColor: 'silver',
            color: 'white'
        }; 
    }
    _onFormSubmit(ev){
        console.log('CLICKED!', arguments);
    }
    _renderContent(){
//        let result = super._renderContent();
        return this._view.renderView();
    }
}

