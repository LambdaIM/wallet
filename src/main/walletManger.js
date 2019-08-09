

// var ETHwallet = require('./ETHv3wallet.js');
var fs = require('graceful-fs')
var log = require('../log').log;
var { DAEMON_CONFIG } = require('../configmain.js');
var TenderKeys = require('tendermintelectronkey')

import ETHwallet from './ETHv3wallet.js'
const settings = require("electron-settings");
const axios = require('axios');
var protobuf = require("protobufjs");
const path = require('path');


import Amino from 'irisnet-crypto/chains/iris/amino.js';
var crypto = require("crypto");
var BigInteger = require('bigi');
import bigInter from './bigInter';
import defaultAddress from './defaultAddress';
import generatesha256 from './generatesha256';

const cosmos = require('cosmos-lib');
import CosmosAPI from "@lunie/cosmos-api"
import transaction from "./utils/transactionTypes"
import ActionManager from "./utils/ActionManager.js"






var walletManger = function (dir) {
    //遍历文件夹
    //
    
  

    this.walletList = [];
    this.defaultwallet = null;
    //默认的钱包 应该存储在 配置文件里面

    this.lastpayobj = null;
    this.lastpayArry = null;
    var protofilepath = path.join(__static, '/awesome.proto');
    this.protofilepath=protofilepath;
    

    this.scann();
    this.setDefaultWallet();

    this.CosmosAPI= new CosmosAPI(DAEMON_CONFIG.LambdaNetwork(),'lambda-hub-test')
    this.actionManager=new ActionManager()
    this.actionManager.setContext({url:DAEMON_CONFIG.LambdaNetwork(),userAddress:this.defaultwallet.address})
    
    
    

}
walletManger.prototype.readconfig = function () {

    console.log('defaultwallet', settings.get('defaultwallet'));

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

    var  pravteKey=cosmos.keyStore.checkJson(this.defaultwallet, password)
    
    // wallet = ETHwallet.fromV3(this.defaultwallet, password);
    info = {
        publicKey: this.defaultwallet.publicKey,
        address: this.defaultwallet.address,
        name: this.defaultwallet.name,
        privateKey: pravteKey,
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
    // var tenderKeys = new TenderKeys();

    var mnemonic = cosmos.crypto.generateRandomMnemonic(256);

    log.info(mnemonic);
    
    return this.generateWallet(mnemonic, password, name)


}
walletManger.prototype.generateWallet = function (mnemonic, password, name) {
    var tenderKeys = new TenderKeys();

    const keys = cosmos.crypto.getKeysFromMnemonic(mnemonic);
    // var seed = tenderKeys.generateSeed(mnemonic);
    // var keyPair = tenderKeys.generateKeyPair(seed);

    // var address = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));
    const address = cosmos.address.getAddress(keys.publicKey);
    var file = this.findFile(address);
    if(file!=null){
        throw new Error('Import failed,address already exists') 
    }
    // keys.publicKey
    // keys.privateKey
    // var cospublicKey=cosmos.publicKey.getPublicKey(keys.publicKey);
    // var walletjson=cosmos.privateKey.ExportprivateKey(keys.privateKey,password)
    var walletjson = cosmos.keyStore.toJson(keys,password,name);

    // var wallet = new ETHwallet(keyPair.privateKey);
    // var walletjson = {

    // }
    // {
    //     salt:usersalt,
    //     pravteKey:PravteKey
    //   }
    // walletjson.name = name;
    // walletjson.address= address;
    // walletjson.salt=walletjson.salt.toString('base64');
    // walletjson.pravteKey=walletjson.pravteKey.toString('base64');

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
    var mnemonicStr = mnemonicList.join(" ");
    return this.generateWallet(mnemonicStr, password, name)
}


walletManger.prototype.ImportWalletBykeyStore = function (filepath, password, name) {

    var wallet;

    var v3file = fs.readFileSync(filepath, 'utf8');
    v3file = JSON.parse(v3file);
    v3file.name = name;
    var  pravteKey=cosmos.keyStore.checkJson(v3file, password)
    // wallet = ETHwallet.fromV3(v3file, password);

    if(pravteKey == undefined){
        throw new Error('Import failed,Please check the wallet file and password') 
    }

    
    var file = this.findFile(v3file.address);
    if(file!=null){
        throw new Error('Import failed,address already exists') 
    }

    
    var targetpath = path.join(DAEMON_CONFIG.WalletFile, wallet.getV3Filename() + '.keyinfo');
    fs.writeFileSync(targetpath, JSON.stringify(v3file), 'utf8')
    this.scann();
    return true;
}


walletManger.prototype.getDefaultWalletBlance = async function () {
    log.info('getDefaultWalletBlance')
    
    if(this.defaultwallet==null){
       throw new Error('not find DefaultWallet')
    }

    console.log('this.CosmosAPI.getAccountAPI')
    var result = await this.CosmosAPI.get.account(this.defaultwallet.address);
    //返回结果 1  { sequence: '0', accountNumber: '0' }
    // 返回结果2 

    const delegations = await this.CosmosAPI.get.delegations(this.defaultwallet.address)

    // console.log('this.CosmosAPI.getAccount')
    // console.log(result)
    // console.log(typeof result)
    // console.log(result.coins)
    // console.log('this.CosmosAPI.getAccount')
    console.log('delegations')
    console.log(delegations)
    console.log('delegations')
    // var result = await this._getAccountInfo();


    // // log.info(`result  ============>>>>>>>> ${result}`);
    // if (result.data.result.response.value == undefined && result.data.result.response.log != undefined) {
    //     throw new Error(result.data.result.response.log)
    // }
    // var accountInfo = result.data.result.response.value;
    // const protoRoot = await protobuf.load(this.protofilepath);

    // var buf = Buffer.from(accountInfo, 'base64');
    // var AccountMessage = protoRoot.lookupType('types.Account');
    // var Message = AccountMessage.decode(buf);
    
    // var userbalance = BigInteger.fromBuffer(Message.balance.abs)
    var balanceLamb = 0;
    log.info('----------');
    log.info(result);
    log.info(result.coins);
    log.info('----------');
    result.coins.forEach((item)=>{
        if(item.denom=='lamb'){
            balanceLamb=item.amount
        }
    })

    var acountjson = {
        address: result.address,
        balance: balanceLamb,
        coins:result.coins

        // nonce: parseInt(Message.nonce, 10)
    }

    return acountjson;



}

walletManger.prototype.getDelegationsBalance =async  function () {
    console.log('_getAccountInfo')

    var address = this.defaultwallet.address;
    var delegationsList  = await this.CosmosAPI.get.delegations(address);
    var result=0;
    console.log('delegationsList')
    console.log(delegationsList)
    if( delegationsList instanceof Array){
        delegationsList.forEach((item)=>{
            result+=item.shares;
        })

    } 
    return result;
}

walletManger.prototype.getDistributionRewards = async function (){
    var address = this.defaultwallet.address;
    var result =  await this.CosmosAPI.get.delegatorRewards(address);

    return result;

}
walletManger.prototype.TransferDelegation = async function (to, amount, gas,isdege) {
    
        if (isdege) {
            //质押
          return {
            type: transaction.DELEGATE,
            validatorAddress: to,
            amount: amount,
            denom: 'lamb'
          }
        } else {
            //取消质押
          return {
            type: transaction.UNDELEGATE,
            validatorAddress: to,
            amount: amount,
            denom: 'lamb'
          }
        }
}

walletManger.prototype.Transfer = async function (to, amount, gas) {

    return {
        type: transaction.SEND,
        toAddress: to,
        amounts: [
          {
            amount: amount,
            denom: 'lamb'
          }
        ],
        memo: ''
      }

    
    // bigInter()
    // const protoRoot = await protobuf.load(this.protofilepath);
    
    // var payload = {
    //     from: Buffer.from(defaultAddress(), 'hex'),
    //     to: Buffer.from(to, 'hex'),
    //     amount: bigInter(protoRoot,amount),
    //     gas: gas,
    //     createTime: +(new Date()).getTime().toString().substr(0, 10)
    // };

    
    
    // var TxDataMessage = protoRoot.lookupType('types.TxData');
    
    
    // var errMsg = TxDataMessage.verify(payload);
    // log.error(errMsg)
    // if (errMsg)
    //     throw errMsg

    // var TxData = TxDataMessage.create(payload);
    // var TxDatabuffer = TxDataMessage.encode(TxData).finish();
    // var TxSendMessage = protoRoot.lookupType('types.TxSend');

    // var sendload = {
    //     id: generatesha256(TxDatabuffer),
    //     txData: TxData
    // }

    // errMsg = TxSendMessage.verify(sendload);
    // log.error(errMsg)
    // if (errMsg)
    //     throw errMsg

    // var TxSend = TxSendMessage.create(sendload);
    // var TxSendbuffer = TxSendMessage.encode(TxSend).finish()
    // return {
    //     dataType:'types.TxSend', //proto 中类型
    //     hexdata:TxSendbuffer.toString('hex'),
    //     sendType: 'txSend', //payload 中的key
    //     Type:"txsend" //TxPayload 中的 type 属性
    //   };

    // var TxPayloadMessage = protoRoot.lookupType('types.TxPayload');

    // var TxPayload = {
    //     txSend: TxSend,
    //     payload: 'txSend'
    // }
    // TxPayload.nonce = nonce + 1;
    // errMsg = TxPayloadMessage.verify(TxPayload);
    // log.error(errMsg)
    // if (errMsg)
    //     throw errMsg
    // var TxPay = TxPayloadMessage.create(TxPayload);
    // log.info('Txpay========>'+JSON.stringify(TxPay))

    // this.lastpayobj = TxPay;
    // this.lastpayArry = TxPayloadMessage.encode(TxPay).finish()

    // return true;
}

walletManger.prototype.TransferConfirm = async function (password,transactiondata) {
    log.info('transferConfirm')
    const SIGN_METHODS = {
        LOCAL: `local`,
        LEDGER: `ledger`,
        EXTENSION: `extension`
      }
    var  default_gas_price=2.5e-8; // recommended from Cosmos Docs
   
    //=========
    const { type, memo, ...transactionProperties } = transactiondata

    const gasPrice = {
        amount: default_gas_price.toFixed(9),
        // denom: this.bondDenom
        denom: 'lamb'
      }
      this.gasEstimate =250000; //需要接口读取
      const feeProperties = {
        gasEstimate: this.gasEstimate,
        gasPrice: gasPrice,
        submitType:SIGN_METHODS.LOCAL,
        password: password
      }
      ////
      const signerFn = this.getSigner({}, SIGN_METHODS.LOCAL, {
        address: this.defaultwallet.address,
        password
      })
      ///
      var txHash ;
        this.actionManager.setMessage(type, transactionProperties)
        const { included, hash } = await this.actionManager.send(
          memo,
          feeProperties,
          signerFn
        )
        var result = await included();
        
        
   
      return result;

    // //============
    // //==
    // const protoRoot = await protobuf.load(this.protofilepath);

    // var transactiondataMessage=protoRoot.lookupType(transactiondata.dataType);
    // var transactionBufer=Buffer.from(transactiondata.hexdata,'hex');
    // var sendType=transactiondata.sendType;
    // var Type =transactiondata.Type;
    

    // var transactionObject = transactiondataMessage.decode(transactionBufer) ;
    // // console.log('transactionBufer',transactionBufer)
    // // console.log('transactionObject',transactionObject)
    

    // var TxPayloadMessage = protoRoot.lookupType('types.TxPayload');
    // var TxPayload = {
    //     payload: sendType,
    //     type:Type    //type 这压力测试版本的链新增的一个交易属性 这个版本钱包现在支付交易接口里面加上其他的还没有加
    // }
    // TxPayload[sendType]=transactionObject
      
    // var acountjson = await this.getDefaultWalletBlance();
    // TxPayload.nonce = acountjson.nonce + 1;
    
    
    // errMsg = TxPayloadMessage.verify(TxPayload);
    // log.error(errMsg)
    // if (errMsg)
    //     throw errMsg
    // var TxPay = TxPayloadMessage.create(TxPayload);
    // var TxPayBufer = TxPayloadMessage.encode(TxPay).finish()
    
    // // console.log(TxPay)
    // // console.log(TxPayBufer)
    // // console.log(TxPayBufer.toString('hex'))
    // // var bf1=Buffer.from('080f2a680a2006b623ff16c14964a99763462151e8e7f50e8a87ce05cc9039bc8e79673acd4112440a1458f5173838d50d5fab4a06489c84ebe85f73782210e9021a0c080112080de0b6b3a7640000220608011202040028dee891e5053801420b3139322e3136382e312e31','hex')
    // // var bf2=Buffer.from('080f2a6a0a2006b623ff16c14964a99763462151e8e7f50e8a87ce05cc9039bc8e79673acd4112460a1458f5173838d50d5fab4a06489c84ebe85f73782210e9021a0c080112080de0b6b3a7640000220608011202040028dee891e50530003801420b3139322e3136382e312e31','hex')
    // // var obj1= TxPayloadMessage.decode(bf1)
    // // var obj2=TxPayloadMessage.decode(bf2)
    // // log.info(obj1)
    // // log.info(obj2)
    
    // //==
    // var TxMessage = protoRoot.lookupType('types.Tx');
    // var walletInfo = this.OpenDefaultwallet(password);
    // var tenderKeys = new TenderKeys();
    // console.log('walletInfo.address')
    // console.log(walletInfo.address)
    // var sindata = tenderKeys.signBuffer(walletInfo.privateKey.toString('hex'), TxPayBufer);//   lastpayobj
    // Amino.RegisterConcrete(null, 'tendermint/PubKeyEd25519')

    // var TxMessageload = {
    //     key: Amino.MarshalBinary('tendermint/PubKeyEd25519', Buffer.from(walletInfo.publicKey, 'hex')),
    //     signature: sindata,
    //     payload: TxPay
    // }

    // var errMsg = TxMessage.verify(TxMessageload);
    // log.error(errMsg)

    // if (errMsg) {
    //     throw errMsg
    // }
    // var TxMessageData = TxMessage.create(TxMessageload);
    // //https://github.com/irisnet/irisnet-crypto/search?q=pubKey&unscoped_q=pubKey
    // var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork();
    // var txinfourl = nodeBaseUrl + 'broadcast_tx_commit';

    // var TxMessagebuffer = TxMessage.encode(TxMessageData).finish();
    // var TxMessageHex = '0x'+TxMessagebuffer.toString('hex');
    // log.info('start')
    
    
    // var result = await axios.get(txinfourl, {
    //     params: {
    //         tx: TxMessageHex
    //     }
    // });
    // log.info('end')
    
    // return result;
}

walletManger.prototype.getSigner=  function (config, submitType = "", { address, password }){
    console.log('getSigner')
    console.log(this.defaultwallet)
    
    var  pravteKey=cosmos.keyStore.checkJson(this.defaultwallet, password)
    var  publicKey = cosmos.publicKey.getBytes(this.defaultwallet.publicKey) ;
    console.log('校验密码ok')
    console.log(publicKey)
    return signMessage => {
        console.log('signMessage')
        console.log(typeof signMessage)
        console.log( signMessage)
        console.log('pravteKey')
        console.log(pravteKey)
        console.log('pravteKey')
      const signature = cosmos.crypto.sign(
        Buffer.from(signMessage) ,
        pravteKey
      )
      console.log('signMessage end')
      console.log(signature.toString('base64'))
      console.log('signMessage end')
      return {
        signature,
        publicKey: publicKey
      }
    }
}

walletManger.prototype.SignData = async function (password,content){

    var tenderKeys = new TenderKeys();
    var contentBuffer=Buffer.from(content)
    var walletInfo = this.OpenDefaultwallet(password);
    var sindata = tenderKeys.signBuffer(walletInfo.privateKey.toString('hex'),contentBuffer);//   lastpayobj

    

    var TxMessageload={
        key: walletInfo.publicKey ,
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
