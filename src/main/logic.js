var fs = require('graceful-fs')
var {DAEMON_CONFIG} =require('../configmain.js');
const settings = require('electron-settings');
const path = require('path');

import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';

import httpProxyrpc from './httpProxyrpc';

import validatorsRpc from './validatorsRpc';


export default function(){
    
    
    walletrpc();
    transactionrpc();
    
    httpProxyrpc();
    validatorsRpc();

}