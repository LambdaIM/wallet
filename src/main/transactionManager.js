
import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
var { DAEMON_CONFIG } = require('../configmain.js');
var log = require('../log').log;

const { throwErrorCode, errorList } = require('./throwErrorCode.js');



class Transaction {
  constructor() {
    this.defaultAddress = null;
    this.readconfig();
    this.CosmosAPI = LambdaApi();
  }
  readconfig() {
    if (settings.has('defaultwallet') != false) {
      this.defaultAddress = settings.get('defaultwallet');
      // this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
    }
  }
  async getTransactionList(query) {
    if (this.defaultAddress == null) {
      throwErrorCode(errorList.need_address);
    }
    console.log('getTransactionList');
    var blockinfo = await this.CosmosAPI().get.nodeBlocklatest();
    var height = blockinfo.block.header.height;
    var startHeight = height - 10000;
    if (startHeight < 0) { startHeight = 0; }
    console.log('height', height);
    var result = await this.CosmosAPI().get.txs(this.defaultAddress, startHeight);
    var resultList = [];
    if (result instanceof Array) {
      result.forEach(function(item) {
        resultList = resultList.concat(item);
      });
    }



    return { data: resultList };
  }
  async getTransactionInfo(hash, txType) {
    var result = await this.CosmosAPI().get.tx(hash);
    console.log('getTransactionInfo');
    return result;
  }



  // getTransactionByHash?hash=
}
export default Transaction;
