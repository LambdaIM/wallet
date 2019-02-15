const eipc = require('electron-better-ipc');
const axios =require('axios');
var protobuf = require("protobufjs");
const path = require('path');
const { shell } = require('electron');
var fs = require('graceful-fs')
const settings = require('electron-settings');
var log = require('electron-log');
var fs = require('graceful-fs')
var TenderKeys =require('tendermintelectronkey');
var crypto    = require("crypto");


var log = require('../log').log;
var {DAEMON_CONFIG} =require('../config.js')


import ETHwallet from './ETHv3wallet.js'
import Amino  from 'irisnet-crypto/chains/iris/amino.js'






 function getAccountInfo(){
    
    var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
    var v3file =fs.readFileSync(path);
    var v3file = JSON.parse(v3file);
    var address = v3file.address;
    var nodeBaseUrl = settings.get('user.node');
    // var nodeBaseUrl = 'http://192.168.1.12:13657/';
    var addressinfourl=nodeBaseUrl+'abci_query?path=%22/accounts/'+address+'%22&data=&height=&prove='
    
    return  axios.get(addressinfourl)
}

var lastpayobj;
var lastpayJSON;
var lastpayArry;


function generatesha256(data){
      
    let hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();
    
  }
  
export default function(){
  var protofilepath=path.join(__static, '/awesome.proto');
    eipc.answerRenderer('pay', async (query) => {

        try {
    
            log.info('start pay data')
              var result = await  getAccountInfo();
              //if not have the account neet to log
              log.info(result)
              var accountInfo =result.data.result.response.value;
              const protoRoot = await  protobuf.load(protofilepath);

              
              var buf=Buffer.from(accountInfo,'base64');
              var AccountMessage = protoRoot.lookupType('types.Account');
              var Message=AccountMessage.decode(buf);
              var acountjson={
                address:Message.address.toString('hex'),
                balance:parseInt(Message.balance, 10),
                nonce:parseInt(Message.nonce, 10)
              }
                            
              var payload = { 
                from: Buffer.from(acountjson.address,'hex') ,
                to:Buffer.from(query.to,'hex') ,
                amount:query.amount ,
                gas: 1,
                createTime :  +(new Date()).getTime().toString().substr(0,10)
              };
            //   var payload = { from: acountjson.address ,to:query.to ,amount:query.amount };
              var nonce = acountjson.nonce ;
              
              var TxDataMessage = protoRoot.lookupType('types.TxData');
              var errMsg = TxDataMessage.verify(payload);
              log.error(errMsg)
              if (errMsg)
                return {data:JSON.stringify(errMsg),state:false} 
                
              var TxData = TxDataMessage.create(payload);
              var TxDatabuffer = TxDataMessage.encode(TxData).finish();
              var TxSendMessage = protoRoot.lookupType('types.TxSend');

              var sendload={
                id:generatesha256(TxDatabuffer),  
                txData:TxData
              }
              
               errMsg = TxSendMessage.verify(sendload);
               log.error(errMsg)
               if (errMsg)
                return {data:JSON.stringify(errMsg),state:false} 

              var TxSend = TxSendMessage.create(sendload);
              var TxPayloadMessage = protoRoot.lookupType('types.TxPayload');

              var TxPayload={
                txSend:TxSend,
                payload:'txSend'
              }
              TxPayload.nonce=nonce+1;
              errMsg = TxPayloadMessage.verify(TxPayload);
              log.error(errMsg)
              if (errMsg)
                return {data:JSON.stringify(errMsg),state:false} 
              var TxPay = TxPayloadMessage.create(TxPayload);
            
              lastpayobj=TxPay;
              lastpayArry= TxPayloadMessage.encode(TxPay).finish();
              return {data:TxPay,state:true} ;
            
        } catch (error) {
            log.error(error)
            return {data:JSON.stringify(error),state:false} 
        }
        
    
          
    });

    eipc.answerRenderer('Wallettransfer',async(query)=>{
      log.info('Wallettransfer')
      var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
      var v3file =fs.readFileSync(path,'utf8');
      try {
        var password = query.password;
        password=decodeURIComponent(password);
        var wallet = ETHwallet.fromV3(v3file,password);
      } catch (error) {
        log.error(error)
        log.error('password error or not find wallet')
        return {data:'password error or not find wallet',state:false,code:'1001'} 
      }
      
      try {
      var tenderKeys = new TenderKeys();
      const protoRoot = await  protobuf.load(protofilepath);
      var TxMessage = protoRoot.lookupType('types.Tx');
      
      var sindata = tenderKeys.signBuffer(wallet._privKey.toString('hex'),lastpayArry);//   lastpayobj
      Amino.RegisterConcrete(null,'tendermint/PubKeyEd25519')
      
      var TxMessageload={
          key: Amino.MarshalBinary('tendermint/PubKeyEd25519',  Buffer.from(wallet.pubKey,'hex')) ,
          signature:sindata,
          payload:lastpayobj
      }
      

      var errMsg = TxMessage.verify(TxMessageload);
      log.error(errMsg)

      if (errMsg){
        return {data:errMsg,state:false} 
      }
      var TxMessageData = TxMessage.create(TxMessageload);
      //https://github.com/irisnet/irisnet-crypto/search?q=pubKey&unscoped_q=pubKey
      var nodeBaseUrl = settings.get('user.node');
      var txinfourl=nodeBaseUrl+'broadcast_tx_commit';

      var TxMessagebuffer = TxMessage.encode(TxMessageData).finish();
      var TxMessageJson = TxMessagebuffer.toJSON();  
      var  result = await axios.get(txinfourl, {
            params: {
              tx:JSON.stringify(TxMessageJson.data)
            }
      });
      
      
      return {data:result,state:true} 
        
      } catch (error) {
        log.error(error)
          return {data:JSON.stringify(error),state:false} 
      }

    })
}
