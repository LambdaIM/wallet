import resultView from './result.js';
import Manager from './marketmanager.js';
import Promise from 'bluebird';
import cmd from 'node-cmd';
import fs from 'graceful-fs';
import { app } from 'electron';
var { DAEMON_CONFIG } = require('../configmain.js');
const { ipcMain: eipc } = require('electron-better-ipc');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

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
      var appPath = app.getPath('exe');

      if (fs.existsSync(`${DAEMON_CONFIG.BASE_PATH}/lamb`) == false) {
        fs.createReadStream(`${__static}/lamb`).pipe(fs.createWriteStream(`${DAEMON_CONFIG.BASE_PATH}/lamb`));
        const result = await getAsync(`chmod 777  ${DAEMON_CONFIG.BASE_PATH}/lamb `);
      }
      /// chmod 751 file

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



  // getMinermachines
}
