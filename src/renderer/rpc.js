import { DAEMON_CONFIG } from "../config.js";
var dnode = require('dnode');


export default function (methdname, parameter) {
    var _this = this;


    try {
        var d = dnode.connect(DAEMON_CONFIG.RPC_PORT);
        console.log(d);
    } catch (error) {
        console.log(error);
    }
   
    return new Promise(function (resolve, reject) {
        //做一些异步操作

        try {
            d.on('remote', function (remote, conn) {

                var ss = remote[methdname](parameter, function (s) {
                    d.end();
                    resolve(s)
                });

            });
        } catch (error) {
            console.log(error);
        }
        d.on('error', function (err) {
            d.end();
            reject(err)
        })
        d.on('fail', function (fail) {
            d.end();
            reject(fail)
        })

    });


};

