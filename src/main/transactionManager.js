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

    if(settings.has('defaultwallet')!=undefined){
        this.defaultAddress = settings.get('defaultwallet')
        this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
    }

  }
  async getTransactionList(){
    if(this.defaultAddress==null){
        throw new Error('need address')

    }
    
    var address =this.defaultAddress;
    console.log(address);

    var url =`${DAEMON_CONFIG.LambdaExplorer}api/tx/getTxAccountList`;
    var data ={
        accountHash:address,
        pageNum:1,
        showNum:10
      }

    const result = await axios.get(url, {
        params: data
      })
    
    return result;

  }
  async getTransactionInfo(hash){
    var url =`${DAEMON_CONFIG.LambdaExtenNetwork}getTransactionByHash`;
    log.info(url);
    var data ={
          hash:hash
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