import { ListItemView } from 'mosaic-ui-list';
import InvestisseurItemView from './InvestisseurItemView';
import TagSearchCriteria from '../../model/TagSearchCriteria';
import ResourceListItemView from './ResourceListItemView';
import TagListItemView from './TagListItemView';

export default function(adapters){
    adapters.registerAdapter('Resource', ListItemView, ResourceListItemView);
    adapters.registerAdapter('Resource/Investisseur', ListItemView, InvestisseurItemView);
    adapters.registerAdapter(TagSearchCriteria, ListItemView, TagListItemView);
}

