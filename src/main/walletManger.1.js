

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

var protofilepath = path.join(__static, '/awesome.proto');
import Amino from 'irisnet-crypto/chains/iris/amino.js';
var crypto = require("crypto");
var BigInteger = require('bigi');
import bigInter from './bigInter';
import defaultAddress from './defaultAddress';

function generatesha256(data) {

    let hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();

}


var walletManger = function (dir) {
    //遍历文件夹
    //

    this.walletList = [];
    this.defaultwallet = null;
    //默认的钱包 应该存储在 配置文件里面

    this.lastpayobj = null;
    this.lastpayArry = null;

    this.scann();
    this.setDefaultWallet();

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


    wallet = ETHwallet.fromV3(this.defaultwallet, password);
    info = {
        publicKey: wallet.pubKey,
        address: wallet.getAddress(),
        name: this.defaultwallet.name,
        privateKey: wallet._privKey,
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
    log.info(target);
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
    var tenderKeys = new TenderKeys();

    var mnemonic = tenderKeys.generateRandomMnemonic();
    return this.generateWallet(mnemonic, password, name)


}
walletManger.prototype.generateWallet = function (mnemonic, password, name) {
    var tenderKeys = new TenderKeys();


    var seed = tenderKeys.generateSeed(mnemonic);
    var keyPair = tenderKeys.generateKeyPair(seed);

    var address = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));



    var wallet = new ETHwallet(keyPair.privateKey);
    var walletjson = wallet.toV3(password)
    walletjson.name = name;

    var filepath = path.join(DAEMON_CONFIG.WalletFile, wallet.getV3Filename() + '.keyinfo');

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
    return this.generateWallet(mnemonic, password, name)
}


walletManger.prototype.ImportWalletBykeyStore = function (filepath, password, name) {

    var wallet;

    var v3file = fs.readFileSync(filepath, 'utf8');
    v3file = JSON.parse(v3file);
    v3file.name = name;

    wallet = ETHwallet.fromV3(v3file, password);
    var targetpath = path.join(DAEMON_CONFIG.WalletFile, wallet.getV3Filename() + '.keyinfo');
    fs.writeFileSync(targetpath, JSON.stringify(v3file), 'utf8')

    return true;
}


walletManger.prototype.getDefaultWalletBlance = async function () {
    log.info('getDefaultWalletBlance')
    log.info(this.defaultwallet)
    log.info('getDefaultWalletBlance')
    if(this.defaultwallet==null){
       throw new Error('not find DefaultWallet')
    }

    var result = await this._getAccountInfo();

    // log.info(`result  ============>>>>>>>> ${result}`);
    if (result.data.result.response.value == undefined && result.data.result.response.log != undefined) {
        throw new Error(result.data.result.response.log)
    }
    var accountInfo = result.data.result.response.value;
    const protoRoot = await protobuf.load(protofilepath);

    var buf = Buffer.from(accountInfo, 'base64');
    var AccountMessage = protoRoot.lookupType('types.Account');
    var Message = AccountMessage.decode(buf);
    
    var userbalance = BigInteger.fromBuffer(Message.balance.abs)

    var acountjson = {
        address: Message.address.toString('hex'),
        balance: userbalance.toString(),
        nonce: parseInt(Message.nonce, 10)
    }

    return acountjson;



}

walletManger.prototype._getAccountInfo = function () {
    console.log('_getAccountInfo')

    var address = this.defaultwallet.address;
    var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork;
    var addressinfourl = nodeBaseUrl + 'abci_query?path=%22/accounts/' + address + '%22&data=&height=&prove='

    log.info(addressinfourl);

    return axios.get(addressinfourl)
}

