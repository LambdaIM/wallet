<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Row>
                    <Col span="12">
                        <h3>{{ $t('Marketnavigation.Therolemarket') }}</h3>
                    </Col>
                    <Col span="12"></Col>
                </Row>
                <br />
                <Row>
                    <RadioGroup @on-change="setrole" v-model="roleselect" size="large">
                        <Poptip
                            word-wrap
                            width="400"
                            trigger="hover"
                            :title="$t('rolepage.roletype.simpleuser')"
                            :content="$t('rolepage.simpleuserbrief')"
                        >
                            <Radio label="simple">{{ $t('rolepage.roletype.simpleuser') }}</Radio>
                        </Poptip>
                        <Poptip
                            word-wrap
                            width="400"
                            trigger="hover"
                            :title="$t('rolepage.roletype.orderuser')"
                            :content="$t('rolepage.orderuserbrief')"
                        >
                            <Radio label="order">{{ $t('rolepage.roletype.orderuser') }}</Radio>
                        </Poptip>
                        <Poptip
                            word-wrap
                            width="400"
                            trigger="hover"
                            :title="$t('rolepage.roletype.miner')"
                            :content="$t('rolepage.minerbrief')"
                        >
                            <Radio label="miner">{{ $t('rolepage.roletype.miner') }}</Radio>
                        </Poptip>
                        <Poptip
                            word-wrap
                            width="400"
                            trigger="hover"
                            :title="$t('rolepage.roletype.validator')"
                            :content="$t('rolepage.validatorbrief')"
                        >
                            <Radio label="validator">{{ $t('rolepage.roletype.validator') }}</Radio>
                        </Poptip>
                        <Poptip
                            word-wrap
                            width="400"
                            trigger="hover"
                            :title="$t('rolepage.roletype.marketmaker')"
                            :content="$t('rolepage.marketmakerbrief')"
                        >
                            <Radio label="marketmaker">{{ $t('rolepage.roletype.marketmaker') }}</Radio>
                        </Poptip>
                    </RadioGroup>
                </Row>
                <div v-if="openmarket">
                    <br />
                    <Row>
                        <Col span="12">
                            <h3>{{ $t('Marketnavigation.Choosemarket') }}</h3>
                        </Col>
                        <Col span="12"></Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span="12">
                            <div style="margin: 5px;">
                                <ul>
                                    <li>{{ $t('Marketnavigation.lambdamarket.Note1') }}</li>
                                    <li>{{ $t('Marketnavigation.lambdamarket.Note2') }}</li>
                                    <li>{{ $t('Marketnavigation.lambdamarket.Note3') }}</li>
                                    <li>{{ $t('Marketnavigation.lambdamarket.Note4') }}</li>
                                    <li>{{ $t('Marketnavigation.lambdamarket.Note5') }}</li>
                                </ul>
                            </div>
                            <div style="margin: 5px;">
                                <Button type="primary" to="/market" long>
                                    {{ $t('Marketnavigation.Enteringlambda') }}
                                </Button>
                            </div>
                        </Col>
                        <Col span="12">
                            <div style="margin: 5px;">
                                <ul>
                                    <li>{{ $t('Marketnavigation.Assetmarket.Note1') }}</li>
                                    <li>{{ $t('Marketnavigation.Assetmarket.Note2') }}</li>
                                    <li>{{ $t('Marketnavigation.Assetmarket.Note3') }}</li>
                                    <li>{{ $t('Marketnavigation.Assetmarket.Note4') }}</li>
                                    <li>{{ $t('Marketnavigation.Assetmarket.Note5') }}</li>
                                </ul>
                            </div>
                            <div style="margin: 5px;">
                                <Button type="primary" to="/marketindexmenu" long>
                                    {{ $t('Marketnavigation.Enteringasset') }}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <br />

                    <Row>
                        <Col span="12">
                            <h3>{{ $t('Marketnavigation.Miningreward') }}</h3>
                        </Col>
                        <Col span="12"></Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span="24">
                            <p>
                                <Tag v-for="item in MinerRewards">
                                    {{ bigNumTypeFormat(item.amount, item.denom) }}
                                </Tag>
                            </p>
                            <p v-if="MinerRewards.length == 0">
                                {{ $t('Dialog.com.Nodata') }}
                            </p>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span="12">
                            <h3>{{ $t('damindex.Assetpledgereward') }}</h3>
                        </Col>
                        <Col span="12"></Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span="24">
                            <p>
                                <Tag v-for="item in PledgeMinerReward">
                                    {{ bigNumTypeFormat(item.amount, item.denom) }}
                                </Tag>
                            </p>

                            <p v-if="PledgeMinerReward.length == 0">
                                {{ $t('Dialog.com.Nodata') }}
                            </p>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span="12">
                            <Button @click="Drawreward">{{ $t('somemodel.Extractstorageandmininrewards') }}</Button>
                        </Col>
                        <Col span="12"></Col>
                    </Row>
                    <br />
                    <div v-if="$role('conlist.reward')">
                        <Row>
                            <Col span="12">
                                <h3>{{ $t('damindex.OrderCommission') }}</h3>
                            </Col>
                            <Col span="12"></Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span="24">
                                <p>
                                    <Tag v-for="item in MinerOrderReward">
                                        {{ bigNumTypeFormat(item.amount, item.denom) }}
                                    </Tag>
                                </p>

                                <p v-if="MinerRewards.length == 0">
                                    {{ $t('Dialog.com.Nodata') }}
                                </p>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span="12">
                                <Button @click="openMinerOrder">{{ $t('damindex.lambdamarketorder') }}</Button>
                            </Col>
                            <Col span="12">
                                <Button @click="openDamMinerOrder">{{ $t('damindex.assetmarketorder') }}</Button>
                            </Col>
                        </Row>
                    </div>
                    <br />
                </div>
            </div>
            <br />
            <br />
            <br />
        </div>
        <MinerWithdrawalModal ref="MinerWithdrawalModalDialog" />
        <MinerWithdrawaOrderlModal ref="MinerWithdrawaOrderlModalDialog" />
        <withdrawalAuthorizedMarketModal ref="withdrawalAuthorizedMarketModalDialog" />
    </div>
