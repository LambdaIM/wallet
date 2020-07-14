
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
      
      if(window.netType==1){
        return  "http://explorer.lambdastorage.com/"
      }else if(window.netType==2) {
        return   'http://testexplorer.lambdastorage.com/';
      }else if(window.netType==3){
        var url = settings.get('custombrowserurl')
        if(url==null || url == undefined){
          return 'http://testexplorer.lambdastorage.com/';
        }else{
          return  url
        }

      }

      




    },
    version:packageJson.version,
    mainnetip:"39.107.247.86",
    testnetip:"bj1.testnet.lambdastorage.com",
    testexplore:"http://testexplorer.lambdastorage.com/",
    mainexplore:'http://explorer.lambdastorage.com/'
};
