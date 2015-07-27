import React from 'react';
import AppUi from 'mosaic-app-ui';
const { ResourceListItemView  } = AppUi.views.list;

export default class InvestisseurItemView extends ResourceListItemView {
    get className(){ return 'invest'; }
    get style(){
        return {
            backgroundColor: 'silver',
            color: 'white'
        }; 
    }
}
