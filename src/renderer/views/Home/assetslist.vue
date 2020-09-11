<template>
    <div class="customer-container">
        <div class="tableContainer">
            <Table :loading="loading" :columns="columnsToken" :data="coinList">
                <template slot-scope="{ row, index }" slot="amount">
                    {{ bigNumTypeFormat(row.amount, row.denom) }}
                </template>
                <template slot-scope="{ row, index }" slot="denom">
                    <a v-if="row.denom != 'ulamb' && row.denom != 'utbb'" @click="openLinkassert(row.denom)">
                        {{ denomFormart(row.denom) }}
                    </a>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button @click="cointransaction(row)" type="primary" size="small">
                        {{ $t('home.Token.Transfer') }}
                    </Button>

                    <Button v-if="row.denom == 'ulamb'" @click="openAssert(row)" size="small">
                        {{ $t('home.Token.Exchange') }}
                    </Button>
                </template>
                <template slot-scope="{ row, index }" slot="pledge">
                    <span v-if="row.denom != 'utbb'">
                        {{ findpledgeAsset(row.denom) }}
                    </span>
                    <span v-else>
                        {{ getPledgetbb }}
                    </span>
                </template>
                <template slot-scope="{ row, index }" slot="pledgereward">
                    <span v-if="row.denom != 'utbb'">
                        {{ findpledgereward(row.denom) }}
                    </span>
                    <span v-else>
                        {{ DistributionReward | BlanceValue }}
                        {{ DistributionReward == '0' ? '' : 'LAMB' }}
                    </span>
                </template>
                <template v-if="checkstatus(row)" slot-scope="{ row, index }" slot="operating">
                    <Button :to="`/marketindexmenu/assetinfo/${row.denom}`" type="primary" size="small">预挖矿</Button>
                </template>
            </Table>
        </div>
        <SendModelDialog ref="SendModelDialog" />
        <AssetlModalDialog ref="AssetlModalDialog" />
    </div>
</template>
<script>
import SendModelDialog from '@/views/Dialog/sendModel.vue';
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
import _ from 'underscore';
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            loading: true,
            columnsToken: [
                {
                    title: this.$t('home.Token.name'),
                    key: 'denom',
                    slot: 'denom',
                },
                {
                    title: '状态',
                    key: 'pledgereward',
                    slot: 'pledgereward',
                },
                {
                    title: this.$t('home.Token.amount'),
                    key: 'amount',
                    slot: 'amount',
                },
                {
                    title: this.$t('home.Token.operation'),
                    key: 'action',
                    slot: 'action',
                },
                {
                    title: this.$t('damindex.Pledgeamount'),
                    key: 'pledge',
                    slot: 'pledge',
                },
                {
                    title: this.$t('damindex.Pledgereward'),
                    key: 'pledgereward',
                    slot: 'pledgereward',
                },
                {
                    title: 'Defi',
                    key: 'operating',
                    slot: 'operating',
                },
            ],
            allassert: [],
            pledgerecords: [],
            PledgeMinerReward: [],
        };
    },
    beforeDestroy() {
        clearInterval(this.$data.Interval);
    },
    async mounted() {
        this.getAssertAll();
        this.getpledgelist();
        this.PledgeRewards();

        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getAssertAll();
        });
        this.Interval = setInterval(() => {
            this.getAssertAll();
        }, 1000 * 15);
    },
    components: {
        SendModelDialog,
        AssetlModalDialog,
    },
    methods: {
        openLinkassert(name) {
            // var explorer = DAEMON_CONFIG.explore();
            // let url = `${explorer}#/assetDetail/${name}`;
            // shell.openExternal(url);
            this.$router.push(`/marketindexmenu/assetinfo/${name}`);
        },
        denomFormart(denom) {
            return denom.substr(1).toUpperCase();
        },
        openAssert(row) {
            this.$refs.AssetlModalDialog.open(row.amount, row.denom);
        },
        cointransaction(row) {
            this.$refs.SendModelDialog.open(row.amount, row.denom);
        },
        async getAssertAll() {
            // assetAll
            try {
                let res = await ipc.callMain('assetAll', {});
                if (res.state) {
                    this.$data.loading = false;
                    this.$data.allassert = res.data || [];
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        async getpledgelist() {
            console.log('AuthorizedMarketlist');
            try {
                let res = await ipc.callMain('Authorizedpledgelist', {});
                if (res.state) {
                    this.$data.pledgelist = res.data.data || [];
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        async PledgeRewards() {
            console.log('getPledgeMinerRewards');
            try {
                let res = await ipc.callMain('damUserDelegatorRewards', {});
                if (res.state && res.data) {
                    var list = res.data.data || [];
                    var result = '';
                    this.$data.PledgeMinerReward = list;
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        findpledgeAsset(name) {
            var result = 0;
            var _this = this;
            if (this.$data.pledgelist == null || this.$data.pledgelist.error != undefined) {
                return '...';
            }
            if (name == 'utbb') {
                return;
            }
            this.$data.pledgelist.forEach(item => {
                if (item.Asset == name) {
                    // result += _this.bigNumTBB(item.Amount);
                    result = this.bigNumAdd(result, item.Amount);
                }
            });
            return this.bigNumTBB(result);
        },
        findpledgereward(name) {
            var result = 0;
            var _this = this;
            if (this.$data.PledgeMinerReward == null || this.$data.PledgeMinerReward.error != undefined) {
                return '...';
            }
            this.$data.PledgeMinerReward.forEach(item => {
                if (item.denom == name) {
                    // result += _this.bigNumTBB(item.Amount);
                    result = this.bigNumAdd(result, item.amount);
                }
            });
            return this.bigNumTBB(result);
        },
        checkstatus(row) {
            if (row.mint_type == '3' && row.status == 0) {
                return true;
            } else {
                return false;
            }
        },
    },
    computed: {
        coinList: function() {
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

            if (this.$data.allassert == 0) {
                return this.$store.getters.getcoinList;
            } else {
                this.$data.allassert.forEach(item => {
                    // mycoinList
                    var haveitem = _.find(mycoinList, {
                        denom: item.asset.denom,
                    });
                    if (haveitem == undefined || haveitem.length == 0) {
                        otherList.push({
                            amount: '0',
                            denom: item.asset.denom,
                            mint_type: item.asset.mint_type,
                            status: item.asset.status,
                        });
                    }
                });
            }
            var listneedtosort = mycoinList.concat(otherList);
            var _this = this;
            listneedtosort.forEach(item => {
                // var haveitem = _.find(_this.$data.allassert, {
                //         asset:{
                //             denom: item.denom,
                //         }
                //     });
                var haveitem = _.find(_this.$data.allassert, one => {
                    if (one.asset.denom == item.denom) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (haveitem) {
                    (item.mint_type = haveitem.mint_type), (item.status = haveitem.status);
                }

                if (item.denom == 'ulamb') {
                    item.sort = 1;
                } else if (item.denom == 'utbb') {
                    item.sort = 0;
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
        DistributionReward: function() {
            return this.$store.getters.getDistributionReward;
        },
        getPledgetbb: function() {
            return this.$store.getters.getPledgetbb;
        },
    },
};
</script>
<style lang="less" scoped>
.customer-container {
    padding-bottom: 100px;
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
