import LambdaApi from './lambdaApi';

const settings = require('electron-settings');
var { DAEMON_CONFIG } = require('../configmain.js');
var log = require('../log').log;

const { throwErrorCode, errorList } = require('./throwErrorCode.js');
const hdkeyjs = require('@jswebfans/hdkeyjs');

class AssetManager {
    constructor() {
        this.defaultAddress = null;
        this.readconfig();
        this.CosmosAPI = LambdaApi();
    }
    readconfig() {
        if (settings.has('defaultwallet') != false) {
            this.defaultAddress = settings.get('defaultwallet');
            // this.defaultAddress=this.defaultAddress.toLocaleLowerCase();
        }
    }
    async Assetparameters(query) {
        console.log('Assetparameters');
        var result = await this.CosmosAPI().get.assetParameters();

        return { data: result };
    }

    async Marketparameters(query) {
        console.log('Assetparameters');
        var result = await this.CosmosAPI().get.damparams();

        return { data: result };
    }

    async AuthorizedMarketlist(query) {
        // if (this.defaultAddress == null) {
        //   throwErrorCode(errorList.need_address);
        // }
        console.log('AuthorizedMarketlist');
        var result = await this.CosmosAPI().get.dammarketlist();
        // console.log(result);
        console.log('AuthorizedMarketlist');
        return { data: result };
    }
    async Authorizedpledgelist(query) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('Authorizedpledgelist');
        var result = await this.CosmosAPI().get.dam_delegations(this.defaultAddress);

        return { data: result };
    }

    async Authorizedpledgerecords(query) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('Authorizedpledgelist');
        var MinerAddress = hdkeyjs.address.MinerAddress(this.defaultAddress);
        var result = await this.CosmosAPI().get.dam_pledgerecords(MinerAddress);

        return { data: result };
    }

    async Authorizedincomelist(query) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('Authorizedincomelist');
        var result = await this.CosmosAPI().get.Assetparameters();

        return { data: result };
    }
    async Authorizedredeemlist(query) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('Authorizedredeemlist');
        var result = await this.CosmosAPI().get.damrefunding_records(this.defaultAddress);

        return { data: result };
    }
    async matchorderlist(page, limit) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('matchorderlist');
        var result = await this.CosmosAPI().get.dammatchorders(this.defaultAddress, page, limit);

        return { data: result };
    }
    async matchdamorderinfo(orderId) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('matchorderlist');
        var result = await this.CosmosAPI().get.damorderinfo(orderId);

        return { data: result };
    }
    async damauthorized_users(asset, page, limit) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('matchorderlist');
        var result = await this.CosmosAPI().get.damauthorized_users(asset, page, limit);

        return { data: result };
    }

    async damMiner_Info() {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('matchorderlist');
        var result = await this.CosmosAPI().get.damMinerInfo(this.defaultAddress);

        return { data: result };
    }

    async damUserDelegatorRewards() {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('matchorderlist');
        var result = await this.CosmosAPI().get.damUserDelegatorRewards(this.defaultAddress);

        return { data: result };
    }

    async damassetinfo(name) {
        console.log('damassetinfo');
        var result = await this.CosmosAPI().get.damassetinfo(name);

        return { data: result };
    }

    async damAssetMintSimulate({
        assetName,
        assetiniti,
        total_supply,
        inflation,
        adjust_rate,
        adjust_period,
        max_adjust_count,
        genesis_height,
    }) {
        console.log('damAssetMintSimulate');
        var result = await this.CosmosAPI().get.damassetmintsimulate({
            assetName,
            assetiniti,
            total_supply,
            inflation,
            adjust_rate,
            adjust_period,
            max_adjust_count,
            genesis_height,
        });

        return { data: result };
    }

    async fileRceiver(page, limit) {
        if (this.defaultAddress == null) {
            throwErrorCode(errorList.need_address);
        }
        console.log('fileRceiver');
        var result = await this.CosmosAPI().get.damfileReceiver(this.defaultAddress, page, limit);

        return { data: result };
    }
}

export default AssetManager;
