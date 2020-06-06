import WalletManger from './walletManger.js';
import resultView from './result.js';

import Nedb from './utils/nedb';

import TransactionManager from './transactionManager.js';
// import isAddress from '../utils/isaddress.js';
import path from 'path';

const { ipcMain: eipc } = require('electron-better-ipc');

const { shell } = require('electron');

var { DAEMON_CONFIG } = require('../configmain.js');

var log = require('../log').log;

const settings = require('electron-settings');

const { errorList } = require('./throwErrorCode.js');

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
      throw resultView(null, false, errorList.need_address);
    }
    // if(isAddress(address)==false){
    // 暂时注释地址合法的判断
    if (address == false) {
      throw resultView(null, false, errorList.Incorrect_address_format);
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
      throw resultView(null, false, errorList.need_password);
    }
    try {
      var info = WM.OpenDefaultwallet(password);
      return resultView({
        address: info.address,
        name: info.name
      }, true);
    } catch (ex) {
      console.log('捕获错误');
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
      throw resultView(null, false, errorList.need_password);
    }
    if (name == undefined) {
      throw resultView(null, false, errorList.need_name);
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
      throw resultView(null, false, errorList.need_filepath);
    }
    if (password == undefined) {
      throw resultView(null, false, errorList.need_password);
    }
    if (name == undefined) {
      throw resultView(null, false, errorList.need_name);
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
      throw resultView(null, false, errorList.need_mnemonic);
    }
    if (password == undefined) {
      throw resultView(null, false, errorList.need_password);
    }
    if (name == undefined) {
      throw resultView(null, false, errorList.need_name);
    }

    try {
      WM.ImportWalletByMnemonic(mnemonic, password, name);
      return resultView(null, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('defaultWalletBlance', async query => {
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
      throw resultView(null, false, errorList.need_to_address);
    }
    // 需要寻找新的考验地址格式
    // if(isAddress(to)==false){
    //     throw resultView(null,false,'Incorrect address format')
    // }


    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
    }
    if (isNaN(parseInt(amount))) {
      throw resultView(null, false, errorList.Incorrect_amount_format);
    }

    if (gas == undefined) {
      throw resultView(null, false, errorList.need_to_gas);
    }
    if (denom == undefined) {
      denom = 'lamb';
    }

    if (isNaN(parseInt(gas))) {
      throw resultView(null, false, errorList.Incorrect_gas_format);
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
      throw resultView(null, false, errorList.need_to_address);
    }
    // 需要寻找新的考验地址格式
    // if(isAddress(to)==false){
    //     throw resultView(null,false,'Incorrect address format')
    // }


    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
    }
    if (isNaN(parseInt(amount))) {
      throw resultView(null, false, errorList.Incorrect_amount_format);
    }

    if (gas == undefined) {
      throw resultView(null, false, errorList.need_to_gas);
    }

    if (isNaN(parseInt(gas))) {
      throw resultView(null, false, errorList.Incorrect_gas_format);
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
      throw resultView(null, false, errorList.need_amount);
    }

    try {
      var data = await WM.TransferWithdrawal(to, amount, gas, isdege);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('minerwithdrawal', async query => {
    var { to, amount, gas, isdege } = query;



    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
    }

    try {
      var data = await WM.TransferMinerwithdrawal(to, amount, gas, isdege);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('minerMinerWithDrawCount', async query => {
    var { page, limit } = query;



    if (page == undefined) {
      throw resultView(null, false, errorList.need_page);
    }
    if (limit == undefined) {
      throw resultView(null, false, errorList.need_limit);
    }

    try {
      var data = await WM.TransferMinerWithDrawCount(page, limit);
      return resultView(data, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  eipc.answerRenderer('withdrawalDistribution', async query => {
    var { to, amount, gas, isdege } = query;



    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
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
      throw resultView(null, false, errorList.need_amount);
    }
    if (asset == undefined) {
      throw resultView(null, false, errorList.need_asset);
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
    shell.showItemInFolder(path.join(DAEMON_CONFIG.BASE_PATH, 'Wallet'));
  });

  eipc.answerRenderer('openLog', async query => {
    shell.showItemInFolder(path.join(DAEMON_CONFIG.BASE_PATH, 'Log'));
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
      throw resultView(null, false, errorList.need_ProposalID);
    }
    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
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
      throw resultView(null, false, errorList.need_ProposalID);
    }
    if (option == undefined) {
      throw resultView(null, false, errorList.need_option);
    }
    try {
      var TxMessageload = await WM.TransferVote(ProposalID, option);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });



  eipc.answerRenderer('CreateMiner', async query => {
    var { miningAddress, dhtId, pubKey } = query;

    if (miningAddress == undefined) {
      throw resultView(null, false, errorList.need_miningAddress);
    }

    if (dhtId == undefined) {
      throw resultView(null, false, errorList.need_dhtId);
    }

    // if (pubKey == undefined) {
    //   throw resultView(null, false, 'need pubKey');
    // }

    try {
      var TxMessageload = await WM.TransferCreateMiner(miningAddress, dhtId, pubKey);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('CreateMachine', async query => {
    var { name, peerId, dhtId, pubKey } = query;

    if (name == undefined) {
      throw resultView(null, false, errorList.need_name);
    }

    // if (peerId == undefined) {
    //   throw resultView(null, false, 'need peerId');
    // }

    if (dhtId == undefined) {
      throw resultView(null, false, errorList.need_dhtId);
    }

    // if (pubKey == undefined) {
    //   throw resultView(null, false, 'need pubKey');
    // }


    try {
      var TxMessageload = await WM.TransferCreateMachine(name, peerId, dhtId, pubKey);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });



  eipc.answerRenderer('redelegate', async query => {
    var { SourceAddress, DestinationAddress, amount, validatortype } = query;
    if (SourceAddress == undefined) {
      throw resultView(null, false, errorList.need_SourceAddress);
    }
    if (DestinationAddress == undefined) {
      throw resultView(null, false, errorList.need_DestinationAddress);
    }
    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
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
      description,
      cancelTimeDuration,
      minBuySize,
      minBuyDuration,
      maxBuyDuration } = query;

    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
    }
    if (price == undefined) {
      throw resultView(null, false, errorList.need_price);
    }
    if (rate == undefined) {
      throw resultView(null, false, errorList.need_rate);
    }
    if (description == undefined) {
      throw resultView(null, false, errorList.need_description);
    }
    if (cancelTimeDuration == undefined) {
      throw resultView(null, false, errorList.need_cancelTimeDuration);
    }
    if (minBuySize == undefined) {
      throw resultView(null, false, errorList.need_minBuySize);
    }
    if (minBuyDuration == undefined) {
      throw resultView(null, false, errorList.need_minBuyDuration);
    }
    if (maxBuyDuration == undefined) {
      throw resultView(null, false, errorList.need_maxBuyDuration);
    }

    try {
      var TxMessageload = await WM.TransferCreateSellOrder(marketName,
        price,
        rate,
        sellSize,
        description,
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
      throw resultView(null, false, errorList.need_duration);
    }
    if (size == undefined) {
      throw resultView(null, false, errorList.need_size);
    }
    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
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



  eipc.answerRenderer('CancelSellOrder', async query => {
    var { OrderId } = query;

    if (OrderId == undefined) {
      throw resultView(null, false, errorList.OrderId);
    }

    try {
      var TxMessageload = await WM.CancelSellOrder(OrderId);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });



  eipc.answerRenderer('marketOrderRenewal', async query => {
    var { duration, orderId } = query;

    if (duration == undefined) {
      throw resultView(null, false, errorList.need_duration);
    }

    if (orderId == undefined) {
      throw resultView(null, false, errorList.need_orderId);
    }

    try {
      var TxMessageload = await WM.OrderRenewal(orderId, duration, '');

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });


  eipc.answerRenderer('marketTransferDelegateMarket', async query => {
    var { marketName, amount } = query;

    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
    }

    if (amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
    }

    try {
      var TxMessageload = await WM.TransferDelegateMarket(marketName, amount);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });


  eipc.answerRenderer('marketTransferWithDrawMarket', async query => {
    var { marketName } = query;

    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
    }


    try {
      var TxMessageload = await WM.TransferWithDrawMarket(marketName);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });



  eipc.answerRenderer('createSonAccount', async query => {
    var { mnemonic, password, name, index } = query;
    if (mnemonic == undefined) {
      throw resultView(null, false, errorList.need_mnemonic);
    }
    if (password == undefined) {
      throw resultView(null, false, errorList.need_password);
    }
    if (name == undefined) {
      throw resultView(null, false, errorList.need_name);
    }
    try {
      var TxMessageload = await WM.CreatSonAccountByMnemonic(mnemonic, password, name, index);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('sonAccountList', async query => {
    try {
      var TxMessageload = await WM.SonFileList();

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('exportSonAccount', async query => {
    try {
      var { address, password } = query;
      if (address == undefined) {
        throw resultView(null, false, errorList.need_address);
      }

      var TxMessageload = await WM.exportSonAccount(address, password);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('ImportSonAccount', async query => {
    try {
      var { file, password, name } = query;
      if (file == undefined) {
        throw resultView(null, false, errorList.need_file);
      }

      if (password == undefined) {
        throw resultView(null, false, errorList.need_password);
      }

      if (name == undefined) {
        throw resultView(null, false, errorList.need_name);
      }

      var TxMessageload = await WM.ImportSonAccount(file, password, name);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('getgasprice', async query => {
    try {
      var gasprice = settings.get('gasprice');
      if (gasprice == undefined) {
        gasprice = 0.025;
      }


      return resultView({ data: gasprice }, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('setgasprice', async query => {
    try {
      var { gasprice } = query;
      if (gasprice == undefined) {
        throw resultView(null, false, errorList.need_gasprice);
      }
      gasprice = parseFloat(gasprice);
      if (isNaN(gasprice)) {
        throw resultView(null, false, errorList.gaspricemust_be_numeric);
      }

      settings.set('gasprice', gasprice);

      return resultView({
        data: true
      }, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('deleteaccount', async query => {
    try {
      var { address, password } = query;
      if (address == undefined) {
        throw resultView(null, false, errorList.need_address);
      }

      if (password == undefined) {
        throw resultView(null, false, errorList.need_password);
      }

      var TxMessageload = await WM.deleteaccount(address, password);

      return resultView({
        data: true
      }, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('CreateDigitalAssetMarket', async query => {
    var { AssetName, Ratio } = query;
    console.log(query);
    if (AssetName == undefined) {
      throw resultView(null, false, errorList.need_AssetName);
    }

    if (Ratio == undefined) {
      throw resultView(null, false, errorList.need_Ratio);
    }
    try {
      var TxMessageload = await WM.CreateDigitalAssetMarket(AssetName, Ratio);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('DigitalAssetPledge', async query => {
    var { AssetName, Amount } = query;
    if (AssetName == undefined) {
      throw resultView(null, false, errorList.need_AssetName);
    }

    if (Amount == undefined) {
      throw resultView(null, false, errorList.need_amount);
    }
    try {
      var TxMessageload = await WM.DigitalAssetPledge(AssetName, Amount);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('DigitalAssetRefund', async query => {
    var { AssetName } = query;
    if (AssetName == undefined) {
      throw resultView(null, false, errorList.need_AssetName);
    }
    try {
      var TxMessageload = await WM.DigitalAssetRefund(AssetName);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('AuthorizeMiningPubKey', async query => {
    var { PubKey } = query;
    if (PubKey == undefined) {
      throw resultView(null, false, errorList.need_PubKey);
    }
    try {
      var TxMessageload = await WM.AuthorizeMiningPubKey(PubKey);
      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });


  eipc.answerRenderer('CreateAsset', async query => {
    var { asset_amount, asset_denom, name,
      mint_type, inflation, inflation_period } = query;

    console.log(query);

    if (asset_amount == undefined) {
      throw resultView(null, false, errorList.need_asset_amount);
    }

    if (asset_denom == undefined) {
      throw resultView(null, false, errorList.need_asset_denom);
    }

    if (name == undefined) {
      throw resultView(null, false, errorList.need_name);
    }

    if (mint_type == undefined) {
      throw resultView(null, false, errorList.need_mint_type);
    }


    if (inflation == undefined && mint_type == '3') {
      throw resultView(null, false, errorList.need_inflation);
    }

    if (inflation_period == undefined && mint_type == '3') {
      throw resultView(null, false, errorList.need_inflation_period);
    }
    try {
      var token_amount, token_denom;

      token_denom = 'ulamb';
      token_amount = 1e18;


      var TxMessageload = await WM.CreateAsset(asset_amount, asset_denom,
        token_amount, token_denom,
        name, mint_type, inflation, inflation_period);

      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });

  eipc.answerRenderer('Assetparameters', async query => {
    // var {  } = query;

    try {
      var TxMessageload = await WM.Assetparameters();
      return resultView(TxMessageload, true);
    } catch (error) {
      throw resultView(null, false, error);
    }
  });



  // Assetparameters
}


