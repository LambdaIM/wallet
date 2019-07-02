
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
const settings = require("electron-settings");
var fs = require('graceful-fs')


// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径


var defaultip='39.105.87.87'

var configData = {
    BASE_PATH:BASE_PATH,
    WalletFile:path.join( BASE_PATH,'Wallet'),
    LogFile:path.join(BASE_PATH,'Log'),
    ValidatorIp:function(){
        return settings.get('validator.ip')||defaultip;
    }   ,
    LambdaNetwork:function(){
        return `http://${settings.get('validator.ip')||defaultip}:13657/`;
    },
    LambdaExtenNetwork:function(){
        return `http://${settings.get('validator.ip')||defaultip}:13659/`
    },           
    // LambdaExplorer:'http://explorer.lambda.im/',
    LambdaExplorer:'http://39.106.112.201:8080/',
    setUP:function(){
        if(fs.existsSync(this.BASE_PATH)==false) {
            fs.mkdirSync(this.BASE_PATH);
        }
        if(fs.existsSync(this.WalletFile)==false) {
            fs.mkdirSync(this.WalletFile);
        }
        if(fs.existsSync(this.LogFile)==false) {
            fs.mkdirSync(this.LogFile);
        }
        settings.setPath(path.join(this.BASE_PATH,'set.json') );
    }
    
    
    
};

configData.setUP();

module.exports.DAEMON_CONFIG  = configData;