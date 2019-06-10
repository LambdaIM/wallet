var fs = require('graceful-fs')
var {DAEMON_CONFIG} =require('../configmain.js');
const settings = require('electron-settings');
const path = require('path');

import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';
import minerrpc from './minerrpc';

import httpProxyrpc from './httpProxyrpc';


export default function(){
    
    
    walletrpc();
    transactionrpc();
    minerrpc();
    httpProxyrpc();

}