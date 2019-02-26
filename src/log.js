var log = require('electron-log');
var {DAEMON_CONFIG} =require('./config.js')
var fs = require('graceful-fs')

if(fs.existsSync(DAEMON_CONFIG.BASE_PATH)==false) {
    fs.mkdirSync(DAEMON_CONFIG.BASE_PATH);
}

var path= DAEMON_CONFIG.BASE_PATH+'/log.log';
log.transports.file.file=path;
log.transports.file.level='debug';



module.exports.log = log
