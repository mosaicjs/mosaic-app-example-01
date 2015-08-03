import React from 'react';
import Promise from 'promise';
import { View, ViewLayout } from 'mosaic-ui';

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
        const item = this.object;
        if (selected) {
            return selectedItems.add(item);
        } else {
            const pos = selectedItems.pos(item);
            return selectedItems.remove(pos);
        }
    }
    get isSelected(){
        const dataSet = this.selectedItems;
        if (!dataSet)
            return false;
        return dataSet.has(this.object);
    }
    _getKey(){
        return this.object.id;
    }
    _getLabel(){
        return this.object.label;
    }
    renderView(){
        return (
           <TagListItemLayout key={this._getKey()} view={this} />
        );
    }
}


class TagListItemLayout extends ViewLayout {
    constructor(...params){
        super(...params);
        this._onClick = this._onClick.bind(this);
        this.state = this._newState({selected : this.props.view.isSelected });
    }
    componentWillReceiveProps(props){
        this._updateState({selected : props.view.isSelected});
    }
    _onClick(ev) {
        const view = this.props.view;
        view.setSelected(!this.state.selected);
        ev.preventDefault();
        ev.stopPropagation();
    }
    render(){
        const view = this.props.view;
        const key = view._getKey();
        return (
            <div key={key} className={view.className} style={view.style}>
                <strong>
                    <a href="#" onClick={this._onClick}>
                        {view._getLabel()}
                    </a>
                </strong>
            </div>
        );
    }
}  