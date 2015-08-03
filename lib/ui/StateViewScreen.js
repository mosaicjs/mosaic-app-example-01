import React from 'react';
import AppStatePanel from './AppStatePanel';
import BackofficeScreen from './BackofficeScreen';

export default class StateViewScreen extends BackofficeScreen {
    
    renderContent(){
        return (
            <div  key="screen-status">
                <AppStatePanel app={this.app}></AppStatePanel>
            </div>
        ); 
    }    
    
}


