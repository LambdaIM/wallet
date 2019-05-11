const axios =require('axios');
const settings = require("electron-settings");
var {DAEMON_CONFIG} =require('../configmain.js')
var log = require('../log').log;




class Transaction {
  constructor() {
    this.defaultAddress=null;
    this.readconfig();
    
    
  }
  readconfig(){
    log.info('defaultwallet num value');
    log.info(settings.has('defaultwallet'));

    if(settings.has('defaultwallet')!=false){
        this.defaultAddress = settings.get('defaultwallet')
        this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
    }

  }
  async getTransactionList(query){
    if(this.defaultAddress==null){
        throw new Error('need address')

    }
    
    var address =this.defaultAddress;
    console.log(address);

    var url =`${DAEMON_CONFIG.LambdaExplorer}api/tx/getTxList`;
    log.info(query)
    var data ={
        address:address,
        pageNum:query.pageNum,
        showNum:query.showNum
      }

      if(query.txType!=undefined){
        data.txType=query.txType;
      }
    const result = await axios.get(url, {
        params: data
      })
      
    
    return result;

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