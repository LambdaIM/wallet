var { DAEMON_CONFIG } = require('../../configmain.js');
const settings = require('electron-settings');

var datafile = DAEMON_CONFIG.DataFile + '/market.json';

var Datastore = require('nedb');
var db = new Datastore({ filename: datafile, autoload: true });

/*
{
	"address": "lambdamineroper1cn24p7x4k0thjxwg7ytgtqpdxsxtscsrg5sgrz",
	"amount": [{
		"amount": "30000000000",
		"denom": "ulamb"
	}],
	"cancelTimeDuration": "3600000000000",
	"createTime": "2019-11-05T19:16:32.793945367Z",
	"machineName": "IPFSJK",
	"marketAddress": "lambdamarketoper1thj5fv8d0dsh3aealhpxm9mvgxjfh87srk3887",
	"maxDuration": "155520000000000000",
	"minBuySize": "1",
	"minDuration": "2592000000000000",
	"orderId": "23F759DB238D3E302289F6B0FA1B8EF814610099",
	"price": "5000000",
	"rate": "3.000000000000000000",
	"reserved1": "",
	"sellSize": "2000",
	"status": "0",
	"unUseSize": "2000"
}
*/

export default class {
  insertTx(sellorderArry) {
    var address = this.defaultAddress;
    var _this = this;
    return new Promise(function (resolve, reject) {
      var newList = [];
      sellorderArry.forEach(async element => {
        var result = await _this.Checkexist(element.orderId);
        if (result) {
          newList.push(element);
        } else {
          var result2 = _this.updateTxState(element.orderId, element);
        }
      });
      db.insert(newList, function (err, newDoc) {
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        if (err == null) {
          resolve(newDoc);
        } else {
          reject(err);
        }
      });
    });
  }
  getSellOrderbymarket(marketAddress, page, limit, orderSortinfo, islocalfilter) {
    // key,
    // order
    var sortinfo = { };
    if (orderSortinfo.key != undefined && orderSortinfo.order != undefined) {
      // normal asc  desc
      if (orderSortinfo.order == 'asc') {
        sortinfo[orderSortinfo.key] = 1;
      } else if (orderSortinfo.order == 'desc') {
        sortinfo[orderSortinfo.key] = -1;
      } else {
        sortinfo = { createTime: -1 };
      }
    }
    var priceFilter = { };
    var Filterlist = [];
    console.log('priceFilter pra');
    console.log(islocalfilter);



    console.log('getSellOrderbymarket');
    console.log(sortinfo);
    console.log('priceFilter');
    console.log(priceFilter);


    return new Promise(function (resolve, reject) {
      db.find({ marketAddress: marketAddress,
        $where: function () {
          var flag = true;
          var unit = 1000000;
          if (islocalfilter.priceStart != '' && islocalfilter.priceStart != undefined) {
            if (parseInt(this.price) >= islocalfilter.priceStart * unit) {
              flag = true;
            } else {
              flag = false;
            }
          }
          if (islocalfilter.priceEnd != '' && islocalfilter.priceEnd != undefined) {
            if (parseInt(this.price) <= islocalfilter.priceEnd * unit) {
              flag = true;
            } else {
              flag = false;
            }
          }
          var rate = this.rate.split('.')[0];

          if (islocalfilter.rateStart != '' && islocalfilter.rateStart != undefined) {
            if (parseInt(rate) >= islocalfilter.rateStart) {
              flag = true;
            } else {
              flag = false;
            }
          }

          if (islocalfilter.rateEnd != '' && islocalfilter.rateEnd != undefined) {
            if (parseInt(rate) <= islocalfilter.rateEnd) {
              flag = true;
            } else {
              flag = false;
            }
          }

          // rateStart


          console.log(flag, islocalfilter);

          return flag;
        } }).sort(sortinfo).skip((page - 1) * limit).limit(limit).exec(function (err, docs) {
        if (err == null) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
    });
  }
  Checkexist(orderId) {
    return new Promise(function (resolve, reject) {
      db.find({ orderId: orderId }, function (err, docs) {
        if (err == null) {
          if (docs.length == 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          reject(err);
        }
      });
    });
  }
  updateTxState(orderId, item) {
    var address = this.defaultAddress;
    return new Promise(function (resolve, reject) {
      // Set an existing field's value
      db.update({ orderId: orderId }, item, {},
        function (err, numReplaced) {
          if (err == null) {
            resolve(true);
          } else {
            reject(err);
          }
        });
    });
  }
}
