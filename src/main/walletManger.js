


var fs = require('graceful-fs')
var log = require('../log').log;
var { DAEMON_CONFIG } = require('../configmain.js');


const settings = require("electron-settings");
const path = require('path');
const cosmos = require('@jswebfans/cosmos-lib');

import transaction from "./utils/transactionTypes"
import ActionManager from "./utils/ActionManager.js"

import BigNum from './utils/BigNum';
import LambdaApi from './lambdaApi';





var walletManger = function (dir) {
    //遍历文件夹
    //
    this.walletList = [];
    this.defaultwallet = null;
    //默认的钱包 应该存储在 配置文件里面

    this.lastpayobj = null;
    this.lastpayArry = null;
    
    this.CosmosAPI= LambdaApi()
    this.actionManager=new ActionManager()

    this.scann();
    this.setDefaultWallet();

    
    

    this.gasEstimate=null;
    
    
    
    

}
walletManger.prototype.readconfig = function () {

    // console.log('defaultwallet', settings.get('defaultwallet'));

    if (settings.has('defaultwallet') != undefined) {
        return settings.get('defaultwallet')
    }
}

walletManger.prototype.setconfig = function (address) {
    settings.set('defaultwallet', address);
}

walletManger.prototype.scann = function () {
    this.walletList = [];
    var dir = DAEMON_CONFIG.WalletFile;
    var list = fs.readdirSync(dir);
    list.forEach((file) => {
        if(file.indexOf('.keyinfo')>0){
            file = path.join(dir, file);
            var v3file = fs.readFileSync(file, 'utf8');
            try {
                v3file = JSON.parse(v3file);
                if (v3file.address != undefined) {
                    this.walletList.push(v3file)
                }
            } catch (err) {

                console.log(err)

            }
         
        }
        
    })




}

walletManger.prototype.getDefaultwalletBasicinfo = function () {
    if(this.defaultwallet==null){
        throw new Error('not find DefaultWallet')
     }
     return {
        address: this.defaultwallet.address,
        name: this.defaultwallet.name
    };



}

walletManger.prototype.OpenDefaultwallet = function (password) {
    var wallet, info;
    log.info('OpenDefaultwallet')
    log.info(this.defaultwallet.address)
    if(this.defaultwallet==null){
        throw new Error('not find DefaultWallet')
    }

    var  privatekey=cosmos.keyStore.checkJson(this.defaultwallet, password)
    
    info = {
        publicKey: this.defaultwallet.publicKey,
        address: this.defaultwallet.address,
        name: this.defaultwallet.name,
        privatekey: privatekey,
    }

    return info;

}

walletManger.prototype.setDefaultWallet = function (address) {
    log.info('setDefaultWallet')
    var addressdefault = this.readconfig()
    // addressdefault=addressdefault.toUpperCase();
    log.info('setDefaultWallet',addressdefault,address)
    var target;


    if (address != undefined) {
        this.setconfig(address)
        target = address
    } else if (addressdefault != undefined) {
        this.setconfig(addressdefault)
        target = addressdefault
    } else {
        if (this.walletList.length == 0) {
            this.defaultwallet = null;
            return ;
            
        }
        target = this.walletList[0].address
        this.setconfig(target)
    }


    var objwallet;
    
    this.walletList.forEach(function (obj) {

        if (target == obj.address) {
            objwallet = obj;
        }
    })
    if (objwallet == undefined) {
        this.defaultwallet = null;
    }else{
        this.defaultwallet = objwallet;

    }
    
    
    
    


}

walletManger.prototype.getWalletList = function () {
    this.scann();
    var result = [];

    this.walletList.forEach(function (item) {
        result.push({
            name: item.name,
            address: item.address
        })
    })

    return result;




}



walletManger.prototype.creatWallet = function (password, name) {
    

    var mnemonic = cosmos.crypto.generateRandomMnemonic(256);


    return this.generateWallet(mnemonic, password, name)


}
walletManger.prototype.generateWallet = function (mnemonic, password, name) {
    

    const keys = cosmos.crypto.getKeysFromMnemonic(mnemonic);
    // var seed = tenderKeys.generateSeed(mnemonic);
    // var keyPair = tenderKeys.generateKeyPair(seed);

    // var address = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));
    const address = cosmos.address.getAddress(keys.publicKey);
    var file = this.findFile(address);
    if(file!=null){
        throw new Error('Import failed,address already exists') 
    }
    log.info('--------------')
    log.info("地址:"+address) 
    log.info("pub:"+keys.publicKey.toString('base64')) 
    log.info("pri:"+keys.privateKey.toString('base64'))
    log.info('--------------')
    // var cospublicKey=cosmos.publicKey.getPublicKey(keys.publicKey);
    // var walletjson=cosmos.privateKey.ExportprivateKey(keys.privateKey,password)
    var walletjson = cosmos.keyStore.toJson(keys,password,name);

   

    var filepath = path.join(DAEMON_CONFIG.WalletFile, address + '.keyinfo');

    var result = fs.writeFileSync(filepath, JSON.stringify(walletjson))
    this.scann();
    return {
        mnemonic: mnemonic,
        address: address,
        name: name
    }

}

