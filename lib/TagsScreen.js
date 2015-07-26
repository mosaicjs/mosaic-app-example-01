import React from 'react';
import { AppScreen } from 'mosaic-app-ui';
import BackofficeScreen from './BackofficeScreen';

export default class StateViewScreen extends BackofficeScreen {
    
    renderContent(){
        return (
            <div>
                <h3>List of tags</h3>
            </div>
        ); 
    }    
    
}


