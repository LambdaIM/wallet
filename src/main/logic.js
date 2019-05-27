var fs = require('graceful-fs')
var {DAEMON_CONFIG} =require('../configmain.js');
const settings = require('electron-settings');
const path = require('path');

import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';
import minerrpc from './minerrpc';

import httpProxyrpc from './httpProxyrpc';


function creatDir(){
    // console.log('sss1') 
    
    if(fs.existsSync(DAEMON_CONFIG.BASE_PATH)==false) {
        fs.mkdirSync(DAEMON_CONFIG.BASE_PATH);
    }
    if(fs.existsSync(DAEMON_CONFIG.WalletFile)==false) {
        fs.mkdirSync(DAEMON_CONFIG.WalletFile);
    }
    if(fs.existsSync(DAEMON_CONFIG.LogFile)==false) {
        fs.mkdirSync(DAEMON_CONFIG.LogFile);
    }
}

function initializeSeting(){
    settings.setPath(path.join(DAEMON_CONFIG.BASE_PATH,'set.json') );
}

export default function(){
    creatDir();
    initializeSeting();
    walletrpc();
    transactionrpc();
    minerrpc();
    httpProxyrpc();

}