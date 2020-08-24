import LambdaApi from './lambdaApi';

import fetch from './utils/fetch';
import resultView from './result.js';
import AssetManager from './AssetManager.js';
const { app } = require('electron');

var log = require('../log').log;
const { ipcMain: eipc } = require('electron-better-ipc');

var { DAEMON_CONFIG } = require('../configmain.js');

const { throwErrorCode, errorList } = require('./throwErrorCode.js');

export default function() {
    eipc.answerRenderer('Assetparameters', async query => {
        try {
            var M = new AssetManager();

            var result = await M.Assetparameters();
            return { data: result, state: true };
        } catch (error) {
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('Marketparameters', async query => {
        try {
            var M = new AssetManager();

            var result = await M.Marketparameters();
            return { data: result, state: true };
        } catch (error) {
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('Authorizedpledgelist', async query => {
        try {
            var M = new AssetManager();
            var result = await M.Authorizedpledgelist();
            return { data: result, state: true };
        } catch (error) {
            return { data: error, state: false };
        }
    });
    eipc.answerRenderer('Authorizedpledgerecords', async query => {
        try {
            var M = new AssetManager();
            var result = await M.Authorizedpledgerecords();
            return { data: result, state: true };
        } catch (error) {
            return { data: error, state: false };
        }
    });
    eipc.answerRenderer('Authorizedincomelist', async query => {
        try {
            var M = new AssetManager();
            var result = await M.Authorizedincomelist();
            return { data: result, state: true };
        } catch (error) {
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('Authorizedmarketlist', async query => {
        try {
            var M = new AssetManager();
            var result = await M.AuthorizedMarketlist();
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('Authorizedredeemlist', async query => {
        try {
            var M = new AssetManager();
            var result = await M.Authorizedredeemlist();
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('Authorizematchorderlist', async query => {
        let { page, limit } = query;

        if (page == undefined) {
            throw resultView(null, false, errorList.need_page);
        }

        if (limit == undefined) {
            throw resultView(null, false, errorList.need_limit);
        }

        try {
            var M = new AssetManager();
            var result = await M.matchorderlist(page, limit);
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('Authorizematchdamorderinfo', async query => {
        let { orderId } = query;
        if (orderId == undefined) {
            throw resultView(null, false, errorList.need_orderId);
        }
        try {
            var M = new AssetManager();
            var result = await M.matchdamorderinfo(orderId);
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('damAssetMintSimulate', async query => {
        let {
            assetName,
            assetiniti,
            total_supply,
            inflation,
            adjust_rate,
            adjust_period,
            max_adjust_count,
            genesis_height,
        } = query;
        if (
            assetName == undefined ||
            assetiniti == undefined ||
            total_supply == undefined ||
            inflation == undefined ||
            adjust_rate == undefined ||
            max_adjust_count == undefined ||
            genesis_height == undefined
        ) {
            throw resultView(null, false, errorList.need_orderId);
        }
        try {
            var M = new AssetManager();
            var result = await M.damAssetMintSimulate({
                assetName,
                assetiniti,
                total_supply,
                inflation,
                adjust_rate,
                adjust_period,
                max_adjust_count,
                genesis_height,
            });
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('AuthorizefileRceiver', async query => {
        let { page } = query;
        if (page == undefined) {
            throw resultView(null, false, errorList.need_page);
        }
        try {
            var M = new AssetManager();
            var result = await M.fileRceiver(page, 10);
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('damauthorized_users', async query => {
        let { page, asset } = query;
        if (page == undefined) {
            throw resultView(null, false, errorList.need_page);
        }
        try {
            var M = new AssetManager();
            var result = await M.damauthorized_users(asset, page, 10);
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });

    eipc.answerRenderer('damMinerInfo', async query => {
        try {
            var M = new AssetManager();
            var result = await M.damMiner_Info();
            return { data: result, state: true };
        } catch (error) {
            console.log(error);
            return { data: error, state: false };
        }
    });
}
