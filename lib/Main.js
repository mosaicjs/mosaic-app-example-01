import './css/index.less';
import { Application, AppModule, AppUrlNavigation } from 'mosaic-app';
import MainScreen from './MainScreen';
import StateViewScreen from './StateViewScreen';
import TagsScreen from './TagsScreen';
import I18NMessages from './I18NMessages';

import AppModel from './model/AppModel';
import data from '../data/data-2.json';

class MainApplication extends Application {
    constructor(){
        super({
            stateFields : ['theme', 'mode', 'locale'],
            i18n : I18NMessages
        });  
    }
    _initModel(){
        const that = this;
        return Promise.resolve().then(function(){
            const adapters = that.adapters;
            that.model = new AppModel({adapters});
            return that.model.open().then(function(){
                return that.model.setItems(data.features);
            });
        }).then(function(){
            console.log('???');
        }, function(err){
            console.log(err);
            throw err;
        });
    }
    _registerAdapters(){
        const adapters = this.adapters;
        require('./list')(this.adapters);
        require('./search')(this.adapters);
    }
    start(){
        const that = this;
        return Promise.resolve().then(function(){
            return that._initModel(); 
        }).then(function(){
            console.log('????');
            return that._registerAdapters();
        }).then(function(){
            const screenOptions = {
                app : that,
                container : document.querySelector('#content'),
                dialogsContainer : document.querySelector('#dialogs'),
            };
            that.registerModule('tags/*localPath', new TagsScreen(screenOptions));
            that.registerModule('state/*localPath', new StateViewScreen(screenOptions));
            that.registerModule('*localPath', new MainScreen(screenOptions));
        });
    }
}

const app = new MainApplication();
const nav = new AppUrlNavigation({app});
nav.addUrlMask(':mode/:locale/*path');
nav.start().then(function(){
    console.log('Application started.');
}, function(err){
    console.log('ERROR', err);
});



