module.exports = {
    title : "Example form",
    description : "A form based on a schema",
    type : "object",
    required : [ "properties" ],
    'x-hints' : {
        form : {
            classes : 'my-nice-form'
        }
    },
    properties : {
        // It is a GeoJSON field called "properties"
        "properties" : {
            type : "object",
            required : [ "id", "name", "tags", "address", "postcode", "city", "creationyear", "url"  ],
            properties : {
                "id" : {
                    title : 'Identifier:',
                    'x-hints' : {
                        form : {
                            classes : 'important-field'
                        }
                    }
                },
                "name" : {
                    title : "Company Name:",
                    description : "Please enter a full name of your company",
                    type : "string",
                    minLength : 3,
                    maxLength : 40,
                    pattern : "^\\S.*$",
                },
                "tags" : {
                    title : 'Tags:',
                    type : "array",
                    minItems : 1,
                    maxItems : 5,
                    items : {
                        type : "string",
                        minLength : 2,
                        maxLength : 20
                    }
                },
                "address" : {
                    title : 'Address:'
                },
                "postcode" : {
                    title : 'Post code:',
                    type : "number",
                    length : 5,
                    minimum: 75000,
                    maximum: 94000,
                    pattern : /^\d\d\d\d\d$/,
                },
                "city" : {
                    title : 'City:'
                },
                "creationyear" : {
                    title : 'Creation Year:',
                    type : 'number',
//                    pattern: /^([1-9]{4})$/
                    minimum : 1900,
                    maximum : 2015, // new Date().getYear()
                },
                "url" : {
                    title : 'URL:',
                    type : 'string',
                    pattern : /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/
                }
            }
        }
    }
};
