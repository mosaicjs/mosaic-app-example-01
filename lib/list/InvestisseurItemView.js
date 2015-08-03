import React from 'react';
import { ListItemView } from 'mosaic-ui-list';

export default class InvestisseurItemView extends ListItemView {
    get className(){ return 'invest'; }
    get style(){
        return {
            backgroundColor: 'silver',
            color: 'white'
        }; 
    }
}
