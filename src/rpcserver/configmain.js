
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
// console.log(BASE_PATH);
// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径

module.exports.DAEMON_CONFIG  = {
    RPC_PORT:8084,
    BASE_PATH:BASE_PATH,
    WalletFile:BASE_PATH+'\\Wallet',
    LogFile:BASE_PATH+'\\Log'
};
