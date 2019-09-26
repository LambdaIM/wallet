import fetch from './utils/fetch.js';
var log = require('../log').log;
const { shell } = require('electron');
const { dialog } = require('electron');
const settings = require('electron-settings');
var packageJson = require('../../package.json');



export default async function(isstartup) {
  console.log('dialog');
  console.log(fetch);
  try {
    var language = settings.get('set.language') || 'en';

    var result = await fetch('https://lambdaim.github.io/launch/version/wallet.json?t=' + (new Date()).getTime());
    if (result.status != 200) {
      return;
    }
    var data = await result.json();
    console.log(data);

    var title = {
      en: "There's a new version, version number",
      zh: '有新的版本了,版本号'
    };
    var Determine = {
      zh: '确定',
      en: 'Confirm'
    };
    var Cancellation = {
      zh: '取消',
      en: 'Cancel'
    };
    var msgtip = {
      zh: '钱包版本已经是最新的',
      en: 'The wallet version is already the latest version'
    };
    if (packageJson.version == data.version) {
      console.log('**********');
      console.log(isstartup);
      console.log('**********');
      if (isstartup == false) {
        dialog.showMessageBoxSync({
          type: 'info',
          message: msgtip[language]

        });
      }

      return;
    }

    var flag = dialog.showMessageBoxSync({
      type: 'info',
      message: `${title[language]}${data.version}`,
      detail: data.brief[language],
      buttons: [Determine[language], Cancellation[language]]
    });
    if (flag == 0) {
      shell.openExternal(data.url);
    }
  } catch (error) {
    console.log(error);
    log.info('wallet version');
    log.info(error);
  }
}
