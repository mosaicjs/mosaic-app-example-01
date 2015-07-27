import AppUi from 'mosaic-app-ui';
const { Resource } = AppUi.model;
const { SearchCriteria, SearchCriteriaDataSet } = AppUi.views.search;

export default class TagSearchCriteria extends SearchCriteria {
    
    static get indexKey(){ return 'tags'; }
    static get indexFields(){
        return {
            "properties.tags" : {
                "boost" : 15,
                "filter" : "prefix"
            },
        };
    }
    static get suggestionFields(){
        return {
            'values' : { boost : 1 }
        };
    }

    get indexKey(){ return this.constructor.indexKey; }
    get icon(){ return 'glyphicon glyphicon-tag'; }
}