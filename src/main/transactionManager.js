
import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
var { DAEMON_CONFIG } = require('../configmain.js');
var log = require('../log').log;



class Transaction {
  constructor() {
    this.defaultAddress = null;
    this.readconfig();
    this.CosmosAPI = LambdaApi();
  }
  readconfig() {
    log.info('Transaction readconfig');


    if (settings.has('defaultwallet') != false) {
      this.defaultAddress = settings.get('defaultwallet');
      // this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
    }
  }
  async getTransactionList(query) {
    if (this.defaultAddress == null) {
      throw new Error('need address');
    }
    console.log('getTransactionList');
    var result = await this.CosmosAPI().get.txs(this.defaultAddress);
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
