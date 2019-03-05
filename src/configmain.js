
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径

module.exports.DAEMON_CONFIG  = {
    RPC_PORT:8084,
    BASE_PATH:BASE_PATH,
    WalletFile:path.join( BASE_PATH,'Wallet'),
    LogFile:path.join(BASE_PATH,'Log'),
    LambdaNetwork:'http://39.105.156.36:13657/',
    LambdaExtenNetwork:'http://39.105.156.36:13659/',
                  //http://39.105.156.36:13657/getTransactionByHash?hash=
                  //http://47.92.7.19:13659/getTransactionByHash?hash=
    LambdaExplorer:'http://explorer.lambda.im/'
};
