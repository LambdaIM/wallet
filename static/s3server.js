// const objectAssign = require('object-assign');

const path =require('path')
// const account=require(path.join(__dirname, "../src/rpcserver/accountkey.js"));
// const account=require('rpcserver');
var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const hdkeyjs = require('@jswebfans/hdkeyjs');
console.log('==============s3server')
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





// walletManger.prototype.SignData = async function (password, content) {
//   var contentBuffer = Buffer.from(content);

//   var privatekey = hdkeyjs.keyStore.checkJson(this.defaultwallet, password);

//   var sindata = hdkeyjs.crypto.sign(
//     contentBuffer,
//     privatekey
//   );



//   var TxMessageload = {
//     key: this.defaultwallet.publicKey,
//     content: content,
//     signature: sindata.toString('hex')
//   };
//   return TxMessageload;
// };


app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// account(app);
app.get('/', function (req, res) {
  res.send('Hello World elect')
})
var defaultwallet,password;
app.post('/authorization', function (req, res) {
  
  defaultwallet=req.body.defaultwallet ;
  password=req.body.password;
  if(defaultwallet==undefined||password==undefined){
    res.send({ok:false,error:'need defaultwallet or password'})
  }
  try {
    var privatekey = hdkeyjs.keyStore.checkJson( defaultwallet, password);
  if(privatekey){
    res.send({ok:true})
  }else{
    res.send({ok:false})
  }  
  } catch (error) {
    console.log('*****')
    console.log(error)
    console.log('*****')
    res.send({ok:false,error:error})
  }
    
})
app.get('/isauthorization', function (req, res) {
  if(defaultwallet==undefined||password==undefined){
    res.send({ok:false,error:'need defaultwallet or password'})
  }else{
    res.send({ok:true})
  }
})

app.get('/s3signature', function (req, res) {
  if(defaultwallet==undefined||password==undefined){
    res.send({ok:false,error:'need defaultwallet or password'})
  }else{
    content=req.body.content ;
  var contentBuffer = Buffer.from(content);

  var privatekey = hdkeyjs.keyStore.checkJson(defaultwallet, password);

  var sindata = hdkeyjs.crypto.sign(
    contentBuffer,
    privatekey
  );
    res.send({ok:true,data:sindata})
  }
})




 
app.listen(process.env.RPC_PORT)



process.on('uncaughtException', (err) => {
  Object.assign({}, err);
  console.log('uncaughtException',err)
  process.send({
    error: err.stack
  }); // 'A Fatal Exception has occured in the genaroshare-daemon RPC server'
});
console.log('==============s3server end',process.env.RPC_PORT)