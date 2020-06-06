import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';

import httpProxyrpc from './httpProxyrpc';

import validatorsRpc from './validatorsRpc';

import proposalrpc from './proposalrpc';

import marketrpc from './marketrpc';

import Assetrpc from './Assetrpc';


var fs = require('graceful-fs');
var { DAEMON_CONFIG } = require('../configmain.js');
const settings = require('electron-settings');
const path = require('path');

var packagejson = require('../../package.json');


export default function() {
  if (packagejson.runstorage == 1) {
    DAEMON_CONFIG.s3client();
  }

  walletrpc();
  transactionrpc();

  httpProxyrpc();
  validatorsRpc();

  proposalrpc();

  marketrpc();

  Assetrpc();
}
