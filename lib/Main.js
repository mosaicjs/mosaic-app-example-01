import './css/index.less';
import LocationBar from 'location-bar';
import { Application, AppModule, AppNavigation } from 'mosaic-app';
import MainScreen from './MainScreen';
import StateViewScreen from './StateViewScreen';
import I18NMessages from './I18NMessages';
import Promise from 'promise';

const app = new Application({
    stateFields : ['theme', 'mode', 'locale'],
    i18n : I18NMessages
});
const screenOptions = {
    app,
    container : document.querySelector('body')
};

app.registerModule('state/*localPath', new StateViewScreen(screenOptions));
app.registerModule('*localPath', new MainScreen(screenOptions));

class AppUrlNavigation extends AppNavigation {
    constructor(options){
        super(options);
        this._locationBar = new LocationBar(); 
        this._locationBar.onChange(function(path) {
            this.setUrl(path, true).then(function(){
                console.log('URL updated to ', path);
            }, function(err){
                console.log('ERROR!', err);
            });
        }.bind(this));
        this._onAppStateUpdate = this._onAppStateUpdate.bind(this); 
        if (this.options.urlMask){
            this.addUrlMask(this.options.urlMask);
        }
    }
    get locationOptions() {
        return this.options.locationOptions || {
            // pushState: true,
            hashChange: true,
            root: "/",
        };
    } 
    start() {
        const that = this;
        return Promise.resolve().then(function(){
            that.app.on('state', that._onAppStateUpdate);
            that._locationBar.start(that.locationOptions);
        });
    }
    stop() {
        const that = this;
        return Promise.resolve().then(function(){
            that.app.removeListener('state', this._onAppStateUpdate);
        });
    }
    _onAppStateUpdate(intent){
        const that = this;
        intent.then(function(){
            that._locationBar.update(nav.url, {
                trigger : false,
// replace : true
            }); 
        });
    }
}

const nav = new AppUrlNavigation({app});
nav.addUrlMask(':mode/:locale/*path');
nav.start().then(function(){
    console.log('Application started.');
});
