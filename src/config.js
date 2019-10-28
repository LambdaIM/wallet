
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
    explore:function(){
      var testurl = process.env.NODE_ENV == "production"?
      'http://testbrowser.lambda.im/':"http://39.107.249.53:8080/";
      if(window.netType==1){
        return  "http://explorer.lambdastorage.com/"
      }else{
        return   testurl;
      }




    },
    version:packageJson.version,
    mainnetip:"39.107.247.86",
    testnetip:"47.93.196.236"
};
