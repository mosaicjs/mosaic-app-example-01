import AppUi from 'mosaic-app-ui';
const { Resource } = AppUi.model;
const { SearchCriteria, SearchCriteriaDataSet } = AppUi.views.search;

export default class CategorySearchCriteria extends SearchCriteria {
    
    static get indexKey(){ return 'categories'; }
    static get indexFields(){
        return {
            "properties.category" : {
                "boost" : 15
            }
        };
    }
    static get suggestionFields(){
        return {
            'tags' : { boost : 1, type: 'field' },
            'label' : { boost: 2, type : 'field' },
        };
    }
    get indexKey(){ return this.constructor.indexKey; }
    get icon(){ return 'glyphicon glyphicon-folder-open'; }
}