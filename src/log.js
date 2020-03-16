var log = require('electron-log');
var {DAEMON_CONFIG} =require('./configmain.js')


var path= DAEMON_CONFIG.LogFile+'/log.log';
log.transports.file.file=path;
log.transports.file.level='debug';

// console.log(path)
global.__log = log;
module.exports.log = log
