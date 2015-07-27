import AppUi from 'mosaic-app-ui';
import { TypeKey } from 'mosaic-adapters';
const { Resource } = AppUi.model;
const { ListItemView, ResourceListItemView, ListPaginationView } = AppUi.views.list;
const { AutocompleteBox } = AppUi.views.autocomplete;
const {
    SearchCriteria,
    SearchCriteriaSuggestionView,
    SearchCriteriaSelectionView
} = AppUi.views.search;
import TextSearchCriteria from '../model/TextSearchCriteria';
import TextSearchCriteriaSuggestionView from './TextSearchCriteriaSuggestionView';

export default function(adapters){
    adapters.registerAdapter(SearchCriteria, AutocompleteBox.SuggestionView, SearchCriteriaSuggestionView); 
    adapters.registerAdapter(SearchCriteria, AutocompleteBox.SelectionView, SearchCriteriaSelectionView);
    adapters.registerAdapter(TextSearchCriteria, AutocompleteBox.SuggestionView, TextSearchCriteriaSuggestionView);
}