var TenderKeys =require('tendermintelectronkey')
var ETHwallet = require('./ETHv3wallet.js');
var {DAEMON_CONFIG} =require('../config.js')
var fs = require('graceful-fs')

module.exports={
    createWallet:function(query,cb){
        console.log(query);
        var tenderKeys = new TenderKeys();
        var mnemonic = tenderKeys.generateRandomMnemonic();
        var seed     =  tenderKeys.generateSeed(mnemonic);
        var keyPair  = tenderKeys.generateKeyPair(seed);
        //然后把 keyPair 以web3格式存储起来
        var address  = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));

        console.log("mnemonic    :" + mnemonic);
        console.log("private key :" + keyPair.privateKey.toString('base64'));
        console.log("Public key  :" + keyPair.publicKey.toString('base64'));
        console.log("address     :" + address);
        var result={
            mnemonic,
            address
        }
        console.log('privateKey hex',keyPair.privateKey.toString('hex'))
        console.log('privateKey',keyPair.privateKey)
        var wallet =new ETHwallet(keyPair.privateKey);
        var walletjson = wallet.toV3(query.password)
        walletjson.name=query.name;
        console.log('walletjson')
        console.log(walletjson);
        
        var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
        console.log(DAEMON_CONFIG)
        console.log('path',path);
        if(fs.existsSync(DAEMON_CONFIG.BASE_PATH)==false) {
                fs.mkdirSync(DAEMON_CONFIG.BASE_PATH);
        }
        var result = fs.writeFileSync(path,JSON.stringify(walletjson))    
        // ///===
        // try {
        //     var v3file =fs.readFileSync(path,'utf8');
        //     console.log('v3file',v3file)
        //     var wallet = ETHwallet.fromV3(v3file,password);
        //     console.log('privateKey',wallet._privKey)
        //     console.log('privateKey',keyPair.privateKey)
            
        // } catch (error) {
        //     console.log(error)
            
        // }
            
        // ///===
        cb(mnemonic)
    },
    getWalletAddress:function(p,cb){
        var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
        var v3file =fs.readFileSync(path);
        var v3file = JSON.parse(v3file);
        
        cb(v3file.address)

    },
    getWallet:function(password,cb){
        console.log('getWallet')
        try {
            var path= DAEMON_CONFIG.BASE_PATH+'/v3file.json'
            var v3file =fs.readFileSync(path,'utf8');
            console.log('v3file',v3file)
            var wallet = ETHwallet.fromV3(v3file,password);
            v3file=JSON.parse(v3file);
            var info={
                publicKey:wallet.pubKey,
                address:wallet.getAddress(),
                name:v3file.name

            }
            
        } catch (error) {
            console.log(error)
        }
        
        
        cb(info)


    }
}