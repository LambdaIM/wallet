import LambdaApi from './lambdaApi';

import fetch from './utils/fetch';

var log = require('../log').log;
const { ipcMain: eipc } = require('electron-better-ipc');

var { DAEMON_CONFIG } = require('../configmain.js');
// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out


export default function() {
  eipc.answerRenderer('httpgetstatus', async query => {
    log.info('httpget:' + query.url);
    try {
      const result = await fetch(query.url, {});
      var data = await result.json();
      return { data: data, state: true };
    } catch (error) {
      log.error(error);
      return { data: error, state: false };
    }
  });

  eipc.answerRenderer('httpgasprise', async query => {
    var url = DAEMON_CONFIG.LambdaValidator() + '/abci_query?path="minGasPrice"';
    console.log(url);
    try {
      const result = await fetch(url, {});
      var data = await result.json();
      console.log('httpgasprise', data);
      var gasbase64 = data.result.response.value;
      var gasprise = '';
      if (gasbase64 != '') {
        gasprise = Buffer.from(gasbase64, 'base64').toString();
      }

      return { data: {
        gasprice: gasprise
      },
      state: true };
    } catch (error) {
      log.error(error);
      return { data: error, state: false };
    }
  });


  eipc.answerRenderer('blockchainstate', async query => {
    log.info('blockchainstate');


    try {
      var CosmosAPIobj = LambdaApi();

      var nodeInfo = await CosmosAPIobj().get.nodeVersion();

      var nodeSyncing = await CosmosAPIobj().get.nodeSyncing();
      var blockLatest = await CosmosAPIobj().get.nodeBlocklatest();

      global.__lambNodeinfo = nodeInfo;


      return { data: {
        nodeInfo: nodeInfo,
        nodeSyncing: nodeSyncing,
        blockLatest: blockLatest
      },
      state: true };
    } catch (error) {
      log.error(error);
      return { data: error, state: false };
    }
  });
  eipc.answerRenderer('getValidatorIp', async query => {
    try {
      return { data: {
        ip: DAEMON_CONFIG.ValidatorIp()
      },
      state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });
  eipc.answerRenderer('log', async query => {
    try {
      log.verbose(query);
      return { data: {}, state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });

  eipc.answerRenderer('assetAll', async query => {
    try {
      var CosmosAPIobj = LambdaApi();

      var assetAll = await CosmosAPIobj().get.assetAll();

      return { data: assetAll, state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });
}
