<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <div style="    text-align: right;">
                    <Button v-if="$role('conlist.Createassets')" @click="openCreateAssert" type="primary">
                        {{ $t('assetpage.Createassets') }}
                    </Button>
                </div>
                <br />
                <Table :loading="loading" :columns="columnsToken" :data="coinList">
                    <template slot-scope="{ row, index }" slot="name">
                        {{ denomFormart(row.name) }}
                    </template>
                    <template slot-scope="{ row, index }" slot="amount">
                        <!-- {{row}} -->

                        {{ bigNumTypeFormat(row.amount, row.asset.denom) }}
                    </template>

                    <template slot-scope="{ row, index }" slot="denom">
                        <a
                            v-if="row.asset.denom != 'ulamb' && row.asset.denom != 'utbb'"
                            @click="openLinkassert(row.asset.denom)"
                        >
                            {{ denomFormart(row.asset.denom) }}
                        </a>
                        <span v-else>
                            {{ denomFormart(row.asset.denom) }}
                        </span>
                    </template>

                    <template slot-scope="{ row, index }" slot="assetamount">
                        {{ bigNumTypeFormat(row.asset.amount, row.asset.denom) }}
                    </template>

                    <template slot-scope="{ row, index }" slot="mint_type">
                        {{ typeName(row.mint_type) }}
                    </template>

                    <template slot-scope="{ row, index }" slot="total_supply">
                        <span v-if="row.total_supply">
                            {{ bigNumTypeFormat(row.total_supply.amount, row.total_supply.denom) }}
                        </span>
                    </template>
                    <template slot-scope="{ row, index }" slot="inflation">
                        <span v-if="row.inflation">
                            {{ bigNumTypeFormat(row.inflation, row.asset.denom) }}
                        </span>
                    </template>

                    <template slot-scope="{ row, index }" slot="power">
                        {{ findminingPower(row.assetName) }}
                    </template>

                    <template slot-scope="{ row, index }" slot="adjust_rate">
                        <span v-if="row.adjust_rate">
                            {{ parseFloat(row.adjust_rate) }}
                        </span>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <Button class="smallbtn" @click="cointransaction(row)" type="primary" size="small">
                            {{ $t('home.Token.Transfer') }}
                        </Button>

                        <Button
                            class="smallbtn"
                            v-if="row.asset.denom == 'ulamb'"
                            @click="openAssert(row)"
                            size="small"
                        >
                            {{ $t('home.Token.Exchange') }}
                        </Button>

                        <Button
                            v-if="checkstatus(row)"
                            class="smallbtn"
                            :to="`/marketindexmenu/assetinfo/${row.asset.denom}`"
                            size="small"
                        >
                            预挖矿
                        </Button>

                        <!--
               <Dropdown v-if="row.denom !='ulamb'&&row.denom !='utbb'  "   class="smallbtn2">
                    <a  href="javascript:void(0)">
                        更多
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem>增发资产</DropdownItem>
                        <DropdownItem>锁定资产</DropdownItem>
                        <DropdownItem>解锁资产</DropdownItem>
                        <DropdownItem divided>销毁资产</DropdownItem>
                        <DropdownItem divided>毁灭资产</DropdownItem>
                    </DropdownMenu>
                </Dropdown> -->
                    </template>
                </Table>
            </div>
            <br />
            <br />
            <br />
            <br />
            <SendModelDialog ref="SendModelDialog" />
            <AssetlModalDialog ref="AssetlModalDialog" />
            <CreateAssetModalDialog ref="CreateAssetModal" />
        </div>
    </div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';

