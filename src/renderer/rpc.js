import { DAEMON_CONFIG } from "../config.js";
var dnode = require('dnode');


  export default function(methdname,parameter){
    var _this=this;
     var d = dnode.connect(DAEMON_CONFIG.RPC_PORT);
    return  new Promise(function(resolve, reject){
        //做一些异步操作
        d.on('remote', function (remote,conn) {
          
            var ss= remote[methdname](parameter, function (s) {
                d.end();
                resolve(s)
            });
            
        });
        d.on('error',function(err){
            d.end();
            reject(err)
        })
        d.on('fail',function(fail){
            d.end();
            reject(fail)
        })
        
    });
     

  };

