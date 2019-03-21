var fs = require('fs');
const path = require('path')

//require all the models 
var models = {};
var names = fs.readdirSync(path.resolve(__dirname));

names.forEach(name => {
  if (!name.match(/\.js$/)) return;
  if (name === 'connection-string.js' || name === 'all-models.js') return;
  var model = require('./' + name);
  models[model.modelName] = model;
});

// define non-enumerable method to place each model onto an object. primarily for making them global
Object.defineProperty(models.__proto__, 'toContext', {
  enumerable: false,
  value: function(context) {
    for (var name in this) {
      context[name] = this[name];
    }
    return context;
  }
});

module.exports = models;