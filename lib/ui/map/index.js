import { LeafletAdapter } from 'mosaic-ui-map';
import InvestisseurLeafletAdapter from './InvestisseurLeafletAdapter';

export default function(adapters){
    adapters.registerAdapter('Resource/Investisseur', LeafletAdapter, InvestisseurLeafletAdapter);
}

