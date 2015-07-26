import './css/index.less';
import { Application, AppModule, AppUrlNavigation } from 'mosaic-app';
import MainScreen from './MainScreen';
import StateViewScreen from './StateViewScreen';
import TagsScreen from './TagsScreen';
import I18NMessages from './I18NMessages';

class MainApplication extends Application {
    constructor(){
        super({
            stateFields : ['theme', 'mode', 'locale'],
            i18n : I18NMessages
        });  
    }
    start(){
        const screenOptions = {
            app : this,
            container : document.querySelector('#content'),
            dialogsContainer : document.querySelector('#dialogs'),
        };
        this.registerModule('tags/*localPath', new TagsScreen(screenOptions));
        this.registerModule('state/*localPath', new StateViewScreen(screenOptions));
        this.registerModule('*localPath', new MainScreen(screenOptions));
    }
}

const app = new MainApplication();
const nav = new AppUrlNavigation({app});
nav.addUrlMask(':mode/:locale/*path');
nav.start().then(function(){
    console.log('Application started.');
});
