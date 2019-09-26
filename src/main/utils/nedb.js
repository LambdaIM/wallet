var { DAEMON_CONFIG } = require('../../configmain.js');
const settings = require('electron-settings');

var datafile = DAEMON_CONFIG.DataFile + '/nedb.json';

var Datastore = require('nedb');
var db = new Datastore({ filename: datafile, autoload: true });


export default class {
  readconfig() {
    if (settings.has('defaultwallet') != false) {
      this.defaultAddress = settings.get('defaultwallet');
      // this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
    } else {
      throw new Error('no defaultAddress');
    }
  }
  insertTx(hash, transactiondata, gaseFee) {
    this.readconfig();
    var address = this.defaultAddress;
    return new Promise(function (resolve, reject) {
      db.insert({
        address: address,
        txhash: hash,
        // state: -3,
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
  }
  getTxList() {
    this.readconfig();
    var address = this.defaultAddress;
    return new Promise(function (resolve, reject) {
      db.find({ address: address, dataType: 'localSendTx' }).sort({ createTime: -1 }).limit(100).exec(function (err, docs) {
        if (err == null) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
    });
  }
  updateTxState(hash, state, message) {
    this.readconfig();
    var address = this.defaultAddress;
    return new Promise(function (resolve, reject) {
      // Set an existing field's value
      db.update({ address: address, dataType: 'localSendTx', txhash: hash }, { $set: { state: state, message: message } },
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
}
/*    <Tag v-if="row.state===-3"  color="error">交易未发送</Tag>
      <Tag v-if="row.state===-2"  color="error">交易失败</Tag>
      <Tag v-if="row.state===-1" color="warning">交易未打包</Tag>
      <Tag v-if="row.state===0"  color="primary">交易已发送</Tag>
      <Tag v-if="row.state===1"  color="success">交易成功</Tag>


*/
