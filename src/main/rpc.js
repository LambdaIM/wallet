const eipc = require('electron-better-ipc');
const axios =require('axios');
var protobuf = require("protobufjs");
const path = require('path');
const { shell } = require('electron');
var {DAEMON_CONFIG} =require('../config.js')

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


    eipc.answerRenderer('httpgetaccount', async (query) => {
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

    eipc.answerRenderer('httpgetstatus', async (query) => {
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

    eipc.answerRenderer('httpgettxlist', async (query) => {
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
    




};