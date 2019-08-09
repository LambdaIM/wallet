var {DAEMON_CONFIG} =require('../configmain.js');
const eipc = require('electron-better-ipc');
import resultView from './result.js';
import CosmosAPI from "@lunie/cosmos-api"




  export default function(){
    var cosmosapi= new CosmosAPI(DAEMON_CONFIG.LambdaNetwork(),'lambda-hub-test')
    eipc.answerRenderer('validatorsList',async(query)=>{
        try{
          
          var result = await  cosmosapi.get.validators();
            
            return resultView(result,true)

        }catch(ex){
          throw resultView(null,false,ex)
        }
    })
    eipc.answerRenderer('pool',async(query)=>{
      try{
        
        var result = await  cosmosapi.get.pool();
          
          return resultView(result,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
    })
    eipc.answerRenderer('validator',async(query)=>{
      var operator_address=query.operator_address;

      try{
        
        var result = await  cosmosapi.get.validator(operator_address);
          
          return resultView(result,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
  })
  eipc.answerRenderer('mydelegations',async(query)=>{
    var operator_address=query.operator_address;

    try{
      
      var result = await  cosmosapi.get.delegations(operator_address);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })
  eipc.answerRenderer('myUndelegations',async(query)=>{
    var operator_address=query.operator_address;

    try{
      
      var result = await  cosmosapi.get.undelegations(operator_address);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })

  
  



  }