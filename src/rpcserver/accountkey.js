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
        log.info('privateKey:'+keyPair.privateKey.toString('hex'))

        
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

    }),
    app.get('/ImportWallet/:password/:name/:mnemonic',function(req,res){
        log.info('ImportWallet') 
        var password = req.params.password;
        var name = req.params.name;
        var mnemonic=decodeURIComponent(req.params.mnemonic);

        var tenderKeys = new TenderKeys();
        var seed     =  tenderKeys.generateSeed(mnemonic);
        var keyPair  = tenderKeys.generateKeyPair(seed);
        
        var address  = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));
        log.info('privateKey:'+keyPair.privateKey.toString('hex'))
        password=decodeURIComponent(password);
        var wallet =new ETHwallet(keyPair.privateKey);
        
        var walletjson = wallet.toV3(password)
        walletjson.name=name;
        
        
        var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json';
        if(fs.existsSync(DAEMON_CONFIG.BASE_PATH)==false) {
                fs.mkdirSync(DAEMON_CONFIG.BASE_PATH);
        }
        var result = fs.writeFileSync(path,JSON.stringify(walletjson))    
        res.json({
            data:true
        })

    })
    app.get('/ImportWalletByfile/:path/',function(req,res){
        log.info('ImportWalletByfile')
        //1 读取文件
        //2 转为json
        //3 判断是否有 name 和address
        //4 复制文件
        
        
        var path=decodeURIComponent(req.params.path) ;
        log.info(path)
        var v3file =fs.readFileSync(path);
        var v3file = JSON.parse(v3file);
        log.info(v3file)
        if(v3file.address==undefined){
            return res.json({
                data:true
            })
        }
        var targetpath= DAEMON_CONFIG.BASE_PATH+'/v3filetarget.json'
        var readStream = fs.createReadStream(path);
        var writeStream = fs.createWriteStream(targetpath);
        readStream.pipe(writeStream);




        res.json({
            data:true
        })

    })

    
  
    
}

