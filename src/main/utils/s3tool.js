

import cmd from 'node-cmd';
import Promise from 'bluebird';
var { DAEMON_CONFIG } = require('../../configmain.js');
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
const os = require('os');

async function killS3() {
  console.log('killS3');
  try {
    var mackill = `ps -ef | grep '${DAEMON_CONFIG.LambdaSfile().replace('lamb', '[l]amb')} gateway' | awk '{print $2'} | xargs kill`;
    var winkill = `taskkill /F /IM ${DAEMON_CONFIG.LambdaSfile()}`;
    var nowos = os.platform();
    console.log(nowos);
    var nowkil = nowos == 'win32' ? winkill : mackill;
    var killresult = await getAsync(nowkil);
  } catch (error) {
    console.log(' killS3 ');
    console.log(error);
  }
}

export default {
  killS3

};
