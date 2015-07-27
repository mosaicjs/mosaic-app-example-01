var FS = require('fs');
var data = require('./data-1.json');
data.features.forEach(function(item){
   var str = item.properties.description;
   str = str.replace(/\s+/gim, ' ');
   item.properties.description = str;
});
FS.writeFileSync('./data-2.json', JSON.stringify(data, null, 2), 'UTF-8');