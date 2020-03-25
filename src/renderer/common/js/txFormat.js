export default function (tx, vueIns) {
  return {
    'tx_com_hash': tx.txhash,
    'height': tx.height,
    'fee': fee(tx, vueIns),
    'create_time': tx.timestamp,
    'timestampSort': new Date(tx.timestamp).getTime(),
    'msg': tx.tx.value.msg,
    'logs': tx.logs
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

function getToAddress(msg, item, vuethis) {
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
        toaddress = vuethis.$t(`proposalsPage.ProposalID`) + ':' + item.value;
      }
    });
  }
  return toaddress;
}

function getamount(msg0, item, vueIns, index) {
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
      result = vueIns.$t(`proposalsPage.${msg0.value.option}`);
    } else if (msg0.type == 'lambda/MsgCreateAsset') {
      result = _this.bigNumTypeFormat(msg0.value.token.amount,
        msg0.value.token.denom) +
      '->' + _this.bigNumTypeFormat(msg0.value.asset.amount,
        msg0.value.asset.denom) + ',' +
        (msg0.value.mintable ? vueIns.$t('Dialog.com.mintabletrue') : vueIns.$t('Dialog.com.mintablefalse'));
    } else if (msg0.type == 'lambda/MsgMintAsset') {
      result = _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom);
    } else if (msg0.type == 'lambda/MsgLockAsset') {
      result = _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom) +
             '  ' + vueIns.$t('Dialog.com.locktime') + '  ' + (msg0.value.lock_duration / (1000 * 1000 * 1000 * 60 * 60 * 24)).toFixed(3) +
             '  ' + vueIns.$t('staking.Explain.unit');
    } else if (msg0.type == 'lambda/MsgUnLockAsset' || msg0.type == 'lambda/MsgRuinAsset') {
      result = msg0.value.symbol;
    } else if (msg0.type == 'lambda/MsgDestroyAsset') {
      result = _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom);
    } else {
      var indexNative = 0;
      item.tags.forEach(item => {
        if (item.key == 'rewards' && item.value) {
          if (indexNative == index) {
            result = _this.bigNumAdd(item.value.replace('ulamb', ''), result);
          }

          indexNative++;
        }
        if (item.key == 'miner_rewards' && item.value) {
          if (indexNative == index) {
            result = _this.bigNumAdd(item.value.replace('ulamb', ''), result);
          }

          indexNative++;
        }
        if (item.key == 'withdrawMiner' && item.value) {
          if (indexNative == index) {
            result = _this.bigNumAdd(item.value.replace('ulamb', ''), result);
          }

          indexNative++;
        }
        if (item.key == 'commission' && item.value) {
          if (indexNative == index) {
            result = _this.bigNumAdd(item.value.replace('ulamb', ''), result);
          }
          indexNative++;
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
