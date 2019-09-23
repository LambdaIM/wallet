import resultView from './result.js';
import Manager from './proposalManager.js';
var { DAEMON_CONFIG } = require('../configmain.js');
const { ipcMain: eipc } = require('electron-better-ipc');



export default function() {
  eipc.answerRenderer('proposalList', async query => {
    try {
      var M = new Manager();
      var result = await M.getProposalList(query);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('proposalInfo', async query => {
    var { id } = query;

    try {
      var M = new Manager();
      var result = await M.getProposalInfo(id);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('govDepositParameters', async query => {
    try {
      var M = new Manager();
      var result = await M.govDepositParameters();

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('proposalDeposit', async query => {
    var { id } = query;
    try {
      var M = new Manager();
      var result = await M.proposalDeposit(id);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('proposalVote', async query => {
    var { id } = query;
    try {
      var M = new Manager();
      var result = await M.proposalVote(id);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });
  eipc.answerRenderer('proposalTally', async query => {
    var { id } = query;
    try {
      var M = new Manager();
      var result = await M.proposalTally(id);

      return resultView(result, true);
    } catch (ex) {
      throw resultView(null, false, ex);
    }
  });



  // proposalDeposit
}
