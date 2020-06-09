
import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
var { DAEMON_CONFIG } = require('../configmain.js');
var log = require('../log').log;

const { throwErrorCode, errorList } = require('./throwErrorCode.js');


class AssetManager {
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
  async Assetparameters(query) {
    // if (this.defaultAddress == null) {
    //   throwErrorCode(errorList.need_address);
    // }
    console.log('Assetparameters');
    var result = await this.CosmosAPI().get.Assetparameters();

    return { data: result };
  }
  async AuthorizedMarketlist(query) {
    // if (this.defaultAddress == null) {
    //   throwErrorCode(errorList.need_address);
    // }
    console.log('AuthorizedMarketlist');
    var result = await this.CosmosAPI().get.Assetparameters();

    return { data: result };
  }
  async Authorizedpledgelist(query) {
    if (this.defaultAddress == null) {
      throwErrorCode(errorList.need_address);
    }
    console.log('Authorizedpledgelist');
    var result = await this.CosmosAPI().get.Assetparameters();

    return { data: result };
  }
  async Authorizedincomelist(query) {
    if (this.defaultAddress == null) {
      throwErrorCode(errorList.need_address);
    }
    console.log('Authorizedincomelist');
    var result = await this.CosmosAPI().get.Assetparameters();

    return { data: result };
  }
  async Authorizedmarketlist(query) {
    if (this.defaultAddress == null) {
      throwErrorCode(errorList.need_address);
    }
    console.log('Authorizedmarketlist');
    var result = await this.CosmosAPI().get.Authorizedmarketlist();

    return { data: result };
  }
}


export default AssetManager;
