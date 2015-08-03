import React from 'react';
import expect from 'expect.js';
import { AdapterManager, Adaptable, TypeKey } from 'mosaic-adapters';

describe('TypeKey', function(){
    it('should return default values', function() {
        const types = ['MyResource/Investisseur', 'MyResource/Entreprise'];
        class Foo {}
        class FooBar extends Foo {}
        class MyResource extends Adaptable {
            getTypeKey(){
                if (!this._typeKey){
                    const pos = MyResource._counter = (MyResource._counter || 0) + 1;
                    this._typeKey = TypeKey.for(types[pos % types.length]); 
                }
                return this._typeKey;
            }
        }
        
        const adapters = new AdapterManager();
        adapters.registerAdapter(MyResource, Foo, FooBar);
        let count = 100;
        const items = [];
        for (let i=0; i<count; i++) {
            items.push(new MyResource({adapters}));
        }
        
        items.forEach(function(item, pos){
            const adapter = item.getAdapter(Foo);
            expect(item.getTypeKey()).to.be(TypeKey.for(types[(pos + 1) % types.length]));
        });
    });
});

import { Data, DataSet } from 'mosaic-dataset';
import { DataSetIndex } from 'mosaic-dataset-index';

/**
 */
describe('Resource provider', function(){
    class Tag extends Data {}
    let dataSet;
    let index;
    beforeEach(function(){
        dataSet = new DataSet({
            DataType : Tag
        });
        index = new DataSetIndex({ dataSet, fields : {
            'value' : { boost : 1 },
        }});
        dataSet.items = [{
            id : 'id-123',
            value : 'Hello, world'
        }, {
            id : 'id-325',
            value : 'A new world, world!'
        }, {
            id : 'id-897',
            value : 'école superieur'
        }, {
            id : 'id-987',
            value : 'ECOLE'
        }, {
            id : 'id-9983',
            value: 'auto-écoles'
        }];
    });
    it('should be able to provide resources for autocompletion', function(done){
        index.search('world').then(function(results){
            const control = [{
                id : 'id-325',
                value : 'A new world, world!'
            }, {
                id : 'id-123',
                value : 'Hello, world'
            }];
            expect(index.length).to.be(control.length);
            index.each(function(item, pos) {
                expect(item instanceof Tag).to.be(true);
                expect(item.data).to.eql(control[pos]);
            })
        }).then(done, done);
    });
    it('should be able search words with accents', function(done){
        index.search('école').then(function(results){
            const control = [{
                id : 'id-987',
                value : 'ECOLE'
            }, {
                id : 'id-897',
                value : 'école superieur'
            }, {
                id : 'id-9983',
                value: 'auto-écoles'
            }];
            expect(index.length).to.be(control.length);
            index.each(function(item, pos) {
                expect(item.data).to.eql(control[pos]);
            });
        }).then(done, done);
    });
    
});
