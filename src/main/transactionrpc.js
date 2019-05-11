var {DAEMON_CONFIG} =require('../configmain.js');
const eipc = require('electron-better-ipc');
import resultView from './result.js';
import transactionManager from './transactionManager.js';




  export default function(){

    eipc.answerRenderer('transactionList',async(query)=>{
        try{
           var transaction = new  transactionManager();
           var result = await  transaction.getTransactionList() 
            
            return resultView(result,true)

        }catch(ex){
          throw resultView(null,false,ex)
        }
    })
    eipc.answerRenderer('transactionInfo',async(query)=>{
      var {hash,txType} = query;

      try{
         var transaction = new  transactionManager();
         var result = await  transaction.getTransactionInfo(hash,txType) 
          
          return resultView(result,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
  })


    //getTransactionInfo

  }