walletManger.prototype.Transfer = async function (to, amount, gas) {

    

    
    // bigInter()
    const protoRoot = await protobuf.load(protofilepath);
    log.info(amount)
    var payload = {
        from: Buffer.from(defaultAddress(), 'hex'),
        to: Buffer.from(to, 'hex'),
        amount: bigInter(protoRoot,amount),
        gas: gas,
        createTime: +(new Date()).getTime().toString().substr(0, 10)
    };
    var TxDataMessage = protoRoot.lookupType('types.TxData');
    log.info('payload')
    log.info(payload)
    var errMsg = TxDataMessage.verify(payload);
    log.error(errMsg)
    if (errMsg)
        throw errMsg

    var TxData = TxDataMessage.create(payload);
    var TxDatabuffer = TxDataMessage.encode(TxData).finish();
    

    // //==
    var TxSendMessage = protoRoot.lookupType('types.TxSend');
    var sendload = {
        id: generatesha256(TxDatabuffer),
        txData: TxData
    }
    errMsg = TxSendMessage.verify(sendload);
    log.error(errMsg)
    if (errMsg)
        throw errMsg

    var TxSend = TxSendMessage.create(sendload);
    var TxSendbuffer = TxDataMessage.encode(TxSend).finish();
    log.info('TxSendbuffer')
    log.info(TxSend)
    log.info(TxSendbuffer.toString('hex'))
    return {
        dataType:'types.TxSend',
        hexdata:TxSendbuffer.toString('hex'),
        sendType: 'txSend'
      };

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

    // return {
    //   dataType:'types.TxPayload',
    //   hexdata:this.lastpayArry.toString('hex')
    // };
}

walletManger.prototype.TransferConfirm = async function (password,transactiondata) {
    log.info('transferConfirm')
    const protoRoot = await protobuf.load(protofilepath);

    var transactiondataMessage=protoRoot.lookupType(transactiondata.dataType);
    var transactionBufer=Buffer.from(transactiondata.hexdata,'hex');
    var sendType=transactiondata.sendType;
    log.info(transactiondata)

    var transactionObject = transactiondataMessage.decode(transactionBufer) ;
    console.log('transactionBufer',transactionBufer)
    console.log('transactionObject',transactionObject)

    //==
    
    var TxSendMessage = transactiondataMessage;


    var TxPayload = {
        payload: sendType
    }
    TxPayload[sendType]=transactionObject
    log.info('- -');
    log.info(TxPayload);

    var TxPayloadMessage = protoRoot.lookupType('types.TxPayload');
    var acountjson = await this.getDefaultWalletBlance();
    var nonce = acountjson.nonce;

    TxPayload.nonce = nonce + 1;
    errMsg = TxPayloadMessage.verify(TxPayload);
    log.error(errMsg)
    if (errMsg)
        throw errMsg
    var TxPay = TxPayloadMessage.create(TxPayload);
    log.info('Txpay========>'+JSON.stringify(TxPay))

    var  TxSendObject = TxPay;
    var  TxSendBufer= TxPayloadMessage.encode(TxPay).finish()

    //==
    
    var TxMessage = protoRoot.lookupType('types.Tx');
    var walletInfo = this.OpenDefaultwallet(password);
    var tenderKeys = new TenderKeys();
    console.log(this.lastpayArry)
    var sindata = tenderKeys.signBuffer(walletInfo.privateKey.toString('hex'), TxSendBufer);//   lastpayobj
    Amino.RegisterConcrete(null, 'tendermint/PubKeyEd25519')

    var TxMessageload = {
        key: Amino.MarshalBinary('tendermint/PubKeyEd25519', Buffer.from(walletInfo.publicKey, 'hex')),
        signature: sindata,
        payload: TxSendObject
    }

    var errMsg = TxMessage.verify(TxMessageload);
    log.error(errMsg)

    if (errMsg) {
        throw errMsg
    }
    var TxMessageData = TxMessage.create(TxMessageload);
    //https://github.com/irisnet/irisnet-crypto/search?q=pubKey&unscoped_q=pubKey
    var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork;
    var txinfourl = nodeBaseUrl + 'broadcast_tx_commit';
    log.info(' - -');
    log.info(JSON.stringify(TxMessageData) )
    var TxMessagebuffer = TxMessage.encode(TxMessageData).finish();
    var TxMessageHex ='0x'+ TxMessagebuffer.toString('hex');
    log.info('start')
    log.info(TxMessageHex)
    var result = await axios.get(txinfourl, {
        params: {
            tx: TxMessageHex
        }
    });
    log.info('end')
    return result;
}

//   // Encode a message to an Uint8Array (browser) or Buffer (node)
//   var buffer = AwesomeMessage.encode(message).finish();
//   // ... do something with buffer

//   // Decode an Uint8Array (browser) or Buffer (node) to a message
//   var message = AwesomeMessage.decode(buffer);
//   // ... do something with message

export default walletManger