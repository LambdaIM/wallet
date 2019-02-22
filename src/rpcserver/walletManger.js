

var ETHwallet = require('./ETHv3wallet.js');
var fs = require('graceful-fs')
var log = require('./log').log;
var {DAEMON_CONFIG} =require('./configmain.js');
var TenderKeys =require('tendermintelectronkey')





var walletManger =function(dir){
    //遍历文件夹
    //
    this.walletList=[];
    this.defaultwallet=null;
    //默认的钱包 应该存储在 配置文件里面
    
    this.scann();
    this.setDefaultWallet();

}

walletManger.prototype.scann=function(){
    this.walletList=[];
    var dir=DAEMON_CONFIG.WalletFile;
    var list = fs.readdirSync(dir);

    list.forEach((file)=>{
        file = dir + '/' + file
        
        var v3file =fs.readFileSync(file,'utf8');
        try{
            v3file=JSON.parse(v3file);
            if(v3file.address!=undefined ){
                this.walletList.push(v3file)
            }
        }catch(err){

            console.log(err)

        }   
    })



    
}

walletManger.prototype.getDefaultwalletBasicinfo=function(){
    if(this.defaultwallet){
        return {
            address:this.defaultwallet.address,
            name:this.defaultwallet.name
        };

    }else{
        return null;
    }
    
    

}

walletManger.prototype.OpenDefaultwallet=function(password){
    var wallet,info;
    try{

        wallet = ETHwallet.fromV3(this.defaultwallet,password);
        info={
            publicKey:wallet.pubKey,
            address:wallet.getAddress(),
            name:this.defaultwallet.name,
            privKey:wallet._privKey,
        }

    }catch(ex){

    }
    
    return info;

}

walletManger.prototype.setDefaultWallet=function(address){
    if(address==undefined){
        if(this.walletList.length==0){
            return false;
        }
        address=this.walletList[0].address;
    }
    var objwallet;
    this.walletList.forEach(function(obj){
        if(address==obj.address){
            objwallet = obj;
        }
    })
  if(objwallet==undefined){
      return false;
  }
  this.defaultwallet=objwallet;

    
}

walletManger.prototype.getWalletList=function(){
    var result=[];

    this.walletList.forEach(function(item){
        result.push({
            name:item.name,
            address:item.address
        })
    })

    return result;


    
    
}



walletManger.prototype.creatWallet=function(password,name){
        var tenderKeys = new TenderKeys();

        var mnemonic = tenderKeys.generateRandomMnemonic();
        return this.generateWallet(mnemonic,password,name)
        
    
}
walletManger.prototype.generateWallet=function(mnemonic,password,name){
    var tenderKeys = new TenderKeys();

    
    var seed     =  tenderKeys.generateSeed(mnemonic);
    var keyPair  = tenderKeys.generateKeyPair(seed);
    
    var address  = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));
    
    

    var wallet =new ETHwallet(keyPair.privateKey);
    var walletjson = wallet.toV3(password)
    walletjson.name=name;
    
    var path= DAEMON_CONFIG.WalletFile+'/'+ wallet.getV3Filename()+'.json';
    if(fs.existsSync(DAEMON_CONFIG.WalletFile)==false) {
            fs.mkdirSync(DAEMON_CONFIG.WalletFile);
    }
    
    var result = fs.writeFileSync(path,JSON.stringify(walletjson))    
    this.scann();
    return  {
        mnemonic:mnemonic,
        address:address,
        name:name
    }

}

walletManger.prototype.deleteWallet=function(address){

    var dir=DAEMON_CONFIG.WalletFile;
    var list = fs.readdirSync(dir);
    
    list.forEach((file)=>{
         var filepath = dir + '/' + file
        try{
            if(file.indexOf(address)>0){
                result=fs.unlinkSync(filepath); 
                this.scann();
            }
        }catch(err){        
            console.log(err);
        }   
    })

}

walletManger.prototype.ImportWalletByMnemonic=function(mnemonic,password,name){
    return this.generateWallet(mnemonic,password,name)   
}


walletManger.prototype.ImportWalletBykeyStore=function(filepath,password,name){    
    
    var wallet;
    try{
        var v3file =fs.readFileSync(filepath,'utf8');
        v3file=JSON.parse(v3file);
        v3file.name = name;
    }catch(ex){
        log.info('Exceptional file format')
       return new Error('Exceptional file format')
    }
    try{
         wallet = ETHwallet.fromV3(v3file,password);
    }catch(ex){
        log.info('Incorrect password')
        return new Error('Incorrect password')
    }
    
    var targetpath= DAEMON_CONFIG.WalletFile+'/'+ wallet.getV3Filename()+'.json';

    console.log(JSON.stringify(v3file));

    fs.writeFileSync(targetpath, JSON.stringify(v3file), 'utf8')

    return true;    
}




module.exports = walletManger