</template>
<script>
import MinerWithdrawalModal from '@/views/Dialog/MinerWithdrawalModal.vue';
import eventhub from '../../common/js/event.js';

import MinerWithdrawaOrderlModal from '@/views/Dialog/MinerWithdrawaOrderlModal.vue';
import withdrawalAuthorizedMarketModal from '@/views/Dialog/withdrawalAuthorizedMarketModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    components: {
        MinerWithdrawalModal,
        MinerWithdrawaOrderlModal,
        withdrawalAuthorizedMarketModal,
    },
    mounted() {
        this.getMinerRewards();
        this.getOrderCommission();
        this.getPledgeMinerRewards();

        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getMinerRewards();
            this.getOrderCommission();
            this.getPledgeMinerRewards();
        });
    },
    data() {
        return {
            roleselect: this.$store.getters.role || 'simple',
            MinerRewards: [],
            MinerOrderReward: [],
            PledgeMinerReward: [],
        };
    },
    methods: {
        getrole() {
            var role = this.$store.getters.role;
            var reslt = '';
            switch (role) {
                case 'simple':
                    reslt = this.$t('rolepage.roletype.simpleuser');
                    break;
                case 'order':
                    reslt = this.$t('rolepage.roletype.orderuser');
                    break;
                case 'miner':
                    reslt = this.$t('rolepage.roletype.miner');
                    break;
                case 'validator':
                    reslt = this.$t('rolepage.roletype.validator');
                    break;
                case 'marketmaker':
                    reslt = this.$t('rolepage.roletype.marketmaker');
                    break;
            }
            return reslt;
        },
        Drawreward() {
            this.$refs.MinerWithdrawalModalDialog.open();
        },
        async getMinerRewards() {
            console.log('getMinerRewards');
            try {
                let res = await ipc.callMain('MinerRewards', {});
                if (res.state) {
                    var list = res.data['miner_rewards'] || [];
                    var result = '';
                    this.$data.MinerRewards = list;
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        async getPledgeMinerRewards() {
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
        async getOrderCommission() {
            console.log('getOrderCommission');
            try {
                let res = await ipc.callMain('damMinerInfo', {});
                if (res.state && res.data && res.data.data) {
                    var lamblist = res.data.data['orderReward'] || [];
                    var result = '';
                    this.$data.MinerOrderReward = lamblist;
                    console.log(lamblist);
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        openMinerOrder() {
            this.$refs.MinerWithdrawaOrderlModalDialog.open();
        },
        openDamMinerOrder() {
            this.$refs.withdrawalAuthorizedMarketModalDialog.open();
        },
        setrole() {
            // var rolelist=['simple','order','miner','validator'];
            this.$store.dispatch('setrole', this.$data.roleselect);
        },
    },
    computed: {
        openmarket: function() {
            if (this.$store.getters.role == 'simple') {
                return false;
            } else {
                return true;
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
