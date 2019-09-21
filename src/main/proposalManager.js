
import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
var { DAEMON_CONFIG } = require('../configmain.js');
var log = require('../log').log;



class proposalManager {
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
  async getProposalList(query) {
    if (this.defaultAddress == null) {
      throw new Error('need address');
    }
    console.log('getTransactionList');
    var result = await this.CosmosAPI().get.proposals();

    return { data: result };
  }

  async getProposalInfo(id) {
    var result = await this.CosmosAPI().get.proposal(id);
    return { data: result };
  }

  async govDepositParameters() {
    var result = await this.CosmosAPI().get.govDepositParameters();
    return { data: result };
  }



  // getTransactionByHash?hash=
}
export default proposalManager;
