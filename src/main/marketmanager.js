
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

  async getSellOrderslist(query) {
    console.log('marketinfo');
    if (this.defaultAddress == null) {
      throw new Error('need address');
    }


    var result = await this.CosmosAPI().get.marketSellOrderslist(this.defaultAddress);
    return { data: result };
  }

  async getUserOrderslist(query) {
    console.log('marketinfo');
    if (this.defaultAddress == null) {
      throw new Error('need address');
    }
    var result = await this.CosmosAPI().get.marketUserOrderslist(this.defaultAddress);
    return { data: result };
  }


  async getOrderinfo(query) {
    console.log('marketinfo');
    var { id } = query;
    var result = await this.CosmosAPI().get.marketOrderinfo(id);
    return { data: result };
  }

  // marketOrderinfo
}
export default marketmanager;
