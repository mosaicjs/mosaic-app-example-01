import React from 'react';
import AppUi from 'mosaic-app-ui';
import Promise from 'promise';
const { View  } = AppUi.views;
import _ from 'underscore';

export default class TagListItemView extends View {
    get className(){ return 'invest'; }
    get style(){
        if (!this.isSelected)
            return ;
        return {
            backgroundColor: 'silver',
            color: 'white'
        }; 
    }
    get selectedItems() { return this.options.selectedItems; }
    setSelected(selected){
        const selectedItems = this.selectedItems;
        if (!selectedItems)
            return Promise.resolve();
        const resource = this.object;
        if (selected) {
            return selectedItems.add(resource);
        } else {
            const pos = selectedItems.pos(resource);
            return selectedItems.remove(pos);
        }
    }
    get isSelected(){
        const dataSet = this.selectedItems;
        if (!dataSet)
            return false;
        return dataSet.has(this.object);
    }
    _getLabel(){
        return this.object.label;
    }
    renderView(){
        return (
           <TagListItemLayout key={this.object.id} view={this} />
        );
    }
}


class TagListItemLayout extends React.Component {
    constructor(...params){
        super(...params);
        this._onClick = this._onClick.bind(this);
        this.state = this._newState();
    }
    componentWillMount(){
        this.setState(this._newState({selected : this.props.view.isSelected }));
    }
    componentWillReceiveProps(props){
        this.setState(this._newState({selected : props.view.isSelected}));
    }
    _newState(state){
        return _.extend({}, this.state, state);
    }
    _onClick(ev) {
        const view = this.props.view;
        view.setSelected(!this.state.selected);
        ev.preventDefault();
        ev.stopPropagation();
    }
    render(){
        const view = this.props.view;
        return (
            <div key={this.props.id} className={view.className} style={view.style}>
                <strong>
                    <a href="#" onClick={this._onClick}>
                        {view._getLabel()}
                    </a>
                </strong>
            </div>
        );
    }
}  