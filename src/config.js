
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
const settings = require("electron-settings");

// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径
var defaultip='39.106.139.11'

module.exports.DAEMON_CONFIG  = {
    RPC_PORT:8084,
    BASE_PATH:BASE_PATH,
    ValidatorIp:function(){
        return settings.get('validator.ip')||defaultip;
    }   ,
    LambdaNetwork:function(){
        return `http://${settings.get('validator.ip')||defaultip}:13657/`;
    },
    // LambdaExtenNetwork:function(){
    //     return `http://${settings.get('validator.ip')||defaultip}:13659/`
    // },
    // LambdaExplorer:'http://explorer.lambda.im/'
    pledgeurl: "http://validator.lambdastorage.com/",
    explore:'http://explorer.lambdastorage.com/'
};
