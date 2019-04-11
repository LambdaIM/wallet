var {DAEMON_CONFIG} =require('../configmain.js');
const eipc = require('electron-better-ipc');
import resultView from './result.js';
const settings = require('electron-settings');
var log = require('../log').log;
const axios =require('axios');
var protobuf = require("protobufjs");
const path = require('path');
import { Base64 } from 'js-base64';
import bigInter from './bigInter';
import defaultAddress from './defaultAddress';
import generatesha256 from './generatesha256';


export default function(){
  

  var protofilepath = path.join(__static, '/awesome.proto');

    eipc.answerRenderer('getOrderListByAddress',async(query)=>{
        // http://39.105.156.36:13659/getMatchListByAddress?address=%2266591f471aeff5afd63cbd2d2656e38442aacc29%22&pageNum=%221%22&showNum=%2210%22
        try{
            var result={};
            
            var nodeBaseUrl = DAEMON_CONFIG.LambdaExtenNetwork();
            var address = defaultAddress();
            var pageNum = query.pageNum||1;
            var showNum = query.showNum||10;
            
            var addressinfourl = `${nodeBaseUrl}getOrderListByAddress?address="${address}"&pageNum="${pageNum}"&showNum="${showNum}"`

            log.info(addressinfourl);

            var result  = await axios.get(addressinfourl);

            
            return resultView(result,true)

        }catch(ex){
          throw resultView(null,false,ex)
        }
    })

    eipc.answerRenderer('getMatchListByAddress',async(query)=>{
        //66591f471aeff5afd63cbd2d2656e38442aacc29
        // http://39.105.156.36:13659/getOrderListByAddress?address=%2266591f471aeff5afd63cbd2d2656e38442aacc29%22&pageNum=%221%22&showNum=%2210%22
        try{
            var nodeBaseUrl = DAEMON_CONFIG.LambdaExtenNetwork();

            var address = defaultAddress();
            var pageNum = query.pageNum||1;
            var showNum = query.showNum||10;
            
            var addressinfourl = `${nodeBaseUrl}getMatchListByAddress?address="${address}"&pageNum="${pageNum}"&showNum="${showNum}"`

            log.info(addressinfourl);

            var result  = await axios.get(addressinfourl);

            
            return resultView(result,true)

        }catch(ex){
          throw resultView(null,false,ex)
        }
    })


    eipc.answerRenderer('pledgeMiner',async(query)=>{
      //66591f471aeff5afd63cbd2d2656e38442aacc29
      // http://39.105.156.36:13659/getOrderListByAddress?address=%2266591f471aeff5afd63cbd2d2656e38442aacc29%22&pageNum=%221%22&showNum=%2210%22
      try{
         var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork();

          var address = defaultAddress();
          var pageNum = query.pageNum||1;
          var showNum = query.showNum||10;
          
          var addressinfourl = `${nodeBaseUrl}abci_query?path=%22/storage/${address}%22&data=&height=&prove=`

          log.info(addressinfourl);

          var {data}  = await axios.get(addressinfourl);
          // console.log(data)
          if(data.result.response.code!=undefined){
            throw new Error(data.result.response.log) ;
          }
          var value = data.result.response.value;
           value = Base64.decode(value);
           value =JSON.parse(value);

          
          return resultView(value,true)

      }catch(ex){
        throw resultView(null,false,ex)
      }
  })

  eipc.answerRenderer('askpledgeOrder',async(query)=>{
    //66591f471aeff5afd63cbd2d2656e38442aacc29
    // http://39.105.156.36:13659/getOrderListByAddress?address=%2266591f471aeff5afd63cbd2d2656e38442aacc29%22&pageNum=%221%22&showNum=%2210%22
    try{
        // var nodeBaseUrl = DAEMON_CONFIG.LambdaExtenNetwork();
        const protoRoot = await protobuf.load(protofilepath);

        var address = defaultAddress();
        var duration =query.duration;
        var priceP =query.price;
        var sizeP = query.size;
        var sellSizeP = query.sellSize;
        var ip = query.ip;   //这个ip现在是必须要填写的
        var status =query.status;
        var typeP =query.type;
        log.info(priceP)
        log.info(sizeP)
        log.info(sellSizeP)
        var price = bigInter(protoRoot,priceP);
        var size = bigInter(protoRoot,sizeP);
        var sellSize = bigInter(protoRoot,sellSizeP);
        
        var OrderDataMessage = protoRoot.lookupType('types.OrderData');
        log.info('address')
        log.info(address)
        var payload={
          address:Buffer.from(address,'hex'),
          duration:duration,
          price:price,
          size:size,
          // type:typeP, //加上这个字段就会签名异常
          status:status,
          ip:ip,
          createTime:+(new Date()).getTime().toString().substr(0, 10),
          // createTime:1554281566,
          
          sellSize :sellSize
        }

        var errMsg = OrderDataMessage.verify(payload);
        log.info(errMsg)
        if (errMsg)
            throw errMsg

        var TxOrderData = OrderDataMessage.create(payload);
        var TxOrderDatabuffer = OrderDataMessage.encode(TxOrderData).finish();
        
        // var  testbf= Buffer.from('080e2a680a2006b623ff16c14964a99763462151e8e7f50e8a87ce05cc9039bc8e79673acd4112440a1458f5173838d50d5fab4a06489c84ebe85f73782210e9021a0c080112080de0b6b3a7640000220608011202040028dee891e5053801420b3139322e3136382e312e31','hex')
        // var  tt = OrderDataMessage.decode(testbf);
        // log.info(tt)

        var TxOrderMessage = protoRoot.lookupType('types.TxOrder');
        log.info('- -')
        log.info(TxOrderData)
        log.info(TxOrderDatabuffer.toString('hex'))
        log.info('- -')
        var TxOrderload = {
            id: generatesha256(TxOrderDatabuffer),
            data: TxOrderData
        }
        ///
        errMsg = TxOrderMessage.verify(TxOrderload);
        log.error(errMsg)
        if (errMsg)
            throw errMsg

        var TxOrder = TxOrderMessage.create(TxOrderload);
        log.info('TxOrder')
        log.info(TxOrder)

        var TxOrderbuffer = TxOrderMessage.encode(TxOrder).finish()
        log.info('TxOrderbuffer');
        log.info(TxOrderbuffer)

        

        return resultView({
          dataType:'types.TxOrder',
          hexdata:TxOrderbuffer.toString('hex'),
          sendType: 'txOrder'
        },true)

    }catch(ex){
      throw resultView(null,false,ex)
    }
})

eipc.answerRenderer('pledgeNewspace',async(query)=>{
  //66591f471aeff5afd63cbd2d2656e38442aacc29
  // http://39.105.156.36:13659/getOrderListByAddress?address=%2266591f471aeff5afd63cbd2d2656e38442aacc29%22&pageNum=%221%22&showNum=%2210%22
  try{
      var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork();
      const protoRoot = await protobuf.load(protofilepath);

      var address = defaultAddress();
      var SumSectors =query.sumSectors;
      var validatorAddress =query.validatorAddress;
      var ip = '127.0.0.1'; //质押的这个ip 可能不用填写没什么用现在
      
      var Sum_Sectors = bigInter(protoRoot,SumSectors);
      var TxDataMessage = protoRoot.lookupType('types.TxPledgeNew');

      var payload={
        address:Buffer.from(address,'hex'),
        sumSectors:Sum_Sectors,
        pledgeTime:+(new Date()).getTime().toString().substr(0, 10),
        validatorAddress:Buffer.from(validatorAddress,'hex'),
        ip:Buffer.from(ip),
        
      }

      var errMsg = TxDataMessage.verify(payload);
      log.info(errMsg)
      if (errMsg)
          throw errMsg

      var TxData = TxDataMessage.create(payload);

      console.log('TxData',TxData);

      var TxMessagebuffer = TxDataMessage.encode(TxData).finish();
      // var result={};
      return resultView({
        dataType:'types.TxPledgeNew',
        hexdata:TxMessagebuffer.toString('hex'),
        sendType: 'txPledgeNew'
      },true)

  }catch(ex){
    throw resultView(null,false,ex)
  }
})



    //http://39.97.129.59:13657/abci_query?path=%22/storage/af0f97e8370ec3812be5b3a7bec7d4932ccb6242%22&data=&height=&prove=
    


  }