import './css/index.less';
import { TypeKey } from 'mosaic-adapters';
import { Data } from 'mosaic-dataset';
import { Application, AppModule, AppUrlNavigation } from 'mosaic-app';
import MainScreen from './MainScreen';
import StateViewScreen from './StateViewScreen';
import TagsScreen from './TagsScreen';
import I18NMessages from './I18NMessages';

import AppModel from './model/AppModel';
import data from '../data/data.json';

const TypeKeyCache = {};
class Resource extends Data {
    static getTypeKey(){
        if (!this._typeKey){
            this._typeKey = TypeKey.for(this.name); 
        }
        return this._typeKey;
    }
    getTypeKey(){
        if (!this._typeKey){
            let type;
            const data = this.data;
            if (data && data.properties) {
                const props = data.properties;   
                type = props.type || props.category || null;
            }
            if (type) {
                this._typeKey = TypeKeyCache[type];
            }
            if (!this._typeKey){
                const rootTypeKey = this.constructor.getTypeKey(); 
                if (type) {
                    const list = [].concat(rootTypeKey.segments);
                    list.push(type);
                    let str = list.join('/');
                    this._typeKey = TypeKeyCache[type] = TypeKey.for(str);
                } else {
                    this._typeKey = rootTypeKey;
                }
            }
        }
        return this._typeKey;
    }
}

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
            that.model = new AppModel({
                TypeKey : Resource,
                adapters
            });
            return that.model.open().then(function(){
                return that.model.setItems(data.features);
            });
        }).then(function(){
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
            return that.setState({
                locale : 'fr',
                mode : 'desktop'
            })
        });
    }
}

const app = new MainApplication();
const nav = new AppUrlNavigation({app});
// nav.addUrlMask(':mode/:locale/*path');
nav.addUrlMask('*path');
nav.start().then(function(){
    console.log('Application started.');
}, function(err){
    console.log('ERROR', err);
});



