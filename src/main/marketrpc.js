import resultView from './result.js';
import Manager from './marketmanager.js';


import fs from 'graceful-fs';

import cmd from 'node-cmd';
import Promise from 'bluebird';

var { DAEMON_CONFIG } = require('../configmain.js');
const { ipcMain: eipc } = require('electron-better-ipc');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

const settings = require('electron-settings');
const hdkeyjs = require('@jswebfans/hdkeyjs');

const YAML = require('yaml');


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
    try {
      var M = new Manager();
      var result = await M.getOrderinfo(query);

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
      console.log(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);
      console.log(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);
      var result = cmd.run(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb gateway start genesis --external_order`);
      console.log('---------!!!!!!!');
      // console.log(result);
      console.log('---------');

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('sets3orderinfo', async query => {
    var { orderId, pubKey, dhtId } = query;

    if (orderId == undefined) {
      throw resultView(null, false, 'need orderId');
    }
    if (pubKey == undefined) {
      throw resultView(null, false, 'need pubKey');
    }
    if (dhtId == undefined) {
      throw resultView(null, false, 'need dhtId');
    }

    var defaultAddress = '';
    if (settings.has('defaultwallet') != false) {
      defaultAddress = settings.get('defaultwallet');
    }


    // const result = await getAsync(`echo 12345678| ${DAEMON_CONFIG.BASE_PATH}/lamb token genesis 1012020303404`);

    const resultcli = await getAsync(`echo "111|222"`);
    console.log('|--------|');
    console.log(resultcli);

    console.log('|--------|');
    var access_key, secret_key;
    if (resultcli instanceof Array && resultcli[0] != undefined) {
      access_key = resultcli[0].split('|')[0];
      secret_key = resultcli[0].split('|')[1];
      console.log('access_key', access_key);
      console.log('secret_key', secret_key);
      secret_key = secret_key.replace('\n', '');
    } else {
      return resultView('执行失败', false);
    }

    const provider_addr = hdkeyjs.address.getAddress(Buffer.from(pubKey.value, 'hex'));

    try {
      var orderconfig = {
        'access_key': access_key,
        'owner_addr': defaultAddress,
        'order_id': orderId,
        'used': 0,
        'provider_dht_id': dhtId,
        'provider_addr': provider_addr,
        'secret_key': secret_key
      };
      // {
      //   "access_key": "SFOJ3WYGBOBDSH07TVGL",
      //   "owner_addr": "lambda1yw36w434wp92c9ds8gtzrf24a7kytepqlq402d",
      //   "order_id": "101202303404",
      //   "used": 0,
      //   "provider_dht_id": "6tGGo7qxy8uq3MbZcTNQSWxonqGDXyDCxuxZKR4urpQs",
      //   "provider_addr": "lambda1nrpq20th6pvex2ve6ky4wa50cfzt72n0n8fy95",
      //   "secret_key": "MCq8i2ZhiXMPCBfk96tQLU069xiA+TDknSo912qO"
      // }

      // 1判断文件存在不存在不存在创建文件
      // 2查找订单是否存在不存在插入这个订单的信息
      // 保存
      var orderFile = `${DAEMON_CONFIG.OrderS3File}/order-meta${defaultAddress}.json`;
      var data = [];
      if (fs.existsSync(orderFile) == false) {
        // fs.createReadStream(`${__static}/order-meta.json`).pipe(fs.createWriteStream(orderFile));
        data = [];
      } else {
        data = JSON.parse(fs.readFileSync(orderFile, 'utf-8'));
      }

      var haveOrder = false;
      data.forEach(item => {
        if (item.order_id === orderId) {
          haveOrder = true;
        }
      });
      if (haveOrder == false) {
        data.push(orderconfig);
      }
      fs.writeFileSync(orderFile, JSON.stringify(data, null, 5), 'utf-8');

      const file = fs.readFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, 'utf8');
      var yamlconfig = YAML.parse(file);

      yamlconfig.gateway['order-meta-file'] = orderFile;
      var yamlconfignew = YAML.stringify(yamlconfig);
      fs.writeFileSync(`${DAEMON_CONFIG.BASE_PATH}/s3.yaml`, yamlconfignew, 'utf8');



      return resultView(orderconfig, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  // getmarketmachineinfo
}
