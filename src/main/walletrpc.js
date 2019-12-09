import WalletManger from './walletManger.js';
import resultView from './result.js';

import Nedb from './utils/nedb';

import TransactionManager from './transactionManager.js';
// import isAddress from '../utils/isaddress.js';


const { ipcMain: eipc } = require('electron-better-ipc');

const { shell } = require('electron');

var { DAEMON_CONFIG } = require('../configmain.js');

var log = require('../log').log;


var lastTime;
export default function() {
  var WM = new WalletManger();
  var Nedbjs = new Nedb();
  eipc.answerRenderer('walletList', async query => {
    try {
      var result = WM.getWalletList();
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('setDefaultWallet', async query => {
    var address = query.address;
    if (address == undefined) {
      throw resultView(null, false, 'need address');
    }
    // if(isAddress(address)==false){
    // 暂时注释地址合法的判断
    if (address == false) {
      throw resultView(null, false, 'Incorrect address format');
    }
    try {
      WM.setDefaultWallet(address);
      return resultView(null, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('loginDefaultWallet', async query => {
    log.info('loginDefaultWallet');
    var password = query.password;
    if (password == undefined) {
      throw resultView(null, false, 'need password');
    }
    try {
      var info = WM.OpenDefaultwallet(password);
      return resultView({
        address: info.address,
        name: info.name
      }, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('defaultWalletBasicinfo', async query => {
    try {
      var info = WM.getDefaultwalletBasicinfo();
      return resultView(info, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  // log.info('start createWallet');

  eipc.answerRenderer('createWallet', query => {
    log.info('createWallet');
    log.info('createWallet rpc start');
    var now = new Date().getTime();
    log.info('createWallet rpc time', lastTime, now - lastTime);
    if (lastTime != undefined && now - lastTime < 1000 * 10) {
      log.info('createWallet rpc repeat');
      log.info('createWallet rpc repeat cancel');
      return resultView('repeattx', true);
    } else {
      log.info('transferConfirm rpc not repeat');
    }

    lastTime = new Date().getTime();

    var { password, name } = query;
    if (password == undefined) {
      throw resultView(null, false, 'need password');
    }
    if (name == undefined) {
      throw resultView(null, false, 'need name');
    }
    try {
      var info = WM.creatWallet(password, name);
      log.info('createWallet rpc end');
      return resultView(info, true);
    } catch (ex) {
      log.info('createWallet rpc error');
      log.info(ex);
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('creatWalletComplete', async query => {
    try {
      var result = await WM.creatWalletComplete();
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('importWalletBykeyStore', async query => {
    var { filepath, password, name } = query;
    if (filepath == undefined) {
      throw resultView(null, false, 'need filepath');
    }
    if (password == undefined) {
      throw resultView(null, false, 'need password');
    }
    if (name == undefined) {
      throw resultView(null, false, 'need name');
    }

    try {
      WM.ImportWalletBykeyStore(filepath, password, name);
      return resultView(null, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('ImportWalletByMnemonic', async query => {
    var { mnemonic, password, name } = query;

    if (mnemonic == undefined) {
      throw resultView(null, false, 'need mnemonic');
    }
    if (password == undefined) {
      throw resultView(null, false, 'need password');
    }
    if (name == undefined) {
      throw resultView(null, false, 'need name');
    }

    try {
      WM.ImportWalletByMnemonic(mnemonic, password, name);
      return resultView(null, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('defaultWalletBlance', async query => {
    log.info('defaultWalletBlance start');
    try {
      var Liquid = await WM.getDefaultWalletBlance();
      // var Delegation = await WM.getDelegationsBalance();
      var DistributionReward = await WM.getDistributionRewards();

      return resultView({
        Liquid: Liquid,
        // Delegation:Delegation,
        Delegation: '0',
        DistributionReward: DistributionReward
      }, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('DistributionInformation', async query => {
    try {
      var result = await WM.DistributionInformation();
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('MinerRewards', async query => {
    try {
      var result = await WM.getMinerRewards();
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  eipc.answerRenderer('transfer', async query => {
    var { to, amount, gas, denom, memo } = query;
    // to 需要判断 账号的格式是否合理呵护规则
    // amount 需要判断  转账金额大小 数据类型
    // gas 目前默认值位1  转账金额大小 数据类型
    if (to == undefined) {
      throw resultView(null, false, 'need to address');
    }
    // 需要寻找新的考验地址格式
    // if(isAddress(to)==false){
    //     throw resultView(null,false,'Incorrect address format')
    // }


    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }
    if (isNaN(parseInt(amount))) {
      throw resultView(null, false, 'Incorrect amount format');
    }

    if (gas == undefined) {
      throw resultView(null, false, 'need to gas');
    }
    if (denom == undefined) {
      denom = 'lamb';
    }

    if (isNaN(parseInt(gas))) {
      throw resultView(null, false, 'Incorrect gas format');
    }

    try {
      var data = await WM.Transfer(to, amount, gas, denom, memo);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('transferDelegation', async query => {
    var { to, amount, gas, isdege, validatorType } = query;
    // to 需要判断 账号的格式是否合理呵护规则
    // amount 需要判断  转账金额大小 数据类型
    // gas 目前默认值位1  转账金额大小 数据类型
    if (to == undefined) {
      throw resultView(null, false, 'need to address');
    }
    // 需要寻找新的考验地址格式
    // if(isAddress(to)==false){
    //     throw resultView(null,false,'Incorrect address format')
    // }


    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }
    if (isNaN(parseInt(amount))) {
      throw resultView(null, false, 'Incorrect amount format');
    }

    if (gas == undefined) {
      throw resultView(null, false, 'need to gas');
    }

    if (isNaN(parseInt(gas))) {
      throw resultView(null, false, 'Incorrect gas format');
    }
    if (isdege == undefined) {
      isdege = true;
    }
    if (validatorType == undefined) {
      validatorType = 1;
    }

    try {
      var data = await WM.TransferDelegation(to, amount, gas, isdege, validatorType);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('withdrawal', async query => {
    var { to, amount, gas, isdege } = query;



    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }

    try {
      var data = await WM.TransferWithdrawal(to, amount, gas, isdege);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('withdrawalDistribution', async query => {
    var { to, amount, gas, isdege } = query;



    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }

    try {
      console.log('~~withdrawalDistribution~~');
      var data = await WM.TransferwithdrawalDistribution(to, amount, gas, isdege);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('AssetPledge', async query => {
    var { asset, amount, gas, isdege, denom } = query;



    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }
    if (asset == undefined) {
      throw resultView(null, false, 'need asset');
    }
    if (denom == undefined) {
      denom = 'ulamb';
    }

    try {
      var data = await WM.AssetPledge(amount, asset, gas, isdege, denom);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('Simulate', async query => {
    var { transactiondata } = query;

    try {
      var data = await WM.Simulate(transactiondata);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('CheckTxstatus', async query => {
    try {
      var data = await WM.includedForTx();
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('transferConfirm', async query => {
    log.info('transferConfirm rpc start');
    var now = new Date().getTime();
    log.info('transferConfirm rpc time', lastTime, now - lastTime);
    if (lastTime != undefined && now - lastTime < 1000 * 10) {
      log.info('transferConfirm rpc repeat');
      log.info('transferConfirm rpc repeat cancel');
      return resultView('repeattx', true);
    } else {
      log.info('transferConfirm rpc not repeat');
    }

    lastTime = new Date().getTime();

    var { password, transactiondata, gaseFee } = query;
    try {
      log.info('transferConfirm rpc step1');
      var data = await WM.TransferConfirm(password, transactiondata, gaseFee);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('openkeystore', async query => {
    shell.showItemInFolder(DAEMON_CONFIG.BASE_PATH);
  });

  // eipc.answerRenderer('ViewDefaultWalletPrivatekey',async(query)=>{
  //     log.info('loginDefaultWallet')
  //     var password =query.password;
  //     if(password == undefined){
  //         return resultView(null,false,'need password')
  //     }
  //     try{
  //         var info = WM.OpenDefaultwallet(password);
  //         return resultView(info,true)

  //     }catch(ex){
  //         return resultView(null,false,ex)
  //     }
  // })


  eipc.answerRenderer('Walletsign', async query => {
    log.info('Wallettransfer');

    var content = query.content;
    var password = query.password;

    try {
      var TxMessageload = await WM.SignData(password, content);

      log.info(TxMessageload);
      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });



  eipc.answerRenderer('editWalletName', async query => {
    log.info('Wallettransfer');
    var name = query.name;
    try {
      var TxMessageload = await WM.editDefaultName(name);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('localtxlist', async query => {
    try {
      var txlist = await Nedbjs.getTxList() || [];
      var transaction = new TransactionManager();
      txlist.forEach(async item => {
        try {
          if (item.state == 0 || item.state == -1) {
            var txinfo = await transaction.getTransactionInfo(item.txhash);
            var flag; var message = '';
            if (txinfo.error || txinfo.code) {
              // 有tx 或tx错误
              if (txinfo.error) {
                flag = -1;
              }
              if (txinfo.code) {
                flag = -2;
                if (txinfo.logs != undefined) {
                  message = txinfo.logs.map(item => {
                    return item.log;
                  }).join(',');
                }
              }
            } else {
              flag = 1;
            }

            var isok = await Nedbjs.updateTxState(item.txhash, flag, message);
            console.log(isok);
          }
        } catch (error) {
          console.log(error);
        }
      });

      return resultView(txlist, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });


  eipc.answerRenderer('deposit', async query => {
    var { ProposalID, amount } = query;
    if (ProposalID == undefined) {
      throw resultView(null, false, 'need ProposalID');
    }
    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }
    try {
      var TxMessageload = await WM.TransferDeposit(ProposalID, amount);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('vote', async query => {
    var { ProposalID, option } = query;
    if (ProposalID == undefined) {
      throw resultView(null, false, 'need ProposalID');
    }
    if (option == undefined) {
      throw resultView(null, false, 'need option');
    }
    try {
      var TxMessageload = await WM.TransferVote(ProposalID, option);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('redelegate', async query => {
    var { SourceAddress, DestinationAddress, amount, validatortype } = query;
    if (SourceAddress == undefined) {
      throw resultView(null, false, 'need SourceAddress');
    }
    if (DestinationAddress == undefined) {
      throw resultView(null, false, 'need DestinationAddress');
    }
    if (amount == undefined) {
      throw resultView(null, false, 'need amount');
    }
    try {
      var TxMessageload = await WM.TransferRedelegate(SourceAddress, DestinationAddress, amount, validatortype);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });


  eipc.answerRenderer('CreateSellOrder', async query => {
    var { marketName,
      price,
      rate,
      sellSize,
      machineName,
      cancelTimeDuration,
      minBuySize,
      minBuyDuration,
      maxBuyDuration } = query;

    if (marketName == undefined) {
      throw resultView(null, false, 'need marketName');
    }
    if (price == undefined) {
      throw resultView(null, false, 'need price');
    }
    if (rate == undefined) {
      throw resultView(null, false, 'need rate');
    }
    if (machineName == undefined) {
      throw resultView(null, false, 'need machineName');
    }
    if (cancelTimeDuration == undefined) {
      throw resultView(null, false, 'need cancelTimeDuration');
    }
    if (minBuySize == undefined) {
      throw resultView(null, false, 'need minBuySize');
    }
    if (minBuyDuration == undefined) {
      throw resultView(null, false, 'need minBuyDuration');
    }
    if (maxBuyDuration == undefined) {
      throw resultView(null, false, 'need maxBuyDuration');
    }

    try {
      var TxMessageload = await WM.TransferCreateSellOrder(marketName,
        price,
        rate,
        sellSize,
        machineName,
        cancelTimeDuration,
        minBuySize,
        minBuyDuration,
        maxBuyDuration);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('CreateBuyOrder', async query => {
    var { duration,
      size,
      sellOrderId,
      marketName } = query;
    if (duration == undefined) {
      throw resultView(null, false, 'need duration');
    }
    if (size == undefined) {
      throw resultView(null, false, 'need size');
    }
    if (marketName == undefined) {
      throw resultView(null, false, 'need marketName');
    }
    try {
      var TxMessageload = await WM.TransferCreateBuyOrder(duration,
        size,
        sellOrderId,
        marketName);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });
}