walletManger.prototype.deleteWallet = function (address) {

    var dir = DAEMON_CONFIG.WalletFile;
    var list = fs.readdirSync(dir);

    list.forEach((file) => {
        var filepath = path.join(dir, file);
        try {
            if (file.indexOf(address) > 0) {
                result = fs.unlinkSync(filepath);
                this.scann();
            }
        } catch (err) {
            console.log(err);
        }
    })

}

walletManger.prototype.ImportWalletByMnemonic = function (mnemonic, password, name) {
    var mnemonicList = mnemonic.match(/[a-z]+[\-\']?[a-z]*/ig);
    if(mnemonicList==null||mnemonicList.length<12){
        throw new Error('make sure  inputting 12 words or more ') 
    }
    var mnemonic=mnemonicList.join(' ')
    return this.generateWallet(mnemonic, password, name)
}


walletManger.prototype.ImportWalletBykeyStore = function (filepath, password, name) {

    var wallet;

    var v3file = fs.readFileSync(filepath, 'utf8');
    v3file = JSON.parse(v3file);
    v3file.name = name;
    var  privatekey=cosmos.keyStore.checkJson(v3file, password)
    // wallet = ETHwallet.fromV3(v3file, password);

    if(privatekey == undefined){
        throw new Error('Import failed,Please check the wallet file and password') 
    }

    
    var file = this.findFile(v3file.address);
    if(file!=null){
        throw new Error('Import failed,address already exists') 
    }

    
    var targetpath = path.join(DAEMON_CONFIG.WalletFile,  v3file.address  + '.keyinfo');
    fs.writeFileSync(targetpath, JSON.stringify(v3file), 'utf8')
    this.scann();
    return true;
}


walletManger.prototype.getDefaultWalletBlance = async function () {
    log.info('walletManger getDefaultWalletBlance')
    
    if(this.defaultwallet==null){
       throw new Error('not find DefaultWallet')
    }

    
    var result = await this.CosmosAPI().get.account(this.defaultwallet.address);
    log.info('账户信息')
    log.info(result)
    //返回结果 1  { sequence: '0', accountNumber: '0' }
    // 返回结果2 

    // const delegations = await this.CosmosAPI.get.delegations(this.defaultwallet.address)


    
    var balanceLamb=0;
    var balanceSto=0;
    if(result.coins instanceof Array){
        result.coins.forEach((item)=>{
            if(item.denom=='ulamb'){
                balanceLamb=item.amount
            }
            if(item.denom=='utbb'){
                balanceSto=item.amount
            }
        })

    }
    

    var acountjson = {
        address: result.address,
        balance: balanceLamb,
        balanceSto:balanceSto,
        coins:result.coins,
        sequence:result.sequence

        // nonce: parseInt(Message.nonce, 10)
    }

    return acountjson;



}

walletManger.prototype.getDelegationsBalance =async  function () {
    console.log('getDelegationsBalance')

    var address = this.defaultwallet.address;
    var delegationsList  = await this.CosmosAPI().get.delegations(address);
    var partnerDelegations  = await this.CosmosAPI().get.partnerDelegations(address);
    var result=0;
    
    if( delegationsList instanceof Array){
        delegationsList.forEach((item)=>{
            // result+=(item.shares-0);
            console.log('item.shares',item)
            result=BigNum(item.shares).plus(result)
        })

    } 
    if(partnerDelegations instanceof Array){
        partnerDelegations.forEach((item)=>{
            // result+=(item.shares-0);
            result=BigNum(item.shares).plus(result)
        })
    }
    return result.toString();
}

walletManger.prototype.getDistributionRewards = async function (){
    var address = this.defaultwallet.address;
    var result =  await this.CosmosAPI().get.delegatorRewards(address);

    return result;

}
walletManger.prototype.TransferDelegation = async function (to, amount, gas,isdege,validatorType) {
    
        if (isdege) {
            //质押
          return {
            type: transaction.DELEGATE,
            validatorAddress: to,
            amount: amount,
            denom: 'utbb',
            validatortype:validatorType
          }
        } else {
            //取消质押
          return {
            type: transaction.UNDELEGATE,
            validatorAddress: to,
            amount: amount,
            denom: 'utbb',
            validatortype:validatorType
          }
        }
}
walletManger.prototype.TransferWithdrawal = async function (to, amount, gas,isdege) {
      return {
        type: transaction.WITHDRAW,
        amount: amount,
        denom: 'lamb'
      }
}
walletManger.prototype.AssetPledge = async function (amount,asset, gas,isdege,denom) {
    if(isdege){
        return {
            type: transaction.AssetPledge,
            amounts: {
                amount: amount,
                denom: denom
              }
            ,
            asset: {
                amount: asset,
                denom: 'utbb'
              }
            
          }

    }else{
        return {
            type: transaction.AssetDrop,
            amounts: {
                amount: amount,
                denom: denom
              }
            ,
            asset: {
                amount: asset,
                denom: 'utbb'
              }
            
          }
    }
    
}




walletManger.prototype.Transfer = async function (to, amount, gas,denom,memo) {

    

    var result =  {
        type: transaction.SEND,
        toAddress: to,
        amounts: [
          {
            amount: amount,
            denom: denom||'ulamb'
          }
        ],
        memo: memo||''
      }
    return result;
     
}
walletManger.prototype.Simulate = async function (transactiondata) {
    var  default_gas_price=2.5e-8; // recommended from Cosmos Docs
    const { type, memo, ...properties } = transactiondata
    if(this.actionManager!=undefined){
        this.actionManager.setContext({url:DAEMON_CONFIG.LambdaNetwork(),userAddress:this.defaultwallet.address})
    }
    
     this.actionManager.setMessage(type, properties)
     var  gasEstimate = await this.actionManager.simulate(memo||'')
     this.gasEstimate=gasEstimate;
    //  return gasEstimate;
     return (Number(default_gas_price) * Number(gasEstimate)).toFixed(6) // already in lamb
}

walletManger.prototype.TransferConfirm = async function (password,transactiondata,gaseFee) {
    log.info('walletManger transferConfirm start')
    const SIGN_METHODS = {
        LOCAL: `local`,
        LEDGER: `ledger`,
        EXTENSION: `extension`
      }
    
   
    //=========
    const { type, memo, ...transactionProperties } = transactiondata

    
      var gasEstimate =this.gasEstimate||500000; //需要接口读取
      var default_gas_price=2.5e-8; // recommended from Cosmos Docs
      if(gaseFee==undefined){
        default_gas_price=2.5e-8; // recommended from Cosmos Docs
      }else{
        default_gas_price=Number(gaseFee)/Number(gasEstimate);
      }
      const gasPrice = {
        amount:  default_gas_price.toFixed(9),
        // denom: this.bondDenom
        denom: 'ulamb'
      }

      const feeProperties = {
        gasEstimate: gasEstimate,
        gasPrice: gasPrice,
        submitType:SIGN_METHODS.LOCAL,
        password: password
      }
      
      
      
      ////
      const signerFn = this.getSigner({}, SIGN_METHODS.LOCAL, {
        address: this.defaultwallet.address,
        password
      })
      if(this.actionManager!=undefined){
        this.actionManager.setContext({url:DAEMON_CONFIG.LambdaNetwork(),userAddress:this.defaultwallet.address})
      }
      ///
        var txHash ;
        this.actionManager.setMessage(type, transactionProperties)
        const { included, hash } = await this.actionManager.send(
          memo,
          feeProperties,
          signerFn
        )
        var result = await included();
        log.info('transactiondata')
        log.info(transactiondata)
        log.info('TransferConfirmresult')
        log.info(result)
        log.info('walletManger transferConfirm end')
        
        
   
      return result;

   
}

walletManger.prototype.getSigner=  function (config, submitType = "", { address, password }){
    console.log('getSigner')
    
    
    var  privatekey=cosmos.keyStore.checkJson(this.defaultwallet, password)
    var  publicKey = cosmos.publicKey.getBytes(this.defaultwallet.publicKey) ;
    log.info('校验密码ok')
    return signMessage => {
    log.info('数据签名')
    log.info(signMessage)
      const signature = cosmos.crypto.sign(
        Buffer.from(signMessage) ,
        privatekey
      )
      return {
        signature,
        publicKey: publicKey
      }
    }
}

walletManger.prototype.SignData = async function (password,content){

    
    var contentBuffer=Buffer.from(content)
    
    var  privatekey=cosmos.keyStore.checkJson(this.defaultwallet, password)
    
    var sindata  = cosmos.crypto.sign(
        contentBuffer ,
        privatekey
      )

    

    var TxMessageload={
        key: this.defaultwallet.publicKey ,
        content: content ,
        signature:sindata.toString('hex')
    }
    return TxMessageload;

}

walletManger.prototype.editDefaultName=async function  (name){
   this.defaultwallet.name=name;
   var filepath = this.findFile(this.defaultwallet.address);
   if(filepath==null){
    throw new Error('not find DefaultWallet')
   }
   var result = fs.writeFileSync(filepath, JSON.stringify(this.defaultwallet))
   this.scann();


}
walletManger.prototype.findFile = function (address) {
    this.walletList = [];
    var dir = DAEMON_CONFIG.WalletFile;
    var list = fs.readdirSync(dir);
    var fileName=null;
    list.forEach((file) => {
        if(file.indexOf('.keyinfo')>0){
            file = path.join(dir, file);
            var v3file = fs.readFileSync(file, 'utf8');
            try {
                v3file = JSON.parse(v3file);
                if (v3file.address == address) {
                    fileName=file;
                  
                }
            } catch (err) {

                

            }
         
        }
        
    })
    return fileName;
}




export default walletManger
