var { DAEMON_CONFIG } = require('../../configmain.js');


var datafile = DAEMON_CONFIG.DataFile + '/nedb.json';

var Datastore = require('nedb');
var db = new Datastore({ filename: datafile, autoload: true });


export default {
  insertTx(hash, transactiondata, gaseFee) {
    return new Promise(function (resolve, reject) {
      db.insert({
        txhash: hash,
        state: 0,
        dataType: 'localSendTx',
        createTime: new Date().getTime(),
        transactiondata: transactiondata,
        gaseFee: gaseFee,
        message: ''
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
      db.find({ dataType: 'localSendTx' }).sort({ createTime: -1 }).limit(100).exec(function (err, docs) {
        if (err == null) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
    });
  },
  updateTxState(hash, state, message) {
    return new Promise(function (resolve, reject) {
      // Set an existing field's value
      db.update({ dataType: 'localSendTx', txhash: hash }, { $set: { state: state, message: message } },
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