import CreateAssetModalDialog from '@/views/Dialog/CreateAssetModal.vue';
import SendModelDialog from '@/views/Dialog/sendModel.vue';
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            loading: true,
            columnsToken: [
                {
                    title: this.$t('assetpage.assetlist.fullname'),
                    key: 'name',
                    slot: 'name',
                },
                {
                    title: this.$t('home.Token.name'),
                    key: 'denom',
                    slot: 'denom',
                },
                {
                    title: this.$t('assetpage.assetlist.balance'),
                    key: 'amount',
                    slot: 'amount',
                },
                {
                    title: this.$t('home.Token.operation'),
                    key: 'action',
                    slot: 'action',
                },
                {
                    title: this.$t('assetpage.assetlist.Initialcirculation'),
                    key: 'assetamount',
                    slot: 'assetamount',
                },
                {
                    title: this.$t('assetpage.assetlist.Issuingtype'),
                    key: 'mint_type',
                    slot: 'mint_type',
                },
                {
                    title: this.$t('assetpage.assetlist.Totalissuance'),
                    key: 'total_supply',
                    slot: 'total_supply',
                },
                {
                    title: this.$t('assetpage.assetlist.Issuanceperblock'),
                    key: 'inflation',
                    slot: 'inflation',
                },
                // {
                //   title: '减产系数',
                //   key: 'adjust_rate',
                //   slot: 'adjust_rate'
                // },
                // {
                //   title: '最大减产次数',
                //   key: 'max_adjust_count'
                // },
                // {
                //   title: '初次增发块高',
                //   key: 'genesis_height'
                // }
            ],
            allassert: [],
        };
    },
    components: {
        CreateAssetModalDialog,
        SendModelDialog,
        AssetlModalDialog,
    },
    mounted() {
        this.getAssertAll();
        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getAssertAll();
        });
        this.Interval = setInterval(() => {
            this.getAssertAll();
        }, 1000 * 15);
    },
    beforeDestroy() {
        clearInterval(this.$data.Interval);
    },
    methods: {
        denomFormart(denom) {
            return denom.substr(1);
        },
        typeName(item) {
            if (item == 1) {
                return this.$t('assetpage.Non-issueable');
            } else if (item == 2) {
                return this.$t('assetpage.One-timeadditionalissuance');
            } else if (item == 3) {
                return this.$t('assetpage.Additionalmining');
            }
        },
        checkstatus(row) {
            if (row.mint_type == '3' && row.status == 0) {
                return true;
            } else {
                return false;
            }
        },
        async getAssertAll() {
            // assetAll
            try {
                let res = await ipc.callMain('assetAll', {});
                if (res.state) {
                    this.$data.allassert = res.data || [];
                    this.$data.loading = false;
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        openAssert(row) {
            this.$refs.AssetlModalDialog.open(row.amount, row.denom);
        },
        openCreateAssert() {
            this.$refs.CreateAssetModal.open();
        },
        cointransaction(row) {
            this.$refs.SendModelDialog.open(row.amount || '0', row.asset.denom);
        },
        openLinkassert(name) {
            // var explorer = DAEMON_CONFIG.explore();
            // let url = `${explorer}#/assetDetail/${name}`;
            // shell.openExternal(url);
            this.$router.push(`/marketindexmenu/assetinfo/${name}`);
        },
        openLinkmarket(name) {
            var explorer = DAEMON_CONFIG.explore();
            let url = `${explorer}#/assetMarket/${name}`;
            shell.openExternal(url);
        },
    },
    computed: {
        coinList: function() {
            if (this.$data.allassert.length < 1) {
                return [];
            }
            var mycoinList = this.$store.getters.getcoinList;
            if (mycoinList.length == 0) {
                mycoinList = mycoinList.concat([
                    {
                        amount: '0',
                        denom: 'ulamb',
                    },
                    {
                        amount: '0',
                        denom: 'utbb',
                    },
                ]);
            }

            var otherList = [];
            console.log(mycoinList);

            var _this = this;
            mycoinList.forEach(item => {
                var haveitem = _.find(_this.$data.allassert, function(assert) {
                    if (assert.asset.denom == item.denom) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if (haveitem == undefined || haveitem.length == 0) {
                    otherList.push({
                        amount: item.amount,
                        name: item.denom,
                        asset: {
                            denom: item.denom,
                        },
                    });
                } else {
                    haveitem.amount = item.amount;
                }
            });

            var listneedtosort = _this.$data.allassert.concat(otherList);
            // var listneedtosort = otherList;

            listneedtosort.forEach(item => {
                if (item.asset.denom == 'ulamb') {
                    item.sort = 1;
                } else if (item.asset.denom == 'utbb') {
                    item.sort = 0;
                } else if (item.amount == undefined) {
                    item.sort = -2;
                } else {
                    item.sort = -1;
                }
            });

            return listneedtosort.sort(function(n, m) {
                if (m.sort < n.sort) return -1;
                else if (m.sort > n.sort) return 1;
                else return 0;
            });
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

.smallbtn {
    margin-bottom: 10px;
    margin-right: 10px;
    margin-top: 10px;
    width: 100%;
}

.smallbtn2 {
    margin-bottom: 10px;
    margin-right: 10px;
    margin-top: 10px;
}
</style>
