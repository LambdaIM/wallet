var {DAEMON_CONFIG} =require('../configmain.js');
const eipc = require('electron-better-ipc');
import resultView from './result.js';

import LambdaApi from './lambdaApi';
import {changeCosmosAPI} from './lambdaApi';





  export default function(){
    var cosmosapi= LambdaApi()
    eipc.answerRenderer('validatorsList',async(query)=>{
        try{
          
          var result = await  cosmosapi().get.validators();
            
            return resultView(result,true)

        }catch(ex){
          throw resultView(null,false,ex)
        }
    })
    eipc.answerRenderer('partnerList',async(query)=>{
      try{
        
        var result = await  cosmosapi().get.partnervalidators();
          
          return resultView(result,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
  })
    eipc.answerRenderer('pool',async(query)=>{
      try{
        
        var result = await  cosmosapi().get.pool();
          
          return resultView(result,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
    })
    eipc.answerRenderer('validator',async(query)=>{
      var operator_address=query.operator_address;

      try{
        
        var result = await  cosmosapi().get.validator(operator_address);
          
          return resultView(result,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
  })
  eipc.answerRenderer('partner',async(query)=>{
    var operator_address=query.operator_address;

    try{
      
      var result = await  cosmosapi().get.partnervalidator(operator_address);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
})
  eipc.answerRenderer('mydelegations',async(query)=>{
    var operator_address=query.operator_address;

    try{
      
      var result = await  cosmosapi().get.delegations(operator_address);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })

  eipc.answerRenderer('mypartnerDelegations',async(query)=>{
    var operator_address=query.operator_address;

    try{
      
      var result = await  cosmosapi().get.partnerDelegations(operator_address);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })

  
  eipc.answerRenderer('delegatorRewardsFromValidator',async(query)=>{
    var operator_address=query.operator_address;
    var validatorAddr=query.validatorAddr;

    try{
      
      var result = await  cosmosapi().get.delegatorRewardsFromValidator(operator_address,validatorAddr);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })


  
  eipc.answerRenderer('myUndelegations',async(query)=>{
    var operator_address=query.operator_address;

    try{
      
      var result = await  cosmosapi().get.undelegations(operator_address);
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })
  eipc.answerRenderer('stakingParameters',async(query)=>{
    

    try{
      
      var result = await  cosmosapi().get.stakingParameters();
        
        return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })
  eipc.answerRenderer('changeip',async(query)=>{
    try{

      var result = changeCosmosAPI()
      return resultView(result,true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
  })



  

  
  



  }
