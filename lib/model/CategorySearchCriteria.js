import { SearchCriteria } from 'mosaic-dataset-index';

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