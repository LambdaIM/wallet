var TenderKeys =require('tendermintelectronkey')
var ETHwallet = require('./ETHv3wallet.js');
var {DAEMON_CONFIG} =require('./config.js')
var fs = require('graceful-fs')
var log = require('./log').log;

module.exports=function(app){
    app.get('/createWallet/:password/:name',function(req, res){
        log.info('createWallet') 
        var password = req.params.password;
        var name = req.params.name;
        var tenderKeys = new TenderKeys();

        var mnemonic = tenderKeys.generateRandomMnemonic();
        var seed     =  tenderKeys.generateSeed(mnemonic);
        var keyPair  = tenderKeys.generateKeyPair(seed);
        
        var address  = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));
        var result={
            mnemonic,
            address
        }
        password=decodeURIComponent(password);

        var wallet =new ETHwallet(keyPair.privateKey);
        var walletjson = wallet.toV3(password)
        walletjson.name=name;
        
        
        var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
        if(fs.existsSync(DAEMON_CONFIG.BASE_PATH)==false) {
                fs.mkdirSync(DAEMON_CONFIG.BASE_PATH);
        }
        var result = fs.writeFileSync(path,JSON.stringify(walletjson))    
        res.json({
            data:mnemonic
        })	
        

    })
    app.get('/getWalletAddress',function(req,res){
        log.info('getWalletAddress');
        var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
        var v3file =fs.readFileSync(path);
        var v3file = JSON.parse(v3file);

        res.json({data:{
            address:v3file.address,
            name:v3file.name
        }})	

    }),
    app.get('/openWallet/:password',function(req,res){
        log.info('openWallet');
        var password = req.params.password;
        var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json';
        var v3file =fs.readFileSync(path,'utf8');

        
        password=decodeURIComponent(password);
        var wallet = ETHwallet.fromV3(v3file,password);
        v3file=JSON.parse(v3file);

        var info={
            publicKey:wallet.pubKey,
            address:wallet.getAddress(),
            name:v3file.name
        }
        res.json({
            data:info
        })	

    })
  
    
}

