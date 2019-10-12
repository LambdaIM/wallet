
import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
var { DAEMON_CONFIG } = require('../configmain.js');
var log = require('../log').log;



class marketmanager {
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
  async getmarketlist(query) {
    console.log('marketlist');
    var result = await this.CosmosAPI().get.marketlist();
    return { data: result };
  }
  async getmarketinfo(query) {
    console.log('marketinfo');
    var { name } = query;

    var result = await this.CosmosAPI().get.marketinfo(name);
    return { data: result };
  }
  async getOrderList(query) {
    console.log('marketinfo');


    var result = await this.CosmosAPI().get.marketOrderslist();
    return { data: result };
  }
}
export default marketmanager;
