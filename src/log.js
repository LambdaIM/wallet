var log = require('electron-log');
var {DAEMON_CONFIG} =require('./config.js')


var path= DAEMON_CONFIG.BASE_PATH+'/log.log';
log.transports.file.file=path;
log.transports.file.level='debug';

console.log(path)

module.exports.log = log
