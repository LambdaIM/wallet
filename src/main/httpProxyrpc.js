var log = require('../log').log;
const eipc = require('electron-better-ipc');
const axiosM =require('axios');
var {DAEMON_CONFIG} =require('../configmain.js')
import CosmosAPI from "@lunie/cosmos-api"

const axios = axiosM.create();
 
// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
axios.defaults.timeout = 1000*15;

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
        log.info('blockchainstate')
        
        
        try {
            var CosmosAPIobj= new CosmosAPI(DAEMON_CONFIG.LambdaNetwork())
            log.info('blockchainstate2')
            var nodeInfo = await CosmosAPIobj.get.nodeVersion();
            log.info('blockchainstate3')
            var nodeSyncing = await CosmosAPIobj.get.nodeSyncing();
            var blockLatest = await CosmosAPIobj.get.nodeBlocklatest();
            log.info(nodeInfo)
            log.info('blockchainstate')
            return {data:{
                nodeInfo:nodeInfo,
                nodeSyncing:nodeSyncing,
                blockLatest:blockLatest
            },state:true} ;
            
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