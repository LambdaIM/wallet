

var log = require('../log').log;

export default function(result, state, errormsg, errorcode) {
  if (errormsg != undefined) {
    log.error(errormsg);
  }
  var msg = errormsg instanceof Error ? errormsg.message : errormsg;
  var msgJson = null;
  var msgcode = null;
  var msginfo = null;
  var errorType = null;
  console.log('开始格式化处理错误信息');
  console.log(errormsg);
  console.log(msg);
  try {
    console.log('开始格式化处理错误信息1');
    msgJson = JSON.parse(msg);
    if (msgJson.code && msgJson.message) {
      msginfo = msgJson.message + '！！！！';
      msgcode = msgJson.code;
      errorType = msgJson.errorType;
      // 根据这个做多语言
    }
  } catch (ex) {
    console.log('开始格式化处理错误信息1 异常');
  }
  return {
    data: result,
    state: state,
    errorcode: errorcode || msgcode,
    errormsg: msginfo
  };
}
