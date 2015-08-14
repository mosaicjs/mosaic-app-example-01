module.exports = {
    definitions : {
        weight : {
            title : "Weight",
            type : "object",
            properties : {
                amount : {
                    type : "number",
                    minimum : 0,
                    exclusiveMinimum : true
                },
                unit : {
                    enum : [ "kg", "lbs" ],
                    // optional, see
                    // https://github.com/json-schema/json-schema/wiki/enumNames-(v5-proposal)
                    // this is handy for i18n since then you want to separate
                    // values/names
                    enumNames : [ "KG", "lbs" ]
                }
            }
        }
    },
    title : "Example form",
    description : "A form based on a schema",
    type : "object",
    required : [ "name", "age" ],
    'x-hints' : {
        form : {
            classes : 'my-nice-form'
        }
    },
    properties : {
        name : {
            title : "Your name",
            description : "Your full name",
            type : "string",
            minLength : 3,
            maxLength : 40,
            pattern : "^[A-Z][a-z]*(\\s[A-Z][a-z]*)*$",
            'x-hints' : {
                form : {
                    classes : 'important-field'
                }
            }
        },
        age : {
            title : "Your age",
            type : "integer",
            minimum : 1
        },
        weight : {
            title : "Your weight",
            "$ref" : "#/definitions/weight"
        },
        color : {
            title : "Favourite colour",
            type : "object",
            properties : {
                hasFave : {
                    title : "Do you have a favourite colour?",
                    type : "string"
                }
            },
            oneOf : [
                    {},
                    {
                        properties : {
                            hasFave : {
                                enum : [ "no" ]
                            }
                        }
                    },
                    {
                        properties : {
                            hasFave : {
                                enum : [ "yes" ]
                            },
                            fave : {
                                title : "Your favourite colour",
                                type : "string",
                                enum : [ "", "red", "green", "blue", "yellow",
                                        "orange", "purple", "other" ]
                            }
                        }
                    } ],
            "x-hints" : {
                form : {
                    selector : "hasFave",
                }
            }
        },
        interests : {
            title : "Your interests",
            type : "array",
            minItems : 2,
            items : {
                type : "string",
                minLength : 2
            }
        },
        languages : {
            title : "Languages you speak",
            type : "array",
            maxItems : 2,
            items : {
                type : "string"
            }
        }
    }
};
