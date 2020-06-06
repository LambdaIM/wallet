import LambdaApi from './lambdaApi';

import fetch from './utils/fetch';

import AssetManager from './AssetManager.js';
const { app } = require('electron');

var log = require('../log').log;
const { ipcMain: eipc } = require('electron-better-ipc');

var { DAEMON_CONFIG } = require('../configmain.js');

const { throwErrorCode, errorList } = require('./throwErrorCode.js');


export default function() {
  eipc.answerRenderer('Assetparameters', async query => {
    try {
      var M = new Manager();
      var result = await M.AssetManager();
      return { data: result, state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });


  eipc.answerRenderer('Authorizedpledgelist', async query => {
    try {
      var M = new Manager();
      var result = await M.Authorizedpledgelist();
      return { data: result, state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });


  eipc.answerRenderer('Authorizedincomelist', async query => {
    try {
      var M = new Manager();
      var result = await M.Authorizedincomelist();
      return { data: result, state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });

  eipc.answerRenderer('Authorizedmarketlist', async query => {
    try {
      var M = new Manager();
      var result = await M.Authorizedmarketlist();
      return { data: result, state: true };
    } catch (error) {
      return { data: error, state: false };
    }
  });
}