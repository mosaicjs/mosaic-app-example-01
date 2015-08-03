import React from 'react';
var {Navbar, Nav, NavItem, DropdownButton, MenuItem} = require('react-bootstrap');

const AppStateMessages = {
        title : 'Application State Management',
        theme: 'Theme :',
        mode: 'Mode :',
        modes : ['mobile', 'tablet', 'desktop', 'embed'],
        lang : 'Language',
        getCurrentLanguage(lang){
            const labels = this.langLabels || {};
            return this.lang + '(' + (labels[lang] || lang) + ')';
        },
        getLangLabel : function(lang){
            const labels = this.langLabels || {};
            return labels[lang] || lang;
        },
        getModeLabel : function(mode){
            return mode[0].toUpperCase() + mode.substring(1);
        },
        locales : ['en', 'fr', 'ru'],
        
        screenTags : 'Tags',
        screenOrganizations: 'Organizations',
        screenState : 'App State'
        
    };
export default class AppMenuPanel extends React.Component {
    
    _onSwitchLang(locale, ev) {
        const app = this.props.app;
        app.setState({locale});
        ev.preventDefault();
        ev.stopPropagation();
    }
    _getMessages(){
        const messages = this.props.app.getMessages('AppStateMessages', AppStateMessages);
        return messages;
    }
    _renderLocaleMenu() {
        const that = this;
        const app = this.props.app;
        const messages = this._getMessages();
        const list = messages.locales;
        return (
            <DropdownButton key={list[0]} eventKey={list[0]} title={messages.getCurrentLanguage(app.state.locale)}>
            {list.map(function(locale){
                return (
                    <MenuItem key={locale} eventKey={locale} onClick={that._onSwitchLang.bind(that, locale)}>
                    {messages.getLangLabel(locale)}
                    </MenuItem>
                );
            })}
            </DropdownButton>
        );
    }
    _onSwitchMode(mode, ev) {
        const app = this.props.app;
        app.setState({mode});
        ev.preventDefault();
        ev.stopPropagation();
    }
    _renderModeMenu() {
        const that = this;
        const app = this.props.app;
        const messages = this._getMessages();
        const list = messages.modes;
        return (
            <DropdownButton eventKey={list[0]} title={messages.mode}>
            {list.map(function(mode){
                return (
                    <MenuItem key={mode} eventKey={mode} onClick={that._onSwitchMode.bind(that, mode)}>
                    {messages.getModeLabel(mode)}
                    </MenuItem>
                );
            })}
            </DropdownButton>
        )
    }
    _showScreen(path, ev){
        const app = this.props.app;
        app.setState({path});
        if (ev){
            ev.stopPropagation();
            ev.preventDefault();
        }
    }
    _renderScreenReferences(){
        const messages = this._getMessages();
        return [
            <NavItem key="tags" onClick={this._showScreen.bind(this, 'tags/')} eventKey={1} href='#'>{messages.screenTags}</NavItem>,
            <NavItem key="root" onClick={this._showScreen.bind(this, '')} eventKey={2} href='#'>{messages.screenOrganizations}</NavItem>,
            <NavItem key="state" onClick={this._showScreen.bind(this, 'state/')} eventKey={3} href='#'>{messages.screenState}</NavItem>
        ];
    }
    render(){
       const app = this.props.app;
       const appState = app.state;
       const messages = this._getMessages();
       return (
           <Navbar brand={<a href="#">Backoffice</a>} fluid={true}>
               <Nav>
                 {this._renderScreenReferences()}
                 {this._renderModeMenu()}
                 {this._renderLocaleMenu()}
               </Nav>
           </Navbar>
       );
   }
}

function renderNavbar(){
    return (
        <div className="container-fluid">
            <div className="navbar-header">
                <div className="navbar-header">
                    <a href="#" className="navbar-brand">Backoffice</a>
                </div>
            </div>
        </div>
    );
}