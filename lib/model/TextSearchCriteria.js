import AppUi from 'mosaic-app-ui';
const { Resource } = AppUi.model;
const { SearchCriteria, SearchCriteriaDataSet } = AppUi.views.search;

export default class TextSearchCriteria extends SearchCriteria {
    
    static get indexKey(){ return 'full'; }
    static get indexFields(){
        return {
            "properties.name" : {
                "boost" : 10
            },
            "properties.description" : {
                "boost" : 5
            },
            "properties.tags" : {
                "boost" : 15,
                "filter" : true
            },
            "properties.address" : {
                "boost" : 1
            },
            "properties.postcode" : {
                "boost" : 1,
                "filter" : "prefix"
            },
            "properties.city" : {
                "boost" : 2
            },
            "properties.url" : {
                "boost" : 0.5
            }
        }
    }

    get indexKey(){ return this.constructor.indexKey; }
    get icon(){ return 'glyphicon glyphicon-search'; }
}