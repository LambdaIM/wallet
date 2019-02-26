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
        
        password=decodeURIComponent(password);

        var wallet =new ETHwallet(keyPair.privateKey);
        var walletjson = wallet.toV3(password)
        walletjson.name=name;
        
        
        var path= DAEMON_CONFIG.BASE_PATH+'/lambda.keyinfo'
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
        var path= DAEMON_CONFIG.BASE_PATH+'/lambda.keyinfo'
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
        var path= DAEMON_CONFIG.BASE_PATH+'/lambda.keyinfo';
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

    app.get('/ImportWalletByfile/:path/:name/:password',function(req,res){
        log.info('ImportWalletByfile')
        
        
        var path=decodeURIComponent(req.params.path) ;
        var name=decodeURIComponent(req.params.name) ;
        var password=decodeURIComponent(req.params.password) ;

        log.info(path)
        var v3file =fs.readFileSync(path,'utf-8');
        var wallet; 
        try{
            log.info(v3file);
             wallet = ETHwallet.fromV3(v3file,password);
            

        }catch(ex){
            wallet=null;

        }
        if(wallet==null){
            res.json({
                data:'Exceptional file format or incorrect wallet password',
                state:false
            })
            return ;
        }
        
        var targetpath= DAEMON_CONFIG.BASE_PATH+'/lambda.keyinfo';
        var readStream = fs.createReadStream(path);
        var writeStream = fs.createWriteStream(targetpath);
        readStream.pipe(writeStream);

        res.json({
            data:'Import wallet successfully',
            state:true
        })

    })
  
    
}

