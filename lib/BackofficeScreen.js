import React from 'react';
import { AppScreen } from 'mosaic-ui-app';
import AppStatePanel from './AppStatePanel';
import AppMenu from './AppMenu';
import DialogBox from './DialogBox';

export default class BackofficeScreen extends AppScreen {
    
    renderTitle(){ 
        return <AppMenu app={this.app} />;
    }
    
    renderContent(){
        return (
            <AppStatePanel app={this.app} />
        ); 
    }
    
    newDialogBox(){
        return DialogBox.show(this.options.dialogsContainer); 
    }
    
}


