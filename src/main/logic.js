var fs = require('graceful-fs')
var {DAEMON_CONFIG} =require('../configmain.js');

import rpc from './rpc';
import pay from './pay';
import walletrpc from './walletrpc';
import transactionrpc from './transactionrpc';


function creatDir(){
    
    if(fs.existsSync(DAEMON_CONFIG.WalletFile)==false) {
        fs.mkdirSync(DAEMON_CONFIG.WalletFile);
    }
}


export default function(){
    creatDir();
    rpc();
    pay();
    walletrpc();
    transactionrpc();

}