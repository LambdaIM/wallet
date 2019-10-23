import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';

import httpProxyrpc from './httpProxyrpc';

import validatorsRpc from './validatorsRpc';

import proposalrpc from './proposalrpc';

import marketrpc from './marketrpc';


var fs = require('graceful-fs');
var { DAEMON_CONFIG } = require('../configmain.js');
const settings = require('electron-settings');
const path = require('path');


export default function() {
  DAEMON_CONFIG.s3client();
  walletrpc();
  transactionrpc();

  httpProxyrpc();
  validatorsRpc();

  proposalrpc();

  marketrpc();
}
