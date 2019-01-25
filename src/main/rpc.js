const eipc = require('electron-better-ipc');
const axios =require('axios');
var protobuf = require("protobufjs");
const path = require('path');
const { shell } = require('electron');
var {DAEMON_CONFIG} =require('../config.js')
var protofilepath=path.join(__static, '/awesome.proto');
// console.log('filepath',protofilepath)
// protobuf.load(protofilepath)
//     .then((root)=>{

        
//         var AccountMessage = root.lookupType("types.Account");
//         var buf=Buffer.from('ChTNjtlp2IHA4Lezm6MoU9tnQcWvsRDege2XugEYtQsqICp9Aslk0G/xdz7xiQAsYEC7A4lmaUMV+wn/Lf2pZmUe','base64')
//         var account = AccountMessage.decode(buf);
//         console.log('*****',account)
//         var cc= account.address.toString('hex')
//         console.log(cc)
//         console.log('balance',parseInt(account.balance, 10))


//     })
//     .catch((err)=>{
//         console.log(err)
//     })


 export default function(){
     console.log('electron-better-ipc')
    eipc.answerRenderer('httpget', async (query) => {
        // const emoji = await getEmoji(emojiName);
        // return emoji;
        console.log('url',query.url)
        console.log('data',query.data)
        try {
            const result = await axios.get(query.url, {
                params: query.data||{}
              })
              console.log('result',result.data.result.response)
            return {data:result,state:true} ;
            
        } catch (error) {
            return {data:error,state:false} 
            
        }
        
    
          
    });
    eipc.answerRenderer('httppost', async (query) => {
        // const emoji = await getEmoji(emojiName);
        // return emoji;
        try {
            const result = await axios.post(query.url, query.data||{})
            return {data:result,state:true} ;
            
        } catch (error) {
            return {data:error,state:false} 
            
        }
    
    });
    eipc.answerRenderer('openkeystore', async (query) => {
        // const emoji = await getEmoji(emojiName);
        // return emoji;
        shell.showItemInFolder(DAEMON_CONFIG.BASE_PATH);

    
    });
    eipc.answerRenderer('protodecode', async (query) => {
        // const emoji = await getEmoji(emojiName);
        // return emoji;
        console.log('value',query.value)
        console.log('dataType',query.dataType)
        try {
              var value = query.value;
              const protoRoot = await  protobuf.load(protofilepath);
              var buf=Buffer.from(value,'base64');
              console.log('BUF',buf);

              var AccountMessage = protoRoot.lookupType(query.dataType);
              var Message=AccountMessage.decode(buf);
              console.log('nonce');
              console.log('Message',Message.nonce);
              console.log('nonce');
              var acountjson={
                address:Message.address.toString('hex'),
                balance:parseInt(Message.balance, 10),
                nonce:parseInt(Message.nonce, 10)
              }
            return {data:acountjson,state:true} ;
            
        } catch (error) {
            console.log(error)
            return {data:JSON.stringify(error),state:false} 
            
        }
        
    
          
    });
    




};