import React from 'react';
import { AppScreen } from 'mosaic-app-ui';
import AppStatePanel from './AppStatePanel';

export default class StateViewScreen extends AppScreen {
    
    renderTitle(){ return 'Application State Screen'; }
    
    renderContent(){
        return (
            <AppStatePanel app={this.app} />
        ); 
    }    
    
}


