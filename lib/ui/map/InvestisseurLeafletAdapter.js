import React from 'react';
import { LeafletAdapter } from 'mosaic-ui-map';

export default class InvestisseurLeafletAdapter extends LeafletAdapter {
    
    newMarker(){
        const latlng = this._getMarkerCoordinates();
        const options = {};
        for (let key in this.options){
            options[key] = this.options[key];
        } 
        const icon = L.icon({
            iconUrl: './images/pnr.svg',
            iconSize: [25, 32], // [14 * 1.4241]
//            iconAnchor: [-12, 0],
            popupAnchor: [0, -10],
        });
        return L.marker(latlng, {
           icon  
        });
    }
    
}

