export default function(tx, vueIns) {
    return {
        tx_com_hash: tx.txhash,
        height: tx.height,
        fee: fee(tx, vueIns),
        create_time: tx.timestamp,
        timestampSort: new Date(tx.timestamp).getTime(),
        txs: tx.tx.value.msg.map((msg, index) => {
            try {
                return {
                    from: getSendAddress(msg, tx, vueIns),
                    to: getToAddress(msg, tx, vueIns),
                    msg_type: msg.type,
                    action: msg.type.split('/')[1],
                    amount: getamount(msg, tx, vueIns, index),
                    valid: txlogvalid(tx, index),
                    log: txlog(tx, index),
                };
            } catch (error) {
                console.log(msg, index, tx);
                console.log(error);
            }
        }),
    };
}
function txlog(tx, index) {
    if (tx.logs) {
        return tx.logs[index] ? tx.logs[index].log : '--';
    } else {
        return '--';
    }
}

function txlogvalid(tx, index) {
    if (tx.logs) {
        return tx.logs[index] ? tx.logs[index].success : false;
    } else {
        return false;
    }
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
    if (msg.type === 'lambda/MsgCreateDigitalAssetMarket') {
        toaddress = msg.value.marketName;
    }

    if (
        msg.type === 'lambda/MsgDigitalAssetPledge' ||
        msg.type === 'lambda/MsgDigitalAssetRefund' ||
        msg.type === 'lambda/MsgDismissDigitalAssetMarket' ||
        msg.type === 'lambda/MsgActivateMiner'
    ) {
        toaddress = msg.value.assetName;
    }

    if (msg.type === 'lambda/MsgAuthorizeMiningPubKey') {
        toaddress = msg.value.assetName;
    }

    if (msg.type === 'lambda/MsgDeactivateMiner') {
        toaddress = msg.value.miner;
    }
    if (msg.type === 'lambda/MsgDamCreateBuyOrder') {
        toaddress = msg.value.minerAddress;
    }
    if (msg.type === 'lambda/MsgDamOrderRenewal') {
        toaddress = msg.value.orderID;
    }

    if (msg.type === 'lambda/MsgDamMinerWithDrawCount') {
        toaddress = msg.value.asset;
    }

    if (msg.type === 'lambda/MsgAuthorizeUser') {
        toaddress = msg.value.user;
    }
    if (msg.type === 'lambda/MsgAssetInvest') {
        toaddress = msg.value.asset;
    }

    return toaddress;
}

function getamount(msg0, item, vueIns, index) {
    console.log('getamount');
    var result;
    var _this = vueIns;
    if (msg0.value != undefined) {
        if (msg0.value.amount != undefined) {
            if (msg0.value.amount instanceof Array) {
                var list = msg0.value.amount.map(one => {
                    return _this.bigNumTypeFormat(one.amount, one.denom);
                });
                result = list.join(',');
            } else if (msg0.value.amount instanceof Object) {
                result = _this.bigNumTypeFormat(
                    msg0.value.amount.amount,
                    msg0.value.amount.denom || msg0.value.assetName
                );
            } else {
                result = _this.bigNumTypeFormat(msg0.value.amount, msg0.value.assetName);
            }
        } else if (msg0.type == 'lambda/MsgAssetDrop') {
            result =
                _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom) +
                '->' +
                _this.bigNumTypeFormat(msg0.value.token.amount, msg0.value.token.denom);
        } else if (msg0.type == 'lambda/MsgAssetPledge') {
            result =
                _this.bigNumTypeFormat(msg0.value.token.amount, msg0.value.token.denom) +
                '->' +
                _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom);
        } else if (msg0.type == 'cosmos-sdk/MsgVote') {
            result = vueIns.$t(`proposalsPage.${msg0.value.option}`);
        } else if (msg0.type == 'lambda/MsgCreateAsset') {
            result =
                _this.bigNumTypeFormat(msg0.value.token.amount, msg0.value.token.denom) +
                '->' +
                _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom) +
                ',' +
                namefunc(msg0.value.mint_type, vueIns);
            // (msg0.value.mintable ? vueIns.$t('Dialog.com.mintabletrue') : vueIns.$t('Dialog.com.mintablefalse'));
        } else if (msg0.type == 'lambda/MsgMintAsset') {
            result = _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom);
        } else if (msg0.type == 'lambda/MsgAssetInvest') {
            result = _this.bigNumTypeFormat(msg0.value.token.amount, msg0.value.token.denom);
        } else if (msg0.type == 'lambda/MsgLockAsset') {
            result =
                _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom) +
                '  ' +
                vueIns.$t('Dialog.com.locktime') +
                '  ' +
                (msg0.value.lock_duration / (1000 * 1000 * 1000 * 60 * 60 * 24)).toFixed(3) +
                '  ' +
                vueIns.$t('staking.Explain.unit');
        } else if (msg0.type == 'lambda/MsgUnLockAsset' || msg0.type == 'lambda/MsgRuinAsset') {
            result = msg0.value.symbol;
        } else if (msg0.type == 'lambda/MsgDestroyAsset') {
            result = _this.bigNumTypeFormat(msg0.value.asset.amount, msg0.value.asset.denom);
        } else if (msg0.type == 'lambda/MsgDigitalAssetPledge') {
            item.tags.forEach(item => {
                if (item.key == 'cost' && item.value) {
                    result = item.value;
                }
            });
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

function namefunc(typeitem, vueIns) {
    // vueIns.$t('Dialog.com.mintabletrue') : vueIns.$t('Dialog.com.mintablefalse'));
    console.log(typeitem);
    if (typeitem == 1) {
        return vueIns.$t('assetpage.Non-issueable');
    } else if (typeitem == 2) {
        return vueIns.$t('assetpage.One-timeadditionalissuance');
    } else {
        return vueIns.$t('assetpage.Additionalmining');
    }
}
