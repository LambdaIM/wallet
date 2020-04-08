import resultView from './result.js';

import * as LambdaApi from './lambdaApi';

<<<<<<< HEAD
const { ipcMain: eipc } = require('electron-better-ipc');
const settings = require('electron-settings');
=======
import synchronousData from './synchronousData.js';
>>>>>>> 37531ad... 显示节点名称

const { ipcMain: eipc } = require('electron-better-ipc');


export default function() {
  var LambdaRpcApi = LambdaApi.default();
  var syncData = new synchronousData();
  eipc.answerRenderer('validatorsList', async query => {
    try {
      var result = await LambdaRpcApi().get.validators();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('partnerList', async query => {
    try {
      var result = await LambdaRpcApi().get.partnervalidators();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('pool', async query => {
    try {
      var result = await LambdaRpcApi().get.pool();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('validator', async query => {
    var operator_address = query.operator_address;

    try {
      var result = await LambdaRpcApi().get.validator(operator_address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('partner', async query => {
    var operator_address = query.operator_address;

    try {
      var result = await LambdaRpcApi().get.partnervalidator(operator_address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('mydelegations', async query => {
    var operator_address = query.operator_address;

    try {
      var result = await LambdaRpcApi().get.delegations(operator_address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  eipc.answerRenderer('mypartnerDelegations', async query => {
    var operator_address = query.operator_address;

    try {
      var result = await LambdaRpcApi().get.partnerDelegations(operator_address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('delegatorRewardsFromValidator', async query => {
    var operator_address = query.operator_address;
    var validatorAddr = query.validatorAddr;

    try {
      var result = await LambdaRpcApi().get.delegatorRewardsFromValidator(operator_address, validatorAddr);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  eipc.answerRenderer('myUndelegations', async query => {
    var operator_address = settings.get('defaultwallet');
    try {
      var result = await LambdaRpcApi().get.undelegations(operator_address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('mypartnerundelegations', async query => {
    var operator_address = query.operator_address;

    try {
      var result = await LambdaRpcApi().get.partnerundelegations(operator_address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('stakingParameters', async query => {
    try {
      var result = await LambdaRpcApi().get.stakingParameters();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('changeip', async query => {
    try {
      var result = LambdaApi.changeCosmosAPI();
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('mintingAnnualprovisions', async query => {
    try {
      var minting = await LambdaRpcApi().get.mintingAnnualprovisions();
      var distribution = await LambdaRpcApi().get.distributionParameters();

      return resultView({
        minting,
        distribution
      }, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('redelegationlist', async query => {
    try {
      // var operator_address = query.operator_address;
      var operator_address = settings.get('defaultwallet');
      var result = await LambdaRpcApi().get.redelegations(operator_address);
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('syncValidator', async query => {
    try {
      var result = await syncData.syncValidator();
      var result2 = await syncData.asyncproposal();


      return resultView({
        result
      }, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  
  eipc.answerRenderer('getsyncValidator', async query => {
    var { operator_addres } = query;

    try {
      var result = await syncData.getValidator(operator_addres);
      return resultView({
        result
      }, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('getsyncproposalTitle', async query => {
    var { id } = query;

    try {
      var result = await syncData.getproposalTitle(id);
      return resultView({
        result
      }, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
}
