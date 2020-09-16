<template>
    <div class="customer-container">
        <div class="tableContainer">
            <Row>
                <Col span="13">
                    &nbsp;
                </Col>
                <Col span="3">
                    <!-- <Button @click="openCreateMiner" type="primary"  size="small"> {{$t('sellpageinfo.Initializeminer')}} </Button> -->
                    &nbsp;
                </Col>
                <Col span="8">
                    <Dropdown @on-click="selectmarketClick">
                        <a href="javascript:void(0)">
                            {{ selectmarket.name }}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu v-if="marketList" slot="list">
                            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList">
                                {{ item.name }}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button @click="openSellingspace" type="primary" size="small">
                        {{ $t('marketpage.sellspacebtn') }}
                    </Button>
                </Col>
            </Row>
            <!-- <div>{{$t('marketpage.last100data')}} </div> -->
            <br />
            <Table :loading="loading" :columns="SellOrdercolumns" :data="SellOrderslist">
                <template slot-scope="{ row, index }" slot="price">
                    {{ row.price | Lambformat }}
                </template>
                <template slot-scope="{ row, index }" slot="minDuration">
                    {{ row.minDuration | formatMonth }}
                </template>
                <template slot-scope="{ row, index }" slot="rate">
                    {{ parseFloat(row.rate) }}
                </template>
                <template slot-scope="{ row, index }" slot="status">
                    <span style="color:green" v-if="row.status == '0'">
                        {{ $t('marketpage.Active') }}
                    </span>
                    <span style="color:red" v-if="row.status == '1'">
                        {{ $t('marketpage.Finish') }}
                    </span>
                </template>

                <template slot-scope="{ row, index }" slot="marketAddress">
                    {{ getmarketName(row.marketAddress) }}
                </template>

                <template slot-scope="{ row, index }" slot="operation">
                    <Button @click="cancelorder(row, getmarketName(row.marketAddress))">
                        {{ $t('sellpageinfo.Cancel') }}
                    </Button>
                </template>
            </Table>
            <br />
            <div style="text-align: center;">
                <Page @on-change="SellOrderListPage" :total="allCount" simple />
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
        <SellingspaceModal ref="Sellingspace" />
        <CreateMinerModal ref="CreateMiner" />
        <CancalorderModel ref="Cancalorder" />
    </div>
</template>
<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';
import eventhub from '../../common/js/event.js';
import CreateMinerModal from '@/views/Dialog/CreateMinerModal.vue';

import CancalorderModel from '@/views/Dialog/cancalorderModel.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');
var packagejson = require('../../../../package.json');

export default {
    data() {
        return {
            SellOrdercolumns: [
                {
                    // title: this.$t('marketpage.selltable.Mineraddress'),
                    title: this.$t('syncorderpage.orderID'),
                    key: 'orderId',
                },
                {
                    title: this.$t('marketpage.myselltable.amountspace'),
                    key: 'sellSize',
                },
                {
                    title: this.$t('marketpage.myselltable.remainingspace'),
                    key: 'unusedSize',
                },
                {
                    title: this.$t('marketpage.myselltable.unitprice'),
                    key: 'price',
                    slot: 'price',
                },
                {
                    title: this.$t('marketpage.myselltable.minimumspace'),
                    key: 'minBuySize',
                },
                {
                    title: this.$t('marketpage.myselltable.minimumduration'),
                    key: 'minDuration',
                    slot: 'minDuration',
                },
                {
                    title: this.$t('marketpage.myselltable.Odds'),
                    key: 'rate',
                    slot: 'rate',
                },
                {
                    title: this.$t('marketpage.myselltable.Marketaddress'),
                    key: 'marketAddress',
                    slot: 'marketAddress',
                },
                {
                    title: this.$t('marketpage.Status'),
                    key: 'status',
                    slot: 'status',
                },
                {
                    title: this.$t('Token.operation'),
                    key: 'operation',
                    slot: 'operation',
                },
            ],
            SellOrderslist: [],
            selectmarket: '',
            marketList: [],
            allCount: 1,
            pageCount: {},
            loading: true,
        };
    },
    mounted() {
        this.getSellOrderslist(1);
        this.getmarketlist();
        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getSellOrderslist(1);
        });
    },
    components: {
        SellingspaceModal,
        CreateMinerModal,
        CancalorderModel,
    },
    methods: {
        async getSellOrderslist(page) {
            try {
                this.$data.loading = true;
                let res = await ipc.callMain('marketSellOrderslist', {
                    page: page || 1,
                    limit: 10,
                });
                if (res.state) {
                    this.$data.SellOrderslist = res.data.data || [];
                    if (this.$data.pageCount[page] == undefined) {
                        this.$data.pageCount[page] = 1;
                        this.$data.allCount += this.$data.SellOrderslist.length;
                    }
                    this.$data.loading = false;
                }
            } catch (error) {
                this.$Message.error(this.$t('foot.linkerror'));
            }
        },
        SellOrderListPage(page) {
            console.log(page);
            this.getSellOrderslist(page);
        },
        openSellingspace() {
            this.$refs.Sellingspace.open(this.$data.selectmarket);
        },
        openCreateMiner() {
            this.$refs.CreateMiner.open();
        },
        async getmarketlist() {
            console.log('getmarketlist');
            let res = await ipc.callMain('marketlist', {});
            if (res.state) {
                this.$data.marketList = res.data.data;
                this.$data.selectmarket = this.$data.marketList[0];
            }
        },
        selectmarketClick(name) {
            console.log(name);
            var _this = this;
            this.$data.marketList.forEach(item => {
                if (name == item.name) {
                    _this.$data.selectmarket = item;
                }
            });
        },
        getmarketName(address) {
            var name = '';
            this.$data.marketList.forEach(item => {
                if (address == item.marketAddress) {
                    name = item.name;
                }
            });

            return name;
        },
        cancelorder(data, marketName) {
            this.$refs.Cancalorder.open(data, marketName);
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
        margin-top: 10px;
    }
}
.card-item {
    margin-bottom: 20px;
    .title {
        font-size: 14px;
        font-weight: 600;
    }
    .item-value {
        font-size: 14px;
    }
}
</style>
