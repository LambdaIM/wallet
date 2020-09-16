<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Table :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="Amount">
                        {{ bigNumTypeFormat(row.Amount, row.Asset) }}
                    </template>
                    <template slot-scope="{ row, index }" slot="operation">
                        <Button @click="Redemptionoperation(row)" type="primary">{{ $t('Pledgepopup.redeem') }}</Button>
                    </template>
                </Table>
                <br />
                <!-- <div style="text-align: center;">
                    <Page @on-change="orderListPage" :total="allCount" simple />
                </div> -->
                <br />
                <br />
            </div>
            <s3 ref="s3Modal" :orderid="orderid"></s3>
            <AssetUserPledge ref="AssetUserPledgeModal" />
            <AuthorizedredeemDialog ref="AuthorizedredeemModal" />
        </div>
    </div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';

import AuthorizedredeemDialog from '@/views/Dialog/Authorizedredeem.vue';

import AssetUserPledge from '@/views/Dialog/assetUserPledge.vue';

const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const hdkeyjs = require('@jswebfans/hdkeyjs');

export default {
    components: {
        s3: () => import('../../components/s3/S3.vue'),
        AuthorizedredeemDialog,
        AssetUserPledge,
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.$t('assetnewtxt.Pledgelist'),
                    key: 'MinerAddress',
                },
                {
                    title: this.$t('assetnewtxt.Marketassets'),
                    key: 'Asset',
                },
                {
                    title: this.$t('assetnewtxt.amount'),
                    key: 'Amount',
                    slot: 'Amount',
                },
                {
                    title: this.$t('assetnewpage.operation'),
                    key: 'operation',
                    slot: 'operation',
                },
            ],
            orderid: '',
            allCount: 1,
            pageCount: {},
        };
    },
    mounted() {
        this.getlist(1);
        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getlist(1);
        });
    },
    methods: {
        async getlist(page) {
            // assetAll
            console.log('getlist');
            try {
                let res = await ipc.callMain('Authorizedpledgelist', {
                    page: page,
                });
                if (res.state && res.data.data.error == undefined) {
                    // .tx.value.msg[0].value
                    var result = res.data.data || [];

                    this.$data.list = result;
                    if (this.$data.pageCount[page] == undefined) {
                        this.$data.pageCount[page] = 1;
                        this.$data.allCount += result.length;
                    }
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        openS3(row) {
            this.$data.orderid = row.orderID;

            this.$refs.s3Modal.openDialog();
        },
        orderListPage(number) {
            this.getlist(number);
        },
        Redemptionoperation(row) {
            var mineraddress = hdkeyjs.address.MinerAddress(this.$store.getters.getaddress);

            console.log(mineraddress);
            console.log(row.MinerAddress);
            if (mineraddress == row.MinerAddress) {
                // 质押到市场
                // this.$refs.AuthorizedpledgeModal.open({assetName:row.Asset});
                this.$refs.AuthorizedredeemModal.open({ assetName: row.Asset });
            } else {
                // 质押到矿工
                this.$refs.AssetUserPledgeModal.open({ assetName: row.Asset, MinerAddress: row.MinerAddress });
            }
        },
    },
};
</script>
<style lang="less" scoped>
.customer-container {
    .container {
        margin-top: 40px;
    }
    .tableContainer {
        width: 94%;
        margin: 0 auto;
        margin-top: 40px;
    }
}
</style>
