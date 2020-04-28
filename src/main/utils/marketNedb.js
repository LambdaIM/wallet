var { DAEMON_CONFIG } = require('../../configmain.js');
const settings = require('electron-settings');

var datafile = DAEMON_CONFIG.DataFile + '/market.json';

var Datastore = require('nedb');
var db = new Datastore({ filename: datafile, autoload: true });



export default class {
  insertTx(sellorderArry) {
    var address = this.defaultAddress;
    var _this = this;

    // global.lambNodeinfo.network

    return new Promise(function (resolve, reject) {
      var newList = [];
      sellorderArry.forEach(async element => {
        element.sellSize = Number(element.sellSize);
        element.price = Number(element.price);
        element.unUseSize = Number(element.unUseSize);
        element.network = global.__lambNodeinfo.network;

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
        network: global.__lambNodeinfo.network,
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
          if (flag && islocalfilter.priceEnd != '' && islocalfilter.priceEnd != undefined) {
            if (parseInt(this.price) <= islocalfilter.priceEnd * unit) {
              flag = true;
            } else {
              flag = false;
            }
          }
          var rate = this.rate.split('.')[0];

          if (flag && islocalfilter.rateStart != '' && islocalfilter.rateStart != undefined) {
            if (parseInt(rate) >= islocalfilter.rateStart) {
              flag = true;
            } else {
              flag = false;
            }
          }

          if (flag && islocalfilter.rateEnd != '' && islocalfilter.rateEnd != undefined) {
            if (parseInt(rate) <= islocalfilter.rateEnd) {
              flag = true;
            } else {
              flag = false;
            }
          }
          if (flag && islocalfilter.storagenode != '' && islocalfilter.storagenode != undefined) {
            if (this.address.toLowerCase().indexOf(islocalfilter.storagenode.toLowerCase()) > -1) {
              flag = true;
            } else {
              flag = false;
            }
          }

          if (flag && islocalfilter.orderid != '' && islocalfilter.orderid != undefined) {
            if (this.orderId.toLowerCase().indexOf(islocalfilter.orderid.toLowerCase()) > -1) {
              flag = true;
            } else {
              flag = false;
            }
          }

          if (flag && islocalfilter.statusType) {
            if (this.status == islocalfilter.statusType) {
              flag = true;
            } else {
              flag = false;
            }
          }

          // storagenode

          // rateStart
          // console.log('rate:', rate);


          // console.log(flag, islocalfilter);

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
      db.find({ orderId: orderId, network: global.__lambNodeinfo.network }, function (err, docs) {
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
      db.update({ orderId: orderId, network: global.__lambNodeinfo.network }, item, { multi: true },
        function (err, numReplaced) {
          if (err == null) {
            resolve(true);
          } else {
            reject(err);
          }
        });
    });
  }
  cleardata(marketAddress) {
    return new Promise(function (resolve, reject) {
      db.remove({ network: global.__lambNodeinfo.network, marketAddress: marketAddress },
        { multi: true },
        function (err, numRemoved) {
          if (err == null) {
            resolve(true);
          } else {
            reject(err);
          }
        });
    });
  }
}
