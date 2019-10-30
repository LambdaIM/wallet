import resultView from './result.js';
import Manager from './marketmanager.js';


import fs from 'graceful-fs';

import cmd from 'node-cmd';
import Promise from 'bluebird';

var { DAEMON_CONFIG } = require('../configmain.js');
const { ipcMain: eipc } = require('electron-better-ipc');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
const runAsync = Promise.promisify(cmd.run, { multiArgs: true, context: cmd });

const settings = require('electron-settings');
const hdkeyjs = require('@jswebfans/hdkeyjs');

const path = require('path');
const YAML = require('yaml');
var log = require('../log').log;
const os = require('os');


var suppose = require('suppose');


export default function() {
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
    var { marketName, orderType, page, limit } = query;
    if (marketName == undefined) {
      throw resultView(null, false, 'need marketName');
    }
    if (orderType == undefined) {
      throw resultView(null, false, 'need orderType');
    }

    if (page == undefined) {
      throw resultView(null, false, 'need page');
    }

    if (limit == undefined) {
      throw resultView(null, false, 'need limit');
    }

    try {
      var M = new Manager();
      var result = await M.getOrderList(marketName, orderType, page, limit);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('marketSellOrderslist', async query => {
    var { page, limit } = query;
    if (page == undefined) {
      throw resultView(null, false, 'need page');
    }

    if (limit == undefined) {
      throw resultView(null, false, 'need limit');
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
      throw resultView(null, false, 'need page');
    }
    if (limit == undefined) {
      throw resultView(null, false, 'need limit');
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
      throw resultView(null, false, 'need orderId');
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
      throw resultView(null, false, 'need address');
    }
    if (limit == undefined) {
      throw resultView(null, false, 'need limit');
    }

    try {
      var M = new Manager();
      var result = await M.getMinermachines(page, limit);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('cmdtest', async query => {
    try {
      console.log('cmdtest');


      // const result = await getAsync(`${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);
      // console.log(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);
      // console.log(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);
      var result = cmd.run(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);


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


  eipc.answerRenderer('runlambdastorage', async query => {
    log.info('runlambdastorage');

    var password = query.password;

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
      var secretKey = yamlconfig.gateway['access-key'];


      /*

./lamb  gateway --broker.dht_gateway_addr 47.93.225.51:26662 --broker.validator_addr 47.93.225.51:13659 --broker.extra_key_file /Users/webjs/lambWallet/Wallet/lambda1ry8396ua5z2fsjxcv30v9v8myjfqq7a46zepml.keyinfo --gateway.address 127.0.0.1:9008 --gateway.access_key lambda --gateway.secret_key 12345678

 */
      //   taskkill /F /IM lamb.exe
      var mackill = `ps -ef | grep '[l]amb gateway' | awk '{print $2'} | xargs kill`;
      var winkill = `taskkill /F /IM lamb.exe`;
      var nowos = os.platform();
      console.log(nowos);
      var nowkil = nowos == 'win32' ? winkill : mackill;
      try {
        var killresult = await getAsync(nowkil);
      } catch (error) {

      }


      var s3result = await runS3(ip, keypath, gatewayaddress, accesskey, secretKey, password);
      return resultView({
        s3: s3result
      }, true);

      // getAsync(nowkil)
      //   .then(() => {
      //     console.log('kill [l]amb gateway ok');
      //     log.info(`kill [l]amb gateway ok`);
      //     log.info(`suppose`);

      //     suppose(path.join(DAEMON_CONFIG.BASE_PATH,'lamb'),
      //       [
      //         `gateway`,
      //         `--broker.dht_gateway_addr`,
      //         `${ip}:26662`,
      //         `--broker.validator_addr`,
      //         `${ip}:13659`,
      //         `--broker.extra_key_file`,
      //         `${keypath}`,
      //         `--gateway.address`,
      //         gatewayaddress,
      //         `--gateway.access_key`,
      //         accesskey,
      //         `--gateway.secret_key`,
      //         secretKey
      //       ], { debug: fs.createWriteStream(path.join(DAEMON_CONFIG.BASE_PATH, 'debug.txt')) })
      //       .when(/.*/).respond(`${password}\n`)
      //       .on('error', function(error) {
      //         console.log(error.message);
      //         log.info('suppose error');
      //         log.info(error.message);
      //         throw resultView(null, false, error);
      //       })
      //       .end(function(code) {
      //         log.info('suppose end');
      //         log.info(code);
      //         return resultView({}, true);
      //       });
      //   }, () => {
      //     console.log('kill [l]amb gateway error');
      //     log.info(`kill [l]amb gateway error`);
      //     throw resultView(null, false, error);
      //   });
    } catch (error) {
      console.log(error);

      log.info('suppose catch error');
      log.info(error.message);
      throw resultView(null, false, error);
    }
  });

  function runS3(ip, keypath, gatewayaddress, accesskey, secretKey, password) {
    return new Promise(function (resolve, reject) {
      suppose(path.join(DAEMON_CONFIG.BASE_PATH, 'lamb'),
        [
          `gateway`,
          `--broker.dht_gateway_addr`,
          `${ip}:26662`,
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
          `--home`,
          DAEMON_CONFIG.OrderS3File
        ]
        // , { debug: fs.createWriteStream(path.join(DAEMON_CONFIG.BASE_PATH, 'debug.txt')) }
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



  // getmarketmachineinfo
}
