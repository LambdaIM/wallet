<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Alert type="warning">{{ $t('damindex.orderlisttip') }}</Alert>
                <Table :columns="matchordercolumns" :data="matchorderdata">
                    <template slot-scope="{ row, index }" slot="operation">
                        <Button @click="pageto(row)" type="primary" size="small">
                            {{ $t('Matchorders.list.Details') }}
                        </Button>
                    </template>

                    <template slot-scope="{ row, index }" slot="price">
                        {{ row.price | BlanceValue }}
                    </template>

                    <template slot-scope="{ row, index }" slot="category">
                        {{ orderType(row.buyAddress) }}
                    </template>

                    <template slot-scope="{ row, index }" slot="asset">
                        {{ denomFormart(row.asset) }}
                    </template>

                    <template slot-scope="{ row, index }" slot="createTime">
                        {{ row.createTime | blockFormatDate }}
                    </template>
                </Table>
                <br />
                <div style="text-align: center;">
                    <Page @on-change="orderListPage" :total="allCount" simple />
                </div>
                <br />
                <br />
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';

const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            matchordercolumns: [
                {
                    title: this.$t('Matchorders.list.Orderid'),
                    key: 'orderId',
                },
                {
                    title: this.$t('Matchorders.list.AssetName'),
                    key: 'asset',
                    slot: 'asset',
                },
                {
                    title: this.$t('Matchorders.list.Size'),
                    key: 'size',
                },
                {
                    title: this.$t('Matchorders.list.price'),
                    key: 'price',
                    slot: 'price',
                },
                {
                    title: this.$t('Matchorders.list.Startingtime'),
                    key: 'createTime',
                    slot: 'createTime',
                },
                {
                    title: this.$t('Matchorders.list.category'),
                    key: 'category',
                    slot: 'category',
                },
                {
                    title: this.$t('Matchorders.list.operating'),
                    key: 'operation',
                    slot: 'operation',
                },
            ],
            matchorderdata: [],
            allCount: 1,
            pageCount: {},
        };
    },
    mounted() {
        this.getmatchorderlist(1);
    },
    methods: {
        denomFormart(denom) {
            return denom.substr(1);
        },
        async getmatchorderlist(page) {
            console.log('getmatchorderlist');
            try {
                let res = await ipc.callMain('Authorizematchorderlist', {
                    page,
                    limit: 10,
                });
                if (res.state) {
                    var list = res.data.data || [];
                    var result = '';

                    this.$data.matchorderdata = list;
                    if (this.$data.pageCount[page] == undefined) {
                        this.$data.pageCount[page] = 1;
                        this.$data.allCount += list.length;
                    }
                }
            } catch (ex) {
                console.log(ex);
            }
            console.log('getListDataEnd');
        },
        orderType(buyaddress) {
            var address = this.$store.getters.getaddress;
            if (buyaddress == address) {
                return this.$t('Matchorders.list.buy');
            } else {
                return this.$t('Matchorders.list.sell');
            }
        },
        orderListPage(number) {
            this.getmatchorderlist(number);
        },
        pageto(item) {
            console.log('**************');
            this.$router.push(`/marketindexmenu/orderdetails/${item.orderId}`);
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
