var { DAEMON_CONFIG } = require('../../configmain.js');


var datafile = DAEMON_CONFIG.DataFile + '/nedb.json';

var Datastore = require('nedb');
var db = new Datastore({ filename: datafile, autoload: true });


export default {
  insertTx(hash) {
    return new Promise(function (resolve, reject) {
      db.insert({
        txhash: hash,
        state: 0,
        dataType: 'localSendTx',
        createTime: new Date().getTime()
      }, function (err, newDoc) {
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        if (err == null) {
          resolve(newDoc);
        } else {
          reject(err);
        }
      });
    });
  },
  getTxList() {
    return new Promise(function (resolve, reject) {
      db.find({ dataType: 'localSendTx' }, function (err, docs) {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        if (err == null) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
    });
  },
  updateTxState(hash, state) {
    return new Promise(function (resolve, reject) {
      // Set an existing field's value
      db.update({ dataType: 'localSendTx', txhash: hash }, { $set: { state: state } },
        function (err, numReplaced) {
          // numReplaced = 3
          // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
          if (err == null) {
            resolve(numReplaced);
          } else {
            reject(err);
          }
        });
    });
  }
};
