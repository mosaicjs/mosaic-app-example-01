import React from 'react';
import ResourceListItemView from './ResourceListItemView';

export default class InvestisseurItemView extends ResourceListItemView {
    get className(){ return 'invest'; }
    get style(){
        return {
            backgroundColor: 'silver',
            color: 'white'
        }; 
    }
}
