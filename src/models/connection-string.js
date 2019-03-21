const url = require('url')
const uri = 'mongodb://admin:admin@127.0.0.1:27017/';
if (!uri) {
  throw new Error(
    'You need to provide the connection string. ' +
    'You can open "models/connection-string.js" and export it or use the "setUri" command.');
}

const uriObj = url.parse(uri)
if (uriObj.protocol !== 'mongodb:') {
  throw new Error('Must be a mongodb URI')
}
if (!uriObj.host || !uriObj.path) {
  throw new Error('Improperly formatted URI')
}

module.exports = uri;

