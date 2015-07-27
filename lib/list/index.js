import AppUi from 'mosaic-app-ui';
import InvestisseurItemView from './InvestisseurItemView';
import TagSearchCriteria from '../model/TagSearchCriteria';
import TagListItemView from './TagListItemView';

const { Resource } = AppUi.model;
const { ListView, ListItemView, ResourceListItemView, ListPaginationView } = AppUi.views.list;

export default function(adapters){
    adapters.registerAdapter(Resource, ListItemView, ResourceListItemView);
    adapters.registerAdapter('Resource/Investisseur', ListItemView, InvestisseurItemView);
    adapters.registerAdapter('Resource/Investisseur', ListItemView, InvestisseurItemView);
    
    adapters.registerAdapter(TagSearchCriteria, ListItemView, TagListItemView);
}

