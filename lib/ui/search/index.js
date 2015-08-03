import { SearchCriteria } from 'mosaic-dataset-index';
import { SuggestionView, SelectionView } from 'mosaic-ui-autocomplete';
import { ListItemView, ResourceListItemView, ListPaginationView } from 'mosaic-ui-list';
import SearchCriteriaSuggestionView from './SearchCriteriaSuggestionView';
import SearchCriteriaSelectionView from './SearchCriteriaSelectionView';

import TextSearchCriteria from '../../model/TextSearchCriteria';
import TextSearchCriteriaSuggestionView from './TextSearchCriteriaSuggestionView';

export default function(adapters){
    adapters.registerAdapter(SearchCriteria, SuggestionView, SearchCriteriaSuggestionView); 
    adapters.registerAdapter(SearchCriteria, SelectionView, SearchCriteriaSelectionView);
    adapters.registerAdapter(TextSearchCriteria, SuggestionView, TextSearchCriteriaSuggestionView);
}