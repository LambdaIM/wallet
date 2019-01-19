const dnode = require('dnode');
const objectAssign = require('object-assign');

const path =require('path')
const account=require(path.join(__dirname, "../src/rpcserver/accountkey.js"));



 var obj={
     abc:function(s, cb){
       console.log('abc!!!!!'+Date.now())
       cb('abc!!!!!'+Date.now())
     }
 }

let api =objectAssign({}, obj,account);

dnode(api).listen(process.env.RPC_PORT, () => {
  process.send({
    state: 'init'
  });
});

process.on('uncaughtException', (err) => {
  Object.assign({}, err);
  process.send({
    error: err.stack
  }); // 'A Fatal Exception has occured in the genaroshare-daemon RPC server'
});