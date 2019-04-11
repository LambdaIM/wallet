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
    console.log(DAEMON_CONFIG.BASE_PATH)
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

    // if(settings.has('user.node')==false){
    //     //http://18.136.176.184:13657/abci_query
    //     settings.set('user', {
    //         node: 'http://18.136.176.184:13657/'
    //       });

    // }

    // if(settings.has('user.nodeextend')==false){
    //     //http://18.136.176.184:13657/abci_query
    //     settings.set('user', {
    //         nodeextend: 'http://18.136.176.184:13659/'
    //       });

    // }
    
}

export default function(){
    creatDir();
    initializeSeting();
    walletrpc();
    transactionrpc();
    minerrpc();
    console.log('httpProxyrpc')
    console.log(httpProxyrpc)

    // log.info(httpProxyrpc)
    httpProxyrpc();

}