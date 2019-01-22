
const os =require('os');
const path = require('path');
let BASE_PATH = path.join(os.homedir(), 'lambWallet');

//homedir  系统默认的文件存储路径

module.exports.DAEMON_CONFIG  = {
    RPC_PORT:8084,
    BASE_PATH:BASE_PATH
};
