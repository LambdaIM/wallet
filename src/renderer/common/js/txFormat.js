export default function (tx, vueIns) {
  return {
    'tx_com_hash': tx.txhash,
    'height': tx.height,
    'fee': fee(tx, vueIns),
    'create_time': tx.timestamp,
    'timestampSort': new Date(tx.timestamp).getTime(),
    'txs': tx.tx.value.msg.map((msg, index) => {
      return {
        'from': getSendAddress(msg, tx),
        'to': getToAddress(msg, tx),
        'msg_type': msg.type,
        'action': msg.type.split('/')[1],
        'amount': getamount(msg, tx, vueIns),
        'valid': tx.logs[index].success

      };
    })
  };
}



function getSendAddress(msg, item) {
  var result;
  if (msg.value.from_address != undefined) {
    result = msg.value.from_address;
  } else if (msg.value.address != undefined) {
    result = msg.value.address;
  } else {
    item.tags.forEach(item => {
      if (item.key == 'delegator') {
        result = item.value;
      }
    });
  }

  return result;
}

function getToAddress(msg, item) {
  var toaddress = msg.value.to_address || msg.value.validator_address;
  if (toaddress == undefined) {
    item.tags.forEach(item => {
      if (item.key == 'source-validator') {
        toaddress = item.value;
      }
    });
  }
  return toaddress;
}

function getamount(msg0, item, vueIns) {
  var result; var _this = vueIns;
  if (msg0.value != undefined) {
    if (msg0.value.amount != undefined) {
      if (msg0.value.amount instanceof Array) {
        var list = msg0.value.amount.map(one => {
          return _this.bigNumTypeFormat(one.amount, one.denom);
        });
        result = list.join(',');
      } else {
        result = _this.bigNumTypeFormat(msg0.value.amount.amount, msg0.value.amount.denom);
      }
    } else if (msg0.type == 'lambda/MsgAssetDrop') {
      result =
        _this.bigNumTypeFormat(msg0.value.asset.amount,
          msg0.value.asset.denom) +
        '->' +
        _this.bigNumTypeFormat(msg0.value.token.amount,
          msg0.value.token.denom);
    } else if (msg0.type == 'lambda/MsgAssetPledge') {
      result =
        _this.bigNumTypeFormat(msg0.value.token.amount,
          msg0.value.token.denom) +
        '->' +
        _this.bigNumTypeFormat(msg0.value.asset.amount,
          msg0.value.asset.denom);
    } else {
      item.tags.forEach(item => {
        if (item.key == 'rewards') {
          result = _this.bigNumAdd(item.value.replace('ulamb', ''), result);
        }
      });
      result = _this.bigNumTypeFormat(result, 'ulamb');
    }
  }
  return result;
}

function fee(item, vueIns) {
  var fee = item.tx.value.fee;
  if (fee.amount == null) {
    return '--';
  }
  return vueIns.bigNumTypeFormat(fee.amount[0].amount, fee.amount[0].denom);
}