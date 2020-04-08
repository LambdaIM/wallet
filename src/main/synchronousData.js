import * as LambdaApi from './lambdaApi';
import validatordb from './utils/validatordb.js';

import proposaldb from './utils/proposaldb.js';



export default class synchronousData {
  constructor() {
    this.LambdaRpcApi = LambdaApi.default();
    this.validatordb = new validatordb();
    this.proposaldb = new proposaldb();
  }
  async syncValidator() {
    // console.log('this.LambdaRpcApi')
    // console.log(this.LambdaRpcApi)
    var list = await this.LambdaRpcApi().get.validators() || [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      console.log('===element===');
      console.log(element);
      await this.validatordb.insert(element);
    }
    return true;
  }
  async getValidator(operator_addres) {
    var name = await this.validatordb.byaddress(operator_addres);
    return name;
  }
  async asyncproposal() {
    var list = await this.LambdaRpcApi().get.proposals() || [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      console.log('===element===');
      console.log(element);
      await this.proposaldb.insert(element);
    }
  }
  async getproposalTitle(id) {
    var item = await this.proposaldb.byid(id);
    var name = '';
    if (item && item.content && item.content.value && item.content.value.title) {
      name = item.content.value.title;
    }
    return name;
  }
}
