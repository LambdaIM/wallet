
import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
// var { DAEMON_CONFIG } = require('../configmain.js');
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
    var result = await this.CosmosAPI().get.marketlist();
    return { data: result };
  }
  async getmarketinfo(query) {
    var { name } = query;

    var result = await this.CosmosAPI().get.marketinfo(name);
    return { data: result };
  }
  async getOrderList(marketName, orderType, page, limit) {
    var result = await this.CosmosAPI().get.marketOrderslist(marketName, orderType, page, limit);
    return { data: result };
  }

  async getSellOrderslist(page, limit) {
    if (this.defaultAddress == null) {
      throw new Error('need address');
    }


    var result = await this.CosmosAPI().get.marketSellOrderslist(this.defaultAddress, page, limit);
    return { data: result };
  }

  async getUserOrderslist(page, limit) {
    if (this.defaultAddress == null) {
      throw new Error('need address');
    }
    var result = await this.CosmosAPI().get.marketUserOrderslist(this.defaultAddress, page, limit);
    return { data: result };
  }


  async getOrderinfo(orderId) {
    var result = await this.CosmosAPI().get.marketOrderinfo(orderId);
    return { data: result };
  }

  async getMinermachines(page, limit) {
    var result = await this.CosmosAPI().get.marketminermachines(this.defaultAddress, page, limit);
    return { data: result };
  }
  async getmarketmachineinfo(address, machineName) {
    var result = await this.CosmosAPI().get.marketmachineinfo(address, machineName);
    return { data: result };
  }



  // marketminermachines
}
export default marketmanager;
