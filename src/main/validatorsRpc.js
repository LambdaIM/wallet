import resultView from './result.js';

import * as LambdaApi from './lambdaApi';

const { ipcMain: eipc } = require('electron-better-ipc');



export default function() {
  var LambdaRpcApi = LambdaApi.default();
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
    var operator_address = query.operator_address;

    try {
      var result = await LambdaRpcApi().get.undelegations(operator_address);

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
}
