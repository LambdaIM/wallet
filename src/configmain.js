
const os =require('os');
const path = require('path');
const electron = require('electron')

let BASE_PATH = path.join(os.homedir(), 'lambWallet');
const settings = require("electron-settings");
var fs = require('graceful-fs')

const cmd = require('node-cmd');
const Promise = require('bluebird');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });




// console.log('electron',electron.app)
// let BASE_PATH=electron.app.getPath('appData')


//homedir  系统默认的文件存储路径


var defaultip='39.107.247.86'
// var defaultip='192.168.10.29'

var configData = {
    BASE_PATH:BASE_PATH,
    WalletFile:path.join( BASE_PATH,'Wallet'),
    LogFile:path.join(BASE_PATH,'Log'),
    DataFile:path.join(BASE_PATH,'Data'),
    OrderS3File:path.join(BASE_PATH,'orderS3'),
    ValidatorIp:function(){
        return settings.get('validator.ipv1')||defaultip;
        // return defaultip;
    }   ,
    LambdaNetwork:function(){
        // return "http://39.107.249.53:8083/mock/5d82f651098df42dee8e6036/wallet"
        // return `http://10.0.0.43:1317`;
        return `http://${settings.get('validator.ipv1')||defaultip}:13659`;
    
    },
    LambdaExtenNetwork:function(){
        return `http://${settings.get('validator.ipv1')||defaultip}:13657`
        // return `http://${defaultip}:13657`
    },           
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
        if(fs.existsSync(this.DataFile)==false) {
            fs.mkdirSync(this.DataFile);
        }
        if(fs.existsSync(this.OrderS3File)==false) {
            fs.mkdirSync(this.OrderS3File);
        }
        settings.setPath(path.join(this.BASE_PATH,'set.json') );
        
    },
    s3client:function(){
        if (fs.existsSync(`${this.BASE_PATH}/lamb`) == false) {
            fs.createReadStream(`${__static}/lamb`).pipe(fs.createWriteStream(`${this.BASE_PATH}/lamb`));
            cmd.run(`chmod 777  ${this.BASE_PATH}/lamb `)
          }
        //   if (fs.existsSync(`${this.BASE_PATH}/order-meta.json`) == false) {
        //     fs.createReadStream(`${__static}/order-meta.json`).pipe(fs.createWriteStream(`${this.BASE_PATH}/order-meta.json`));
            
        //   }
          if (fs.existsSync(`${this.BASE_PATH}/s3.yaml`) == false) {
            fs.createReadStream(`${__static}/s3.yaml`).pipe(fs.createWriteStream(`${this.BASE_PATH}/s3.yaml`));
            
          }

        

    }
    
    
    
};

configData.setUP();
// configData.s3client();

module.exports.DAEMON_CONFIG  = configData;