const eipc = require('electron-better-ipc');
const axios =require('axios');
var protobuf = require("protobufjs");
const path = require('path');
const { shell } = require('electron');
var {DAEMON_CONFIG} =require('../configmain.js')
var fs = require('graceful-fs')

var log = require('../log').log;



 export default function(){
     
    var protofilepath=path.join(__static, '/awesome.proto');
    eipc.answerRenderer('httpget', async (query) => {
        log.info('httpget:'+query.url)
        try {
            const result = await axios.get(query.url, {
                params: query.data||{}
              })
            return {data:result,state:true} ;
            
        } catch (error) {
            log.error(error)
            return {data:error,state:false} 
            
        }
        
    
          
    });
    eipc.answerRenderer('httppost', async (query) => {
        log.info('httpget:'+query.url)
        try {
            const result = await axios.post(query.url, query.data||{})
            return {data:result,state:true} ;
            
        } catch (error) {
            log.error(error)
            return {data:error,state:false} 
            
        }
    
    });
    eipc.answerRenderer('openkeystore', async (query) => {
        shell.showItemInFolder(DAEMON_CONFIG.BASE_PATH);
    });
    eipc.answerRenderer('protodecode', async (query) => {
        log.info('protodecode')
        try {
              var value = query.value;
              const protoRoot = await  protobuf.load(protofilepath);
              var buf=Buffer.from(value,'base64');
              
              var AccountMessage = protoRoot.lookupType(query.dataType);
              var Message=AccountMessage.decode(buf);
              
              var acountjson={
                address:Message.address.toString('hex'),
                balance:parseInt(Message.balance, 10),
                nonce:parseInt(Message.nonce, 10)
              }
            return {data:acountjson,state:true} ;
            
        } catch (error) {
            log.error(error)
            return {data:JSON.stringify(error),state:false}          
        }
        
    
          
    });
    eipc.answerRenderer('getwalletList',async(query)=>{
        var walletList = [];
        console.log('getwalletList');
        
        if(fs.existsSync(DAEMON_CONFIG.WalletFile)==false) {
            fs.mkdirSync(DAEMON_CONFIG.WalletFile);
        }
        
        var list = fs.readdirSync(DAEMON_CONFIG.WalletFile);
        
        list.forEach(function(file,index) {
            file = DAEMON_CONFIG.WalletFile + '/' + file;
            var v3file =fs.readFileSync(file);
            var v3file = JSON.parse(v3file);
            walletList.push({
                name:v3file.name,
                address:v3file.address,
                file:file
            })
        })
        console.log(walletList)
        return {data:walletList,state:true} ;


    })
    




};