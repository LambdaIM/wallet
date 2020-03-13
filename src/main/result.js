

// const langmsg = require('./lang/index.js');
import langmsg from './lang/index.js';
var log = require('../log').log;
const settings = require('electron-settings');

export default function(result, state, errormsg, errorcode) {
  if (errormsg != undefined) {
    log.error(errormsg);
  }
  var language = settings.get('set.language') || 'en';

  var msg = errormsg instanceof Error ? errormsg.message : errormsg;
  var msgJson = null;
  var msgcode = null;
  var msginfo = null;
  var errorType = null;
  var othermsg = '';
  console.log('开始格式化处理错误信息', language);
  console.log('errormsg', errormsg);
  console.log('msg', msg);
  if (msg) {
    try {
      console.log('开始格式化处理错误信息1');
      msgJson = JSON.parse(msg);
      if (msgJson.code && msgJson.message) {
        msginfo = msgJson.message;
        msgcode = msgJson.code;
        othermsg = msgJson.othermsg || '';

        errorType = msgJson.errorType;


        var objlanglist = langmsg[language];
        console.log('objlanglist', objlanglist);
        if (objlanglist != undefined) {
          try {
            msginfo = objlanglist[errorType] + othermsg;
          } catch (error) {
            msginfo = errorType;
          }
        }
        // 根据这个做多语言
      }
    } catch (ex) {
      console.log('开始格式化处理错误信息1 异常');
      msginfo = msg;
    }
  }

  return {
    data: result,
    state: state,
    errorcode: errorcode || msgcode,
    errormsg: msginfo
  };
}
