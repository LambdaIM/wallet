


import transaction from './utils/transactionTypes';
import ActionManager from './utils/ActionManager.js';

import BigNum from './utils/BigNum';
import LambdaApi from './lambdaApi';
import Nedb from './utils/nedb';
// import fetch from './utils/fetch';

var fs = require('graceful-fs');
var log = require('../log').log;
var { DAEMON_CONFIG } = require('../configmain.js');


const settings = require('electron-settings');
const path = require('path');
const hdkeyjs = require('@jswebfans/hdkeyjs');
const { shell } = require('electron');

const bip39 = require('bip39');

const { throwErrorCode, errorList } = require('./throwErrorCode.js');


var walletManger = function (dir) {
  // 遍历文件夹
  //
  this.walletList = [];
  this.defaultwallet = null;
  // 默认的钱包 应该存储在 配置文件里面

  this.lastpayobj = null;
  this.lastpayArry = null;

  this.CosmosAPI = LambdaApi();
  this.actionManager = new ActionManager();

  this.scann();
  this.setDefaultWallet();

  this.filepath_create = null;
  this.walletjson__create = null;

  this.gasEstimate = null;
  this.Nedbjs = new Nedb();
};
walletManger.prototype.readconfig = function () {
  // console.log('defaultwallet', settings.get('defaultwallet'));

  if (settings.has('defaultwallet') != undefined) {
    return settings.get('defaultwallet');
  }
};
walletManger.prototype.writeSyncJson = function(path, data) {
  console.log('writeSyncJson');


  return fs.writeFileSync(path, JSON.stringify(data, null, 2), { mode: '0600', encoding: 'utf8' });
};

walletManger.prototype.setconfig = function (address) {
  settings.set('defaultwallet', address);
};

