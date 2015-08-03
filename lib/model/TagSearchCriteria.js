import { SearchCriteria } from 'mosaic-dataset-index';

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