var packagejson = require('../../../../package.json');
const settings = require('electron-settings');
var version = 'v' + packagejson.version.split('.').join('-');
export default {
  settip: function (pagename, state) {
    var obj = {};
    obj[pagename] = state == undefined ? true : state;

    settings.set(version, obj);
  },
  gettip: function(pagename) {
    return settings.get(`${version}.${pagename}`);
  }
};