walletManger.prototype.scann = function () {
  this.walletList = [];
  var dir = DAEMON_CONFIG.WalletFile;
  var list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file.indexOf('.keyinfo') > 0) {
      file = path.join(dir, file);
      var v3file = fs.readFileSync(file, 'utf8');
      try {
        v3file = JSON.parse(v3file);
        if (v3file.address != undefined) {
          this.walletList.push(v3file);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
};

walletManger.prototype.getDefaultwalletBasicinfo = function () {
  if (this.defaultwallet == null) {
    throwErrorCode(errorList.not_find_DefaultWallet);
    // throw new Error('not find DefaultWallet');
  }
  return {
    address: this.defaultwallet.address,
    name: this.defaultwallet.name
  };
};

walletManger.prototype.OpenDefaultwallet = function (password) {
  var info;
  log.info('OpenDefaultwallet');
  log.info(this.defaultwallet.address);
  if (this.defaultwallet == null) {
    throwErrorCode(errorList.not_find_DefaultWallet);
  }

  var privatekey = hdkeyjs.keyStore.checkJson(this.defaultwallet, password);

  info = {
    publicKey: this.defaultwallet.publicKey,
    address: this.defaultwallet.address,
    name: this.defaultwallet.name,
    privatekey: privatekey
  };

  return info;
};

walletManger.prototype.setDefaultWallet = function (address) {
  log.info('setDefaultWallet');
  var addressdefault = this.readconfig();
  // addressdefault=addressdefault.toUpperCase();
  log.info('setDefaultWallet', addressdefault, address);
  var target;


  if (address != undefined) {
    this.setconfig(address);
    target = address;
  } else if (addressdefault != undefined) {
    this.setconfig(addressdefault);
    target = addressdefault;
  } else {
    if (this.walletList.length == 0) {
      this.defaultwallet = null;
      return;
    }
    target = this.walletList[0].address;
    this.setconfig(target);
  }


  var objwallet;

  this.walletList.forEach(function (obj) {
    if (target == obj.address) {
      objwallet = obj;
    }
  });
  if (objwallet == undefined) {
    this.defaultwallet = null;
  } else {
    this.defaultwallet = objwallet;
  }
};

walletManger.prototype.getWalletList = function () {
  this.scann();
  var result = [];

  this.walletList.forEach(function (item) {
    result.push({
      name: item.name,
      address: item.address
    });
  });

  return result;
};



walletManger.prototype.creatWallet = function (password, name) {
  this.filepath_create = null;
  this.walletjson__create = null;

  var mnemonic = hdkeyjs.crypto.generateRandomMnemonic(256);
  var result = this.generateWallet(mnemonic, password, name, true);
  return result;
};
walletManger.prototype.creatWalletComplete = function (password, name) {
  if (this.filepath_create == null || this.walletjson__create == null) {
    throwErrorCode(errorList.can_not_find_mnemonic);
    // throw new Error('can not find  mnemonic');
  }
  // fs.writeFileSync(this.filepath_create, JSON.stringify(this.walletjson__create));
  this.writeSyncJson(this.filepath_create, this.walletjson__create);
  this.scann();
  return true;
};


walletManger.prototype.generateWallet = function (mnemonic, password, name, iscreat) {
  const keys = hdkeyjs.crypto.getKeysFromMnemonic(mnemonic);
  // var seed = tenderKeys.generateSeed(mnemonic);
  // var keyPair = tenderKeys.generateKeyPair(seed);

  // var address = tenderKeys.getAddressFromPubKey(keyPair.publicKey.toString('hex'));
  const address = hdkeyjs.address.getAddress(keys.publicKey);
  var file = this.findFile(address);
  if (file != null) {
    throwErrorCode(errorList.Import_failed_address_already_exists, address);
    // throw new Error(`Import failed,${address} already exists`);
  }


  var walletjson = hdkeyjs.keyStore.toJson(keys, password, name);



  var filepath = path.join(DAEMON_CONFIG.WalletFile, address + '.keyinfo');


  if (iscreat) {
    this.filepath_create = filepath;
    this.walletjson__create = walletjson;
  } else {
    // fs.writeFileSync(filepath, JSON.stringify(walletjson));
    this.writeSyncJson(filepath, walletjson);
    this.scann();
  }


  return {
    mnemonic: mnemonic,
    address: address,
    name: name
  };
};

walletManger.prototype.generateSonAccount = function (mnemonic, password, name, index) {
  // 校验密码
  var privatekey = hdkeyjs.keyStore.checkJson(this.defaultwallet, password);
  //
  // 子账户
  console.log('-----1');
  const keys = hdkeyjs.crypto.getKeysFromMnemonicbyindex(mnemonic, index);
  console.log('-----2');
  const address = hdkeyjs.address.getAddress(keys.publicKey);
  // 父账户
  const keysF = hdkeyjs.crypto.getKeysFromMnemonicbyindex(mnemonic, 0);
  const addressF = hdkeyjs.address.getAddress(keysF.publicKey);
  if (this.defaultwallet.address != addressF) {
    throwErrorCode(errorList.main_account_not_current_account);
    // throw new Error(`The main account corresponding to mnemonic times is inconsistent with the current account `);
  }



  var file = this.findSonFile(address);
  if (file.fileName != null) {
    throwErrorCode(errorList.failed_already_exists, address);
    // throw new Error(`failed,${address} already exists`);
  }

  var walletjson = hdkeyjs.keyStore.toJson(keys, password, name);
  var filepath = path.join(DAEMON_CONFIG.SonAccountFile, this.defaultwallet.address, address + '.keyinfo');
  // fs.writeFileSync(filepath, JSON.stringify(walletjson));
  this.writeSyncJson(filepath, walletjson);

  this.scann();

  return {
    address: address,
    name: name
  };
};

walletManger.prototype.deleteWallet = function (address) {
  var dir = DAEMON_CONFIG.WalletFile;
  var list = fs.readdirSync(dir);

  list.forEach(file => {
    var filepath = path.join(dir, file);
    try {
      if (file.indexOf(address) > 0) {
        fs.unlinkSync(filepath);
        this.scann();
      }
    } catch (err) {
      console.log(err);
    }
  });
};

walletManger.prototype.ImportWalletByMnemonic = function (mnemonic, password, name) {
  /* eslint-disable */
  var mnemonicList = mnemonic.match(/[a-z]+[\-\']?[a-z]*/ig);

  if (mnemonicList == null || mnemonicList.length < 12) {
    
    throwErrorCode(errorList.more12_words)
    // throw new Error('make sure  inputting 12 words or more ');
  }
  checkBip39wordList(mnemonicList);

  var mnemonics = mnemonicList.join(' ');

  return this.generateWallet(mnemonics, password, name,false);
};

function checkBip39wordList(mnemonicList){
  //bip39
  var wordlist = bip39.wordlists.english;
  mnemonicList.forEach((item)=>{
    console.log(wordlist)
    if(wordlist.indexOf(item)<0){
      throwErrorCode(errorList.invalid_mnemonic,item)
      // throw new Error(`${item}  is an invalid mnemonic, please check`)
    } 

  })
    
}




walletManger.prototype.CreatSonAccountByMnemonic = function (mnemonic, password, name,index) {
  /* eslint-disable */
  var mnemonicList = mnemonic.match(/[a-z]+[\-\']?[a-z]*/ig);

  if (mnemonicList == null || mnemonicList.length < 12) {
    throwErrorCode(errorList.more12_words)
    // throw new Error('make sure  inputting 12 words or more ');
  }
  checkBip39wordList(mnemonicList);
  var mnemonics = mnemonicList.join(' ');
  return this.generateSonAccount(mnemonics, password, name,index);
};

walletManger.prototype.exportSonAccount = function (address,password) {
  console.log('exportSonAccount',address,password)
  
  var file = this.findSonFile(address);
  if (file.fileName == null) {
    throwErrorCode(errorList.failed_address_not_exists,address)
    
    // throw new Error(`failed,${address} not exists`);
  }
  console.log(file)
  var privatekey = hdkeyjs.keyStore.checkJson(file.data, password);
  var publicKey = hdkeyjs.publicKey.getBytes(file.data.publicKey)

  var exportJson = {
    "privateKey":privatekey.toString('hex') ,
    "publicKey":publicKey.toString('hex') ,
    "address": address,
    "masterAddress":this.defaultwallet.address
  }
  

  console.log(exportJson)
  var targetpath = path.join(DAEMON_CONFIG.ExportSonAccountFile, address + '.json');
  // fs.writeFileSync(targetpath, JSON.stringify(exportJson), 'utf8');
  this.writeSyncJson(targetpath,exportJson)
  shell.showItemInFolder(DAEMON_CONFIG.ExportSonAccountFile);
  return ;

};

walletManger.prototype.ImportSonAccount = function (filepath,password,name) {
  
  var file = fs.readFileSync(filepath, 'utf8');
  try {
    file = JSON.parse(file);  
  } catch (error) {
    throwErrorCode(errorList.file_format_error) 
  }
  
  var privatekey = hdkeyjs.keyStore.checkJson(this.defaultwallet, password);

  if (privatekey == undefined) {
    throwErrorCode(errorList.Import_failed_check_password)
    // throw new Error('Import failed,Please check the wallet file and password');
  }
  console.log('file',file)
  var keyinfo ={
    "privateKey": Buffer.from(file.privateKey,'hex'),
    "publicKey": Buffer.from(file.publicKey,'hex'),
    "address": file.address
  }
  var v3file = hdkeyjs.keyStore.toJson(keyinfo,password,name)
  v3file.address=file.address;

  


  var file = this.findSonFile(v3file.address);
  if (file.fileName != null) {
    throwErrorCode(errorList.Import_failed_address_exists,v3file.address)
    // throw new Error('Import failed,'+v3file.address+' already exists');
  }


  var targetpath = path.join(DAEMON_CONFIG.SonAccountFile,this.defaultwallet.address, v3file.address + '.keyinfo');
  // fs.writeFileSync(targetpath, JSON.stringify(v3file), 'utf8');
  this.writeSyncJson(targetpath,v3file)
  
  return true;

  

};



//exportSonAccount



walletManger.prototype.ImportWalletBykeyStore = function (filepath, password, name) {
  // 需要检查 
  //1 是可以成功读取配置文件 例如从u盘中读取，加 try catch
  //2 检查文件的是不是json
  //3 文件是json的情况下
  // 4 需要校验每一个字段
  var v3file;
  try {
    v3file = fs.readFileSync(filepath, 'utf8'); 
  } catch (error) {
    //打开文件失败
    throwErrorCode(errorList.file_open_error)
  }
   
  console.log('ImportWalletBykeyStore',v3file)
  try {
    v3file = JSON.parse(v3file);  
  } catch (error) {
    throwErrorCode(errorList.file_format_error)
    
  }
  if(typeof v3file.salt!= "string"||
  typeof v3file.privateKey!="string"||
  typeof v3file.address!="string"||
  typeof v3file.publicKey!="string"
  ){
    throwErrorCode(errorList.file_format_error)
  }

  

  v3file.name = name;
  var privatekey = hdkeyjs.keyStore.checkJson(v3file, password);


  if (privatekey == undefined) {
    throwErrorCode(errorList.Import_failed_check_password)
  }


  var file = this.findFile(v3file.address);
  if (file != null) {
    throwErrorCode(errorList.Import_failed_address_exists,v3file.address)
    // throw new Error('Import failed,'+v3file.address+' already exists');
  }


  var targetpath = path.join(DAEMON_CONFIG.WalletFile, v3file.address + '.keyinfo');
  // fs.writeFileSync(targetpath, JSON.stringify(v3file), 'utf8');
  this.writeSyncJson(targetpath,v3file)
  this.scann();
  return true;
};


walletManger.prototype.getDefaultWalletBlance = async function () {
  

  if (this.defaultwallet == null) {
    throwErrorCode(errorList.not_find_DefaultWallet)
    // throw new Error('not find DefaultWallet');
  }


  var result = await this.CosmosAPI().get.account(this.defaultwallet.address);
  

  var balanceLamb = 0;
  var balanceSto = 0;
  if (result.coins instanceof Array) {
    result.coins.forEach(item => {
      if (item.denom == 'ulamb') {
        balanceLamb = item.amount;
      }
      if (item.denom == 'utbb') {
        balanceSto = item.amount;
      }
    });
  }


  var acountjson = {
    address: result.address,
    balance: balanceLamb,
    balanceSto: balanceSto,
    coins: result.coins,
    sequence: result.sequence

    // nonce: parseInt(Message.nonce, 10)
  };

  return acountjson;
};

walletManger.prototype.getDelegationsBalance = async function () {
  console.log('getDelegationsBalance');

  var address = this.defaultwallet.address;
  var delegationsList = await this.CosmosAPI().get.delegations(address);
  var partnerDelegations = await this.CosmosAPI().get.partnerDelegations(address);
  var result = 0;

  if (delegationsList instanceof Array) {
    delegationsList.forEach(item => {
      // result+=(item.shares-0);
      console.log('item.shares', item);
      result = BigNum(item.shares).plus(result);
    });
  }
  if (partnerDelegations instanceof Array) {
    partnerDelegations.forEach(item => {
      // result+=(item.shares-0);
      result = BigNum(item.shares).plus(result);
    });
  }
  return result.toString();
};

walletManger.prototype.getDistributionRewards = async function () {
  var address = this.defaultwallet.address;
  var result = await this.CosmosAPI().get.delegatorRewards(address);

  return result;
};
walletManger.prototype.DistributionInformation = async function () {
  var operator_address = this.defaultwallet.address;
  var lambdaDevelopAdresss = hdkeyjs.address.validatorAddress(operator_address);
  var result = await this.CosmosAPI().get.validatorDistributionInformation(lambdaDevelopAdresss);
  return result;
};

walletManger.prototype.getMinerRewards = async function () {
  var address = this.defaultwallet.address;
  var result = await this.CosmosAPI().get.MinerRewards(address);

  return result;
};



walletManger.prototype.TransferDelegation = async function (to, amount, gas, isdege, validatorType) {
  if (isdege) {
    // 质押
    return {
      type: transaction.DELEGATE,
      validatorAddress: to,
      amount: amount,
      denom: 'utbb',
      validatortype: validatorType
    };
  } else {
    // 取消质押
    return {
      type: transaction.UNDELEGATE,
      validatorAddress: to,
      amount: amount,
      denom: 'utbb',
      validatortype: validatorType
    };
  }
};
walletManger.prototype.TransferWithdrawal = async function (to, amount, gas, isdege) {
  return {
    type: transaction.WITHDRAW,
    amount: amount,
    denom: 'ulamb'
  };
};


walletManger.prototype.TransferDelegateMarket = async function (to, amount) {
  return {
    type: transaction.DelegateMarket,
    marketName:to,
    amount: amount,
    denom: 'ulamb'
  };
};



walletManger.prototype.TransferWithDrawMarket = async function (to, amount) {
  return {
    type: transaction.WithDrawMarket,
    marketName:to
  };
};




walletManger.prototype.TransferMinerWithDrawCount = async function (page,limit) {
  return {
    type: transaction.MinerWithDrawCount,
    page: page,
    limit: limit
  };
};

walletManger.prototype.TransferMinerwithdrawal = async function (to, amount, gas, isdege) {
  return {
    type: transaction.WithdrawMinerRewards,
    minerAddress:hdkeyjs.address.MinerAddress(this.defaultwallet.address)
  };
};

walletManger.prototype.TransferRedelegate = async function (validatorSourceAddress,validatorDestinationAddress ,amount,validatortype) {
  return {
    type: transaction.REDELEGATE,
    validatorSourceAddress,
    validatorDestinationAddress,
    amount: amount,
    validatortype:validatortype,
    denom: 'utbb'
  };
};

walletManger.prototype.TransferDeposit = async function (ProposalID, amount) {
  return {
    type: transaction.DEPOSIT,
    proposalId:ProposalID,
    amounts:[{amount: amount,denom: 'ulamb'}]
  };
};

walletManger.prototype.TransferVote = async function (ProposalID, option) {
  return {
    type: transaction.VOTE,
    proposalId:ProposalID,
    option:option
  };
};
walletManger.prototype.TransferCreateSellOrder = async function (marketName,
  price,
  rate,
  sellSize,
  description,
  cancelTimeDuration,
  minBuySize,
  minBuyDuration,
  maxBuyDuration) {
  return {
    type: transaction.CreateSellOrder,
    marketName,
    price,
    rate,
    sellSize,
    memo:description||'',
    cancelTimeDuration,
    minBuySize,
    minBuyDuration,
    maxBuyDuration
  };
};
//memo: memo || ''
//CreateBuyOrder
walletManger.prototype.TransferCreateBuyOrder = async function (duration,
  size,
  sellOrderId,
  marketName) {
  return {
    type: transaction.CreateBuyOrder,
    duration,
    size,
    sellOrderId,
    marketName
  };
};

walletManger.prototype.TransferVote = async function (ProposalID, option) {
  return {
    type: transaction.VOTE,
    proposalId:ProposalID,
    option:option
  };
};

walletManger.prototype.TransferCreateMiner = async function (miningAddress, dhtId, pubKey) {
  return {
    type: transaction.CreateMiner,
    miningAddress, 
    dhtId, 
    pubKey
  };
};

walletManger.prototype.TransferCreateMachine = async function (name,peerId,dhtId,pubKey) {
  
  return {
    type: transaction.CreateMachine,
    name,
    peerId,
    dhtId,
    pubKey
  };
};



walletManger.prototype.TransferwithdrawalDistribution=async function (to, amount, gas, isdege) {
  console.log('TransferwithdrawalDistribution')
  var operator_address = this.defaultwallet.address;
  var lambdaDevelopAdresss = hdkeyjs.address.validatorAddress(operator_address);
  console.log(transaction.WithdrawValidatorCommission)
  return {
    type: transaction.WithdrawValidatorCommission,
    amount: amount,
    denom: 'ulamb',
    validatorAddress:lambdaDevelopAdresss
  };
};
walletManger.prototype.AssetPledge = async function (amount, asset, gas, isdege, denom) {
  if (isdege) {
    return {
      type: transaction.AssetPledge,
      amounts: {
        amount: amount,
        denom: denom
      },
      asset: {
        amount: asset,
        denom: 'utbb'
      }

    };
  } else {
    return {
      type: transaction.AssetDrop,
      amounts: {
        amount: amount,
        denom: denom
      },
      asset: {
        amount: asset,
        denom: 'utbb'
      }

    };
  }
};



walletManger.prototype.Transfer = async function (to, amount, gas, denom, memo) {
  var result = {
    type: transaction.SEND,
    toAddress: to,
    amounts: [
      {
        amount: amount,
        denom: denom || 'ulamb'
      }
    ],
    memo: memo || ''
  };
  return result;
};


walletManger.prototype.OrderRenewal = async function (orderId,duration,memo) {
  var result = {
    type: transaction.OrderRenewal,
    orderId: orderId,
    duration:duration,
    memo: memo || ''
  };
  return result;
};




walletManger.prototype.Simulate = async function (transactiondata) {
  var gasprice = settings.get('gasprice') ;
  if(gasprice==undefined){
    gasprice=0.025;
  }
  var default_gas_price = gasprice; // recommended from Cosmos Docs
  const { type, memo, ...properties } = transactiondata;
  console.log('default_gas_price',default_gas_price)
  if (this.actionManager != undefined) {
    this.actionManager.setContext({ url: DAEMON_CONFIG.LambdaNetwork(), userAddress: this.defaultwallet.address });
  }
  console.log('***********')
  console.log(type)
  console.log('***********')
  console.log(properties)
  console.log('***********')
  this.actionManager.setMessage(type, properties);
  
  var gasEstimate = await this.actionManager.simulate(memo || '');
  
  this.gasEstimate = gasEstimate;
  //  return gasEstimate;
  return (Number(default_gas_price) * Number(gasEstimate)/1e6).toFixed(6); // already in lamb
};

walletManger.prototype.TransferConfirm = async function (password, transactiondata, gaseFee) {
  log.info('walletManger transferConfirm start');
  const SIGN_METHODS = {
    LOCAL: `local`,
    LEDGER: `ledger`,
    EXTENSION: `extension`
  };


  //= ========
  const { type, memo, ...transactionProperties } = transactiondata;
  var gasprice = settings.get('gasprice') ;
  if(gasprice==undefined){
    gasprice=0.025;
  }

  var gasEstimate = this.gasEstimate || 500000; // 需要接口读取
  var default_gas_price = gasprice; // recommended from Cosmos Docs
  if (gaseFee == undefined) {
    default_gas_price = gasprice; // recommended from Cosmos Docs
  } else {
    default_gas_price = Number(gaseFee) / Number(gasEstimate);
  }
  const gasPrice = {
    amount: default_gas_price.toFixed(9),
    // denom: this.bondDenom
    denom: 'ulamb'
  };

  const feeProperties = {
    gasEstimate: gasEstimate,
    gasPrice: gasPrice,
    submitType: SIGN_METHODS.LOCAL
  };



  const signerFn = this.getSigner({}, SIGN_METHODS.LOCAL, {
    address: this.defaultwallet.address,
    password
  });
  if (this.actionManager != undefined) {
    this.actionManager.setContext({ url: DAEMON_CONFIG.LambdaNetwork(), userAddress: this.defaultwallet.address });
  }


  this.actionManager.setMessage(type, transactionProperties);
  // const { included, hash }
  // 如果出现网络相关的问题  有可能会产生异常，最好是醉解返回hash
  /*
  var txhashNative = await this.actionManager.getTxhash(
    memo,
    feeProperties,
    signerFn
  )
  
  log.info('txhashNative');
  log.info(txhashNative);
  */
  
  

  
  const { included, hash } = await this.actionManager.send(
    memo,
    feeProperties,
    signerFn
  );
  this.includedTx=included;
  
  
  
  log.info('User input transactiondata');
  log.info(transactiondata);
  log.info('TransferConfirmresult');
  log.info(hash);
  log.info('walletManger transferConfirm end');
  var isok = await this.Nedbjs.insertTx(hash,transactiondata, gaseFee)
  // isok = await this.Nedbjs.updateTxState(hash,0)

  console.log(isok)


  return {
    txhash:hash,
    haveHash:true
  };
};
walletManger.prototype.includedForTx = async function () {
  console.log('includedForTx')
   var  result = await this.includedTx()
   var isok = await this.Nedbjs.updateTxState(result.txhash,1)
   console.log('isok',isok,result.txhash)
   console.log('-------')
   console.log(result)
   console.log('-------')
   return result;

}

walletManger.prototype.getSigner = function (config, submitType = '', { address, password }) {
  console.log('getSigner');


  var privatekey = hdkeyjs.keyStore.checkJson(this.defaultwallet, password);
  var publicKey = hdkeyjs.publicKey.getBytes(this.defaultwallet.publicKey);
  log.info('Verify password OK');
  return signMessage => {
    log.info('Data signature');
    log.info(signMessage);
    const signature = hdkeyjs.crypto.sign(
      Buffer.from(signMessage),
      privatekey
    );
    return {
      signature,
      publicKey: publicKey
    };
  };
};

walletManger.prototype.SignData = async function (password, content) {
  var contentBuffer = Buffer.from(content);

  var privatekey = hdkeyjs.keyStore.checkJson(this.defaultwallet, password);

  var sindata = hdkeyjs.crypto.sign(
    contentBuffer,
    privatekey
  );



  var TxMessageload = {
    key: this.defaultwallet.publicKey,
    content: content,
    signature: sindata.toString('hex')
  };
  return TxMessageload;
};

walletManger.prototype.editDefaultName = async function (name) {
  this.defaultwallet.name = name;
  var filepath = this.findFile(this.defaultwallet.address);
  if (filepath == null) {
    throwErrorCode(errorList.not_find_DefaultWallet)
    // throw new Error('not find DefaultWallet');
  }
  // fs.writeFileSync(filepath, JSON.stringify(this.defaultwallet));
  this.writeSyncJson(filepath,this.defaultwallet)
  this.scann();
};
walletManger.prototype.findFile = function (address) {
  this.walletList = [];
  var dir = DAEMON_CONFIG.WalletFile;
  var list = fs.readdirSync(dir);
  var fileName = null;
  list.forEach(file => {
    if (file.indexOf('.keyinfo') > 0) {
      file = path.join(dir, file);
      var v3file = fs.readFileSync(file, 'utf8');
      try {
        v3file = JSON.parse(v3file);
        if (v3file.address == address) {
          fileName = file;
        }
      } catch (err) {



      }
    }
  });
  return fileName;
};

walletManger.prototype.findSonFile = function (address) {
  this.walletList = [];
  var dir = path.join(DAEMON_CONFIG.SonAccountFile,this.defaultwallet.address) ;
  if(fs.existsSync(dir)==false) {
    fs.mkdirSync(dir);
  }
  var list = fs.readdirSync(dir);
  var fileName = null,data={};
  list.forEach(file => {
    if (file.indexOf('.keyinfo') > 0) {
      file = path.join(dir, file);
      var v3file = fs.readFileSync(file, 'utf8');
      try {
        v3file = JSON.parse(v3file);
        if (v3file.address == address) {
          fileName = file;
          data=v3file;
        }
      } catch (err) {



      }
    }
  });
  return {fileName,data};
};

walletManger.prototype.SonFileList =async function () {
  this.walletList = [];
  var dir = path.join(DAEMON_CONFIG.SonAccountFile,this.defaultwallet.address) ;
  if(fs.existsSync(dir)==false) {
    fs.mkdirSync(dir);
  }
  var list = fs.readdirSync(dir);
  var result=[]
  list.forEach(file => {
    if (file.indexOf('.keyinfo') > 0) {
      file = path.join(dir, file);
      var v3file = fs.readFileSync(file, 'utf8');
      try {
        v3file = JSON.parse(v3file);
        result.push(v3file);
        
      } catch (err) {



      }
    }
  });
  
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    try {
      result[index].account = await this.CosmosAPI().get.account(element.address);    
    } catch (error) {
      console.log(error)
    }
    
  }
  
  return result;
  
};


walletManger.prototype.deleteaccount =async function (address,password) {
  console.log('deleteaccount');
  var dir = DAEMON_CONFIG.WalletFile;
  var list = fs.readdirSync(dir);
  var accountfile,accountv3file;
  list.forEach(file => {
    if (file.indexOf('.keyinfo') > 0) {
      file = path.join(dir, file);
      var v3file = fs.readFileSync(file, 'utf8');
      try {
        v3file = JSON.parse(v3file);
        if (v3file.address == address) {
          accountv3file = v3file;
          accountfile=file;
        }
      } catch (err) {
        console.log(err);
      }
    }
  });

  if(accountfile!=undefined&&accountv3file!=undefined){
    hdkeyjs.keyStore.checkJson(accountv3file, password);
    fs.unlinkSync(accountfile)
    this.scann();

  }

  



  var result={}

  return result;
  
};





export default walletManger;
