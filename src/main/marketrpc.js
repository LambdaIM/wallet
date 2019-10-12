import resultView from './result.js';
import Manager from './marketmanager.js';
var { DAEMON_CONFIG } = require('../configmain.js');
const { ipcMain: eipc } = require('electron-better-ipc');



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
    try {
      var M = new Manager();
      var result = await M.getOrderList(query);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
}
