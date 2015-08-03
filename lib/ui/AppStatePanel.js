import React from 'react';

const AppStateMessages = {
    title : 'Application State Management',
    theme: 'Theme :',
    mode: 'Mode :',
    lang : 'Language :',
    getLangLabel : function(lang){
        const labels = this.langLabels || {};
        return labels[lang] || lang;
    }
};
export default class AppStatePanel extends React.Component {
    
    // -------------------------------------------------------------------
    // Locales
    
    _renderLangSwitcher() {
        const that = this;
        const app = this.props.app;
        return that._formatList({
            list : ['en', 'fr', 'ru'],
            current: app.state.locale,
            label : that.messages.lang,
            valueLabels : function(lang){
                return that.messages.getLangLabel(lang);
            },
            onClick : function(locale, ev){
                app.setState({locale});
// app.locale = locale;
                ev.preventDefault();
                ev.stopPropagation();
            }
        });
    }

    // -------------------------------------------------------------------
    // Themes
    
    _renderThemeSwitcher() {
        const app = this.props.app;
        return this._formatList({
            list : ['light', 'dark'],
            current: app.state.theme,
            label : this.messages.theme,
            onClick : function(theme, ev){
                app.theme = theme;
                ev.preventDefault();
                ev.stopPropagation();
            }
        });
    }

    // -------------------------------------------------------------------
    // Modes

    _renderModeSwitcher() {
        const app = this.props.app;
        return this._formatList({
            list : ['mobile', 'tablet', 'desktop', 'embed'],
            current: app.state.mode,
            label : this.messages.mode,
            onClick : function(mode, ev){
                app.mode = mode;
                ev.preventDefault();
                ev.stopPropagation();
            }
        });
    }
    
    // -------------------------------------------------------------------

    _formatList(options){
        return (
            <div>
                {options.label} 
                {options.list.map(function(value){
                    let label = options.valueLabels ? options.valueLabels(value) : value;
                    let ref;
                    if (value === options.current) {
                        return (
                            <strong key={'selected-' + value}>
                                &nbsp;
                                {label}
                                &nbsp;
                            </strong>
                        )
                    } else {
                        const onClick = options.onClick.bind(this, value);
                        return (
                            <span key={'ref-' + value}>
                                &nbsp;
                                <a href="#" onClick={onClick}>{label}</a>
                                &nbsp;
                            </span>
                        );
                    }
                    
                }, this)}
            </div>
        );
    }
    
    render(){
       const app = this.props.app;
       const appState = app.state;
       this.messages = app.getMessages('AppStateMessages', AppStateMessages);
       return (
           <div>
           {this._renderLangSwitcher()}
           {this._renderThemeSwitcher()}
           {this._renderModeSwitcher()}
           <hr />
           <div>mode: {appState.mode}</div>
           <div>locale: {appState.locale}</div>
           <div>path: {appState.path}</div>
           <div>theme: {appState.theme}</div>
           <div>toto: {appState.toto}</div>
           </div>
       );
   }
}