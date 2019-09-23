export default function (tx, vueIns) {
  return {
    'tx_com_hash': tx.txhash,
    'height': tx.height,
    'fee': fee(tx, vueIns),
    'create_time': tx.timestamp,
    'timestampSort': new Date(tx.timestamp).getTime(),
    'txs': tx.tx.value.msg.map((msg, index) => {
      try {
        return {
          'from': getSendAddress(msg, tx),
          'to': getToAddress(msg, tx),
          'msg_type': msg.type,
          'action': msg.type.split('/')[1],
          'amount': getamount(msg, tx, vueIns),
          'valid': tx.logs[index] ? tx.logs[index].success : false,
          'log': tx.logs[index] ? tx.logs[index].log : '--'

        };
      } catch (error) {
        console.log(msg, index, tx);
        console.log(error);
      }
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
      if (item.key == 'delegator' || item.key == 'sender') {
        result = item.value;
      }
    });
  }

  return result;
}

function getToAddress(msg, item) {
  var toaddress = msg.value.to_address || msg.value.validator_dst_address || msg.value.validator_address;
  if (msg.type === 'cosmos-sdk/MsgSubmitProposal') {
    toaddress = msg.value.content.value.title;
  }

  if (toaddress == undefined) {
    item.tags.forEach(item => {
      if (item.key == 'source-validator') {
        toaddress = item.value;
      }
      if (item.key == 'proposal_id') {
        toaddress = '提案编号：' + item.value;
      }
    });
  }
  return toaddress;
}

function getamount(msg0, item, vueIns) {
  console.log('||---||');
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
    } else if (msg0.type == 'cosmos-sdk/MsgVote') {
      result = msg0.value.option;
    } else {
      item.tags.forEach(item => {
        if (item.key == 'rewards' && item.value) {
          result = _this.bigNumAdd(item.value.replace('ulamb', ''), result);
        }
        if (item.key == 'commission' && item.value) {
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
