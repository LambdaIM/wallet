
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
const settings = require("electron-settings");
var packageJson =require('../package.json')


// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径


module.exports.DAEMON_CONFIG  = {
    BASE_PATH:BASE_PATH,
    pledgeurl: "http://validator.lambdastorage.com/",
    explore:process.env.NODE_ENV == 'production'?'http://explorer.lambdastorage.com/':"http://39.107.249.53:8080/",
    version:packageJson.version
};
