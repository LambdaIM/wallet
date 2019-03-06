var fs = require('graceful-fs')
var {DAEMON_CONFIG} =require('../configmain.js');

import rpc from './rpc';
import pay from './pay';
import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';


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


export default function(){
    creatDir();
    rpc();
    pay();
    walletrpc();
    transactionrpc();

}