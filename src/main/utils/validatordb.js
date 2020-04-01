var { DAEMON_CONFIG } = require('../../configmain.js');
// const settings = require('electron-settings');

var datafile = DAEMON_CONFIG.DataFile + '/validatordb.json';

var Datastore = require('nedb');
var db = new Datastore({ filename: datafile, autoload: true });

export default class {
  insert(element) {
    // global.__lambNodeinfo.network
    element.__network = global.__lambNodeinfo.network;
    var _this = this;
    return new Promise(async function (resolve, reject) {
      var isexist = await _this.Checkexist(element);
      if (isexist) {
        resolve(true);
        return;
      }

      db.insert(element, function (err, newDoc) {
        if (err == null) {
          resolve(true);
        } else {
          reject(err);
        }
      });
    });
  }
  Checkexist(element) {
    return new Promise(function (resolve, reject) {
      db.find({ operator_address: element.operator_address,
        __network: global.__lambNodeinfo.network }, function (err, docs) {
        if (err == null) {
          if (docs.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          reject(err);
        }
      });
    });
  }
  byaddress(operator_address) {
    console.log('byaddress', operator_address);
    return new Promise(function (resolve, reject) {
      db.findOne({ operator_address: operator_address,
        __network: global.__lambNodeinfo.network }, function (err, doc) {
        if (err == null) {
          resolve(doc);
        } else {
          reject(err);
        }
      });
    });
  }
}
