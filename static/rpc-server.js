const dnode = require('dnode');
const objectAssign = require('object-assign');

const path =require('path')
const account=require(path.join(__dirname, "../src/rpcserver/accountkey.js"));







var express = require('express')
var app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World elect')
})
account(app);
 
app.listen(process.env.RPC_PORT)



process.on('uncaughtException', (err) => {
  Object.assign({}, err);
  process.send({
    error: err.stack
  }); // 'A Fatal Exception has occured in the genaroshare-daemon RPC server'
});