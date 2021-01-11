import resultView from './result.js';
import Manager from './marketmanager.js';


import fs from 'graceful-fs';

import cmd from 'node-cmd';
import Promise from 'bluebird';

import marketNedb from './utils/marketNedb';


var { DAEMON_CONFIG } = require('../configmain.js');
const { ipcMain: eipc } = require('electron-better-ipc');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
// const runAsync = Promise.promisify(cmd.run, { multiArgs: true, context: cmd });

const settings = require('electron-settings');
// const hdkeyjs = require('@jswebfans/hdkeyjs');

const path = require('path');
const YAML = require('yaml');
var log = require('../log').log;
const os = require('os');

var suppose = require('@jswebfans/suppose');
const { errorList } = require('./throwErrorCode.js');
const hdkeyjs = require('@jswebfans/hdkeyjs');
const bech32 = require('bech32');


export default function() {
  var Nedbjs = new marketNedb();
  eipc.answerRenderer('marketlist', async query => {
    try {
      var M = new Manager();
      var result = await M.getmarketlist(query);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('marketinfo', async query => {
    try {
      var M = new Manager();
      var result = await M.getmarketinfo(query);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('marketOrderList', async query => {
    var { marketName, orderType, page, limit, islocal, marketAddress, orderSortinfo, islocalfilter, statusType } = query;
    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
    }
    if (orderType == undefined) {
      throw resultView(null, false, errorList.need_orderType);
    }

    if (page == undefined) {
      throw resultView(null, false, errorList.need_page);
    }

    if (limit == undefined) {
      throw resultView(null, false, errorList.need_limit);
    }

    if (marketAddress == undefined) {
      throw resultView(null, false, errorList.need_marketAddress);
    }

    if (statusType == undefined) {
      throw resultView(null, false, errorList.need_statusType);
    }



    if (islocal == undefined) {
      islocal = false;
    }
    if (islocalfilter == undefined) {
      islocalfilter = {};
    }
    console.log('islocal', islocal);
    try {
      var M = new Manager();
      var result;
      if (islocal == false) {
        result = await M.getOrderList(marketName, orderType, statusType, page, limit);
      } else {
        result = {
          data: await Nedbjs.getSellOrderbymarket(marketAddress, page, limit, orderSortinfo, islocalfilter)
        };
      }


      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('marketOrderListsync', async query => {
    var { marketName, orderType, page, limit, statusType } = query;
    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
    }
    if (orderType == undefined) {
      throw resultView(null, false, errorList.need_orderType);
    }

    if (page == undefined) {
      throw resultView(null, false, errorList.need_page);
    }

    if (limit == undefined) {
      throw resultView(null, false, errorList.need_limit);
    }
    if (statusType == undefined) {
      statusType = 'whole';
    }


    try {
      var M = new Manager();
      var result = await M.getOrderList(marketName, orderType, statusType, page, limit);
      if (result.data == null) {
        return resultView(0, true);
      }

      if (result.data.length > 0) {
        var flag = await Nedbjs.insertTx(result.data);
      }

      return resultView(result.data.length, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('clearlocalmarketdata', async query => {
    let { marketAddress } = query;
    try {
      var result = await Nedbjs.cleardata(marketAddress);
      settings.set(`Market.synctime.${global.__lambNodeinfo.network}.${marketAddress}`, new Date().getTime());

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('getmarketsyncTime', async query => {
    let { marketAddress } = query;
    try {
      var result = settings.get(`Market.synctime.${global.__lambNodeinfo.network}.${marketAddress}`);
      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('marketSellOrderslist', async query => {
    var { page, limit } = query;
    if (page == undefined) {
      throw resultView(null, false, errorList.need_page);
    }

    if (limit == undefined) {
      throw resultView(null, false, errorList.need_limit);
    }

    try {
      var M = new Manager();
      var result = await M.getSellOrderslist(page, limit);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('marketUserOrderslist', async query => {
    var { page, limit } = query;
    if (page == undefined) {
      throw resultView(null, false, errorList.need_page);
    }
    if (limit == undefined) {
      throw resultView(null, false, errorList.need_limit);
    }


    try {
      var M = new Manager();
      var result = await M.getUserOrderslist(page, limit);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('marketgetOrderinfo', async query => {
    var { orderId } = query;
    if (orderId == undefined) {
      throw resultView(null, false, errorList.need_orderId);
    }

    try {
      var M = new Manager();
      var result = await M.getOrderinfo(orderId);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('minermachines', async query => {
    var { page, limit } = query;
    if (page == undefined) {
      throw resultView(null, false, errorList.need_address);
    }
    if (limit == undefined) {
      throw resultView(null, false, errorList.need_limit);
    }

    try {
      var M = new Manager();
      var result = await M.getMinermachines(page, limit);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  eipc.answerRenderer('lambdastoragemanagerkey', async query => {
    try {
      console.log('lambdastoragemanagerkey');
      const file = fs.readFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, 'utf8');
      var yamlconfig = YAML.parse(file);


      return resultView(yamlconfig, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  eipc.answerRenderer('editlambdastoragemanagerkey', async query => {
    var { accesskey, secretkey, port } = query;
    if (accesskey == undefined) {
      throw resultView(null, false, errorList.need_accesskey);
    }
    if (secretkey == undefined) {
      throw resultView(null, false, errorList.need_secretkey);
    }

    if (port == undefined) {
      throw resultView(null, false, errorList.need_port);
    }
    if (port >= 65535) {
      throw resultView(null, false, errorList.need_port_and);
    }



    try {
      console.log('lambdastoragemanagerkey');
      const file = fs.readFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, 'utf8');
      var yamlconfig = YAML.parse(file);

      yamlconfig.gateway['access-key'] = accesskey;
      yamlconfig.gateway['secret-key'] = secretkey;
      yamlconfig.gateway['address'] = `127.0.0.1:${port}`;


      var result = fs.writeFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, YAML.stringify(yamlconfig), { mode: '0600', encoding: 'utf8' });


      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('lambdastorageclose', async query => {
    try {
      // [l]ambda
      var mackill = `ps -ef | grep '${DAEMON_CONFIG.LambdaSfile().replace('lamb', '[l]amb')} gateway' | awk '{print $2'} | xargs kill`;
      var winkill = `taskkill /F /IM ${DAEMON_CONFIG.LambdaSfile()}`;
      var nowos = os.platform();
      console.log(nowos);
      var nowkil = nowos == 'win32' ? winkill : mackill;
      var killresult = await getAsync(nowkil);



      return resultView({}, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('runlambdastorage', async query => {
    log.info('runlambdastorage');

    var password = query.password;
    var mackill = `ps -ef | grep '${DAEMON_CONFIG.LambdaSfile().replace('lamb', '[l]amb')} s3gw' | awk '{print $2'} | xargs kill`;
    var winkill = `taskkill /F /IM ${DAEMON_CONFIG.LambdaSfile()}`;
    var nowos = os.platform();
    var orderId = query.orderid;
    console.log(nowos);
    var nowkil = nowos == 'win32' ? winkill : mackill;
    try {
      var killresult = await getAsync(nowkil);
    } catch (error) {

    }

    try {
      var defaultAddress;
      if (settings.has('defaultwallet') != false) {
        defaultAddress = settings.get('defaultwallet');
        defaultAddress = defaultAddress.toLocaleLowerCase();
      } else {
        throw resultView(null, false, 'need defaultAddress');
      }
      var ip = DAEMON_CONFIG.ValidatorIp();
      var keypath = path.join(DAEMON_CONFIG.WalletFile, `${defaultAddress}.keyinfo`);

      const file = fs.readFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, 'utf8');
      var yamlconfig = YAML.parse(file);
      console.log(yamlconfig);
      var gatewayaddress = yamlconfig.gateway.address;
      var accesskey = yamlconfig.gateway['access-key'];
      var secretKey = yamlconfig.gateway['secret-key'];


      var s3result = await runS3(ip, keypath, gatewayaddress, accesskey, secretKey, password, orderId);
      return resultView({
        s3: s3result
      }, true);
    } catch (error) {
      console.log(error);

      log.info('suppose catch error');
      log.info(error.message);
      throw resultView(null, false, error);
    }
  });


  eipc.answerRenderer('lambdastoragecommandline', async query => {
    var orderId = query.orderid;
    try {
      var defaultAddress;
      if (settings.has('defaultwallet') != false) {
        defaultAddress = settings.get('defaultwallet');
        defaultAddress = defaultAddress.toLocaleLowerCase();
      } else {
        throw resultView(null, false, errorList.need_defaultAddress);
      }
      var ip = DAEMON_CONFIG.ValidatorIp();
      var keypath = path.join(DAEMON_CONFIG.WalletFile, `${defaultAddress}.keyinfo`);

      const file = fs.readFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, 'utf8');
      var yamlconfig = YAML.parse(file);
      console.log(yamlconfig);
      var gatewayaddress = yamlconfig.gateway.address;
      var accesskey = yamlconfig.gateway['access-key'];
      var secretKey = yamlconfig.gateway['secret-key'];
      var s3result = await getS3commandline(ip, keypath, gatewayaddress, accesskey, secretKey, orderId);



      return resultView(s3result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('sellorderinfo', async query => {
    var { orderId } = query;
    if (orderId == undefined) {
      throw resultView(null, false, errorList.need_orderId);
    }

    try {
      var M = new Manager();
      var result = await M.sellOrderinfo(orderId);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('marketdelegationinfo', async query => {
    var { marketName } = query;
    console.log('marketdelegationinfo', query);
    if (marketName == undefined) {
      throw resultView(null, false, errorList.need_marketName);
    }

    try {
      var M = new Manager();
      var result = await M.marketdelegationinfo(marketName);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('getlambdaaddressbyminer', async query => {
    var { address } = query;
    console.log('getlambdaaddressbyminer', query);
    if (address == undefined) {
      throw resultView(null, false, errorList.need_address);
    }

    try {
      var addressBytes = hdkeyjs.address.getBytes(address);
      const PREFIX = 'lambda';
      var result = bech32.encode(PREFIX, bech32.toWords(addressBytes));


      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('lambdaS3Version', async query => {
    console.log('lambdaS3Version', query);
    try {
      var result = await getS3Version();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  function getS3commandline(ip, keypath, gatewayaddress, accesskey, secretKey, orderid) {
    return `${path.join(DAEMON_CONFIG.BASE_PATH, DAEMON_CONFIG.LambdaSfile())} s3gw run \
    --broker.dht_gateway_addr ${ip}:12000 \
    --broker.validator_addr  ${ip}:13659 \
    --broker.extra_key_file  ${keypath} \
    --gateway.address  ${gatewayaddress} \
    --gateway.access_key  ${accesskey}  \
    --gateway.secret_key  ${secretKey}  \
    --broker.extra_order_id  ${orderid}  \
    --home ${DAEMON_CONFIG.OrderS3File} 
    `;
  }

  function runS3(ip, keypath, gatewayaddress, accesskey, secretKey, password, orderid) {
    return new Promise(function (resolve, reject) {
      suppose(path.join(DAEMON_CONFIG.BASE_PATH, DAEMON_CONFIG.LambdaSfile()),
        [
          `s3gw`,
          'run',
          `--broker.dht_gateway_addr`,
          `${ip}:12000`,
          `--broker.validator_addr`,
          `${ip}:13659`,
          `--broker.extra_key_file`,
          `${keypath}`,
          `--gateway.address`,
          gatewayaddress,
          `--gateway.access_key`,
          accesskey,
          `--gateway.secret_key`,
          secretKey,
          '--broker.extra_order_id',
          orderid,
          `--home`,
          DAEMON_CONFIG.OrderS3File

        ]

      )
        .when(/.*/).respond(`${password}\n`)
        .on('error', function(error) {
          console.log(error.message);
          log.info('suppose error');
          log.info(error.message);
          reject(error.message);
        })
        .end(function(code) {
          log.info('suppose end');
          log.info(code);
          resolve(code);
        });
    });
  }

  async function getS3Version() {
    var cmdlint = path.join(DAEMON_CONFIG.BASE_PATH, DAEMON_CONFIG.LambdaSfile()) + ' version';
    console.log(cmdlint);

    var result = await getAsync(cmdlint);

    return result;
  }

  eipc.answerRenderer('loanmarkets', async query => {
    try {
      var M = new Manager();
      var result = await M.loanmarkets();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('loanmarketsParams', async query => {
    try {
      var M = new Manager();
      var result = await M.loanmarketsParams();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('loanmarketsupplierreward', async query => {
    var { address, islatest_reward } = query;
    try {
      if (islatest_reward == undefined) {
        islatest_reward = false;
      }
      var M = new Manager();
      var result = await M.loanmarketsupplierreward(address, islatest_reward);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('loanloanee', async query => {
    var { address } = query;
    try {
      var M = new Manager();
      var result = await M.loanloanee(address);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });

  eipc.answerRenderer('loanmatch_order_info', async query => {
    var { order_id } = query;
    try {
      var M = new Manager();
      var result = await M.loanmatch_order_info(order_id);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });


  eipc.answerRenderer('loanmatch_match_orders', async query => {
    var { address, page, limit } = query;
    try {
      var M = new Manager();
      var result = await M.loanmatch_match_orders(address, page, limit);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  // getmarketmachineinfo
}
