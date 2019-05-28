var log = require('../log').log;
const eipc = require('electron-better-ipc');
const axios =require('axios');
var {DAEMON_CONFIG} =require('../configmain.js')

export default function(){

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
    eipc.answerRenderer('blockchainstate', async (query) => {
        var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork();
        console.log(nodeBaseUrl);
        var url= nodeBaseUrl + "status";
        
        try {
            const result = await axios.get(url, {
                params: {}
              })
            return {data:result,state:true} ;
            
        } catch (error) {
            log.error(error)
            return {data:error,state:false} 
            
        }
    });
    eipc.answerRenderer('getValidatorIp', async (query) => {

       try{
        return {data:{
            ip:DAEMON_CONFIG.ValidatorIp()
        },state:true} ;

       }catch(error){
           
        return {data:error,state:false} 

       }
        
        
    });




}