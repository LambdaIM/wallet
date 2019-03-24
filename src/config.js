
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径

module.exports.DAEMON_CONFIG  = {
    RPC_PORT:19067,
    BASE_PATH:BASE_PATH,
    explorer:'http://explorer.lambda.im/'
    

};
