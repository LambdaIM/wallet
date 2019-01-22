
const objectAssign = require('object-assign');

const path =require('path')
const account=require(path.join(__dirname, "../src/rpcserver/accountkey.js"));







var express = require('express')
var app = express()
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}); 
app.get('/', function (req, res) {
  res.send('Hello World elect')
})

account(app);
 
app.listen(process.env.RPC_PORT)



process.on('uncaughtException', (err) => {
  Object.assign({}, err);
  console.log('uncaughtException',err)
  process.send({
    error: err.stack
  }); // 'A Fatal Exception has occured in the genaroshare-daemon RPC server'
});