const axios =require('axios');
const settings = require("electron-settings");
var {DAEMON_CONFIG} =require('../configmain.js')
var log = require('../log').log;
import CosmosAPI from "@lunie/cosmos-api"




class Transaction {
  constructor() {
    this.defaultAddress=null;
    this.readconfig();
    this.CosmosAPI= new CosmosAPI(DAEMON_CONFIG.LambdaNetwork(),'lambda-hub-test')
    
    
  }
  readconfig(){
    log.info('defaultwallet num value');
    log.info(settings.has('defaultwallet'));

    if(settings.has('defaultwallet')!=false){
        this.defaultAddress = settings.get('defaultwallet')
        // this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
        
    }

  }
  async getTransactionList(query){
    if(this.defaultAddress==null){
        throw new Error('need address')

    }
    console.log('getTransactionList')
    var result = await this.CosmosAPI.get.bankTxs(this.defaultAddress);
    var resultList=[];
    result.forEach(function(item){
      resultList=resultList.concat(item)
    })
    console.log(result)
    console.log('getTransactionList')
    // var address =this.defaultAddress;
    // console.log(address);

    // var url =`${DAEMON_CONFIG.LambdaExplorer}api/tx/getTxList`;
    // log.info(query)
    // var data ={
    //     address:address,
    //     pageNum:query.pageNum,
    //     showNum:query.showNum
    //   }

    //   if(query.txType!=undefined){
    //     data.txType=query.txType;
    //   }
    // const result = await axios.get(url, {
    //     params: data
    //   })
      
    
    return {data:resultList};

  }
  async getTransactionInfo(hash,txType){
    var url =`${DAEMON_CONFIG.LambdaExplorer}/api/tx/txDetailByType`;
    log.info(url);
    var data ={
          txHash:hash,
          txType: txType
        }
  
      const result = await axios.get(url, {
          params: data
        })
      // log.info(result);
      return result;
  
  }




  //getTransactionByHash?hash=


  
}
export default Transaction