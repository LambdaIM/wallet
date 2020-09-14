<template>
    <div>
        <Modal
            loading
            v-model="sendModal"
            :title="$t('CreateassetsPop.Createassets')"
            :styles="{ top: '200px' }"
            @on-cancel="sendcancel"
        >
            <Form v-if="CyclePreview == false" @keydown.native.enter.prevent="preSendLAMB(false)">
                <p>
                    <Input v-model="name">
                        <span slot="prepend">{{ $t('CreateassetsPop.AssetName') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input v-model="remarks">
                        <span slot="prepend">{{ $t('CreateassetsPop.Assetfullname') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input v-model="asset">
                        <span slot="prepend">{{ $t('CreateassetsPop.Initialcirculation') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    {{ $t('CreateassetsPop.Issuingtype') }}
                    <RadioGroup v-model="MintType">
                        
                        <Radio label="1">{{ $t('CreateassetsPop.Non-issueable') }}</Radio>
                        <Radio label="2">{{ $t('CreateassetsPop.One-timeissuance') }}</Radio>
                        <Radio label="3">{{ $t('CreateassetsPop.Additionalmining') }}</Radio>
                        
                    </RadioGroup>
                </p>
                <br />
                <div >
                     <Tabs >
                        <TabPane :label="$t('assetnewpage.premining')">
                                
                    <p>
                        <Input v-model="total_supply">
                            <span slot="prepend">{{ $t('CreateassetsPop.Totalsupply') }}</span>
                        </Input>
                    </p>
                    <br />
                            <p>
                                {{$t('assetnewpage.Useofassets')}}&nbsp; &nbsp; 
                                    <RadioGroup v-model="fund_asset">
                                        <Radio label="ulamb">
                                            
                                            <span>LAMB</span>
                                        </Radio>
                                        <Radio label="utbb">
                                            
                                            <span>TBB</span>
                                        </Radio>
                                        
                                    </RadioGroup>
                            </p>
                            <br/>
                            <p>
                                <Input v-model="fund_amount">
                                    <span slot="prepend">{{$t('assetnewpage.Preminingquota')}}</span>
                                    <span slot="append">{{denomShort(fund_asset)}}</span>
                                </Input>
                            </p>
                            <br/>
                            <p>
                                <Input v-model="fund_period">
                                    <span slot="prepend">{{$t('assetnewpage.Preminingperiod')}}</span>
                                    <span slot="append">{{$t('assetnewpage.day')}}</span>
                                </Input>
                            </p>
                            <br/>
                            <p>
                                {{$t('assetnewpage.periodtip')}}
                            </p>
                            <br/>
                            <p>
                                <Input v-model="fund_stake">
                                    <span slot="prepend">{{$t('assetnewpage.Returnedpremining')}}</span>
                                    <span slot="append">{{name}}</span>
                                </Input>
                                <br/>
                            </p>
                        </TabPane>
                        <TabPane v-if="MintType == '3'" :label="$t('assetnewpage.mining')">
                        
                    <br />
                    <p>
                        <Input v-model="inflation">
                            <span slot="prepend">{{ $t('CreateassetsPop.inflation') }}</span>
                        </Input>
                    </p>
                    <br />
                    <p>
                        <Input :placeholder="$t('assetnewtxt.MiningRatiodemo')" v-model="MiningRatio">
                            <span slot="prepend">{{$t('assetnewtxt.MiningRatio')}}</span>
                        </Input>
                        <br />
                        <p>
                            {{$t('assetnewtxt.MiningRatiohelp')}}
                        </p>
                        
                    </p>
                    <br />
                    <p>
                        <Input :placeholder="$t('CreateassetsPop.adjust_rate_tip')" v-model="adjust_rate">
                            <span slot="prepend">{{ $t('CreateassetsPop.adjust_rate') }}</span>
                        </Input>
                    </p>
                    <br />
                    <p>
                        <Input v-model="max_adjust_count">
                            <span slot="prepend">{{ $t('CreateassetsPop.max_adjust_count') }}</span>
                        </Input>
                        
                    </p>
                    <br />
                    <p>
                        <Input v-model="adjust_period">
                            <span slot="prepend">{{ $t('CreateassetsPop.adjust_period') }}</span>
                        </Input>
                        <br />
                    </p>
                    <p>
                        <Input v-model="genesis_height">
                            <span slot="prepend">{{ $t('CreateassetsPop.genesis_height') }}</span>
                        </Input>
                        <br />
                    </p>
                        </TabPane>
                        
                    </Tabs>
                    
                    
                </div>

                <p>{{ $t('CreateassetsPop.tip1') }}{{ parameter.pledge_cost | BlanceValue }}LAMB</p>

                <p />
            </Form>
            <div v-else>
                <!-- Previewlist -->
                <h3>{{ $t('CreateassetsPop.preview') }}</h3>
                <br />
                <div v-if="Previewlist.length > 0">
                    <Table height="300" :columns="Previewlistcolumns" :data="Previewlist"></Table>
                </div>
                <div v-else>
                    loading......
                </div>
            </div>

            <div slot="footer">
                <div v-if="CyclePreview == false">
                    <Button v-if="MintType == '3'" type="primary" @click="preSendLAMB(true)">
                        {{ $t('CreateassetsPop.preview') }}
                    </Button>
                    <Button type="primary" @click="preSendLAMB(false)">{{ $t('home.Modal1.Submit') }}</Button>
                </div>
                <div v-else>
                    <Button type="primary" @click="switchtoEdit">{{ $t('CreateassetsPop.continue_editing') }}</Button>
                </div>
            </div>
        </Modal>

        <ConfirmModal :goback="goback" ref="ConfirmModal" />
    </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';

import BigNumber from 'bignumber.js';

import _ from 'underscore';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            sendModal: false,
            confirmModal: false,
            name: '',
            asset: '',
            MintType: '1',
            inflation: '',
            inflation_period: '',
            parameter: {},
            total_supply: '',
            adjust_rate: '',
            max_adjust_count: '',
            genesis_height: '',
            remarks: '',
            adjust_period: '',
            CyclePreview: false,
            Previewlist: [],
            Previewlistcolumns: [
                {
                    title: this.$t('CreateassetsPop.start_height'),
                    key: 'start_height',
                },
                {
                    title: this.$t('CreateassetsPop.inflation'),
                    key: 'inflation',
                },
                {
                    title: this.$t('CreateassetsPop.end_height'),
                    key: 'end_height',
                },
            ],
            MiningRatio:'',
            fund_asset:'ulamb',
            fund_amount:'',
            fund_period:'',
            fund_stake:''
        };
    },
    components: {
        ConfirmModal,
    },
    methods: {
        open() {
            this.sendModal = true;

            this.getparameter();
        },
        sendcancel() {
            this.sendModal = false;
        },
        preSendLAMB(ispreview) {
            console.log('-----');
            let name = this.trim(this.name.toLocaleLowerCase()).replace(/\s*/g, '');

            let asset = parseInt(this.asset);
            let MintType = parseInt(this.MintType);
            let inflation = parseInt(this.inflation);

            let total_supply = parseInt(this.total_supply);

            let adjust_rate = parseFloat(this.adjust_rate);

            let max_adjust_count = parseInt(this.max_adjust_count);

            let genesis_height = parseInt(this.genesis_height);

            let adjust_period = parseInt(this.adjust_period);
            let remarks = this.trim(this.$data.remarks || '');
            let MiningRatio = parseFloat(this.$data.MiningRatio);

            let fund_amount = parseInt(this.$data.fund_amount);
            let fund_period = parseInt(this.$data.fund_period);
            let fund_stake = parseInt(this.$data.fund_stake);
            let fund_asset = this.$data.fund_asset;

            if (name == '') {
                this.$Notice.warning({
                    title: this.$t('CreateassetsPop.action.need_AssetName'),
                });
                return;
            }

            if (isNaN(asset) || asset <= 0) {
                this.$Notice.warning({
                    title: this.$t('CreateassetsPop.action.need_asset'),
                });
                return;
            }
            if (isNaN(fund_amount) || fund_amount <= 0) {
                    this.$Notice.warning({
                        title: this.$t('assetnewpage.action.fund_amount'),
                    });
                    return;
                }
                if (isNaN(fund_period) || fund_period <= 0) {
                    this.$Notice.warning({
                        title: this.$t('assetnewpage.action.fund_period'),
                    });
                    return;
                }
                if (isNaN(fund_stake) || fund_stake <= 0) {
                    this.$Notice.warning({
                        title: this.$t('assetnewpage.action.fund_stake'),
                    });
                    return;
                }
                if(fund_stake>total_supply){
                    this.$Notice.warning({
                        title: this.$t('assetnewpage.action.fund_stake_big'),
                    });
                    return;

                }
            if (MintType == '3') {
                
                if (isNaN(inflation) || inflation <= 0) {
                    this.$Notice.warning({
                        title: this.$t('CreateassetsPop.action.need_inflation'),
                    });
                    return;
                }

                if (isNaN(total_supply) || total_supply <= 0) {
                    this.$Notice.warning({
                        title: this.$t('CreateassetsPop.action.need_total_supply'),
                    });
                    return;
                }

                if (isNaN(adjust_rate) || adjust_rate >= 1||adjust_rate <= 0) {
                    this.$Notice.warning({
                        title: this.$t('CreateassetsPop.action.need_adjust_rate'),
                    });
                    return;
                }

                if (isNaN(max_adjust_count) || max_adjust_count <= 0) {
                    this.$Notice.warning({
                        title: this.$t('CreateassetsPop.action.need_max_adjust_count'),
                    });
                    return;
                }

                if (isNaN(adjust_period) || adjust_period <= 0) {
                    this.$Notice.warning({
                        title: this.$t('CreateassetsPop.action.need_adjust_period'),
                    });
                    return;
                }

                if (isNaN(genesis_height) || genesis_height <= 0) {
                    this.$Notice.warning({
                        title: this.$t('CreateassetsPop.action.need_genesis_height'),
                    });
                    return;
                }

                if (isNaN(MiningRatio) || MiningRatio > 1||MiningRatio<=0) {
                    this.$Notice.warning({
                        title: this.$t('assetnewtxt.need_MiningRatio'),
                    });
                    return;
                }

                
            }

            if (this.bigLess0OrGreater(this.parameter.pledge_cost, this.balance)) {
                // need to alert
                this.$Notice.warning({
                    title: this.$t('home.action.check_balance_amount_transfer'),
                });
                return;
            }

            name = 'u' + name;
            var reg = new RegExp(/^[a-zA-Z0-9]{3,16}$/);
            if (!reg.test(name)) {
                this.$Notice.warning({
                    title: this.$t('CreateassetsPop.action.AssetNamerule'),
                });
                return;
            }

            var adjust_rate_Big = new BigNumber(adjust_rate || 0.1);
            adjust_rate = adjust_rate_Big.toFixed(18);

            var MiningRatio_Big = new BigNumber(MiningRatio || 0.1);
            MiningRatio = MiningRatio_Big.toFixed(18);

            if (ispreview == false) {
                this.transfer({
                    name,
                    asset,
                    MintType,
                    inflation,
                    total_supply,
                    adjust_rate,
                    max_adjust_count,
                    genesis_height,
                    adjust_period,
                    remarks,
                    MiningRatio,
                    fund_asset,
                    fund_amount,
                    fund_period,
                    fund_stake
                });
            } else {
                this.switchtoPreview({
                    name,
                    asset,
                    MintType,
                    inflation,
                    total_supply,
                    adjust_rate,
                    max_adjust_count,
                    genesis_height,
                    adjust_period,
                    remarks,
                });
            }
        },
        async transfer(objpra) {
            this.$data.transactiondata = null;
            let isdege = this.$data.isdege;
            try {
                let res = await ipc.callMain('CreateAsset', {
                    asset_amount: this.toBigNumStr(objpra.asset),
                    asset_denom: objpra.name,
                    name: objpra.name,
                    mint_type: objpra.MintType,
                    inflation: this.toBigNumStr(objpra.inflation || 0),
                    total_supply: this.toBigNumStr(objpra.total_supply || 0),
                    adjust_rate: String(objpra.adjust_rate || ''),
                    max_adjust_count: String(objpra.max_adjust_count || 0),
                    genesis_height: String(objpra.genesis_height || 0),
                    adjust_period: String(objpra.adjust_period || 0),
                    remarks: objpra.remarks || objpra.name,
                    MiningRatio:objpra.MiningRatio,
                    fund_asset:objpra.fund_asset,
                    fund_amount:this.toBigNumStr(objpra.fund_amount),
                    fund_period:String(objpra.fund_period),
                    fund_stake:this.toBigNumStr(objpra.fund_stake)
                });
                // console.log(res);
                if (res.state) {
                    this.sendcancel();
                    this.$refs.ConfirmModal.open('CreateAsset', res.data, {
                        totalAmount: this.parameter.pledge_cost,
                    });

                    // let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
                    // if (gasres.state) {
                    //   this.$data.gaseFee = gasres.data;
                    //   this.$data.transactiondata = res.data;
                    //   this.sendcancel();
                    //   this.confirmModal = true;
                    // }
                }
            } catch (ex) {
                this.$Notice.warning({
                    title: 'error',
                    desc: ex.errormsg,
                });
                console.log(ex);
            }
        },
        async getparameter() {
            console.log('getparameter');
            let res = await ipc.callMain('Assetparameters', {});
            if (res.state) {
                this.$data.parameter = res.data.data;
            }
        },
        async switchtoPreview({
            name,
            asset,
            MintType,
            inflation,
            total_supply,
            adjust_rate,
            max_adjust_count,
            genesis_height,
            adjust_period,
            remarks,
        }) {
            this.$data.CyclePreview = true;
            let res = await ipc.callMain('damAssetMintSimulate', {
                assetName: name,
                assetiniti: asset,
                total_supply: total_supply,
                inflation: inflation,
                adjust_rate: adjust_rate,
                adjust_period: adjust_period,
                max_adjust_count: max_adjust_count,
                genesis_height: genesis_height,
            });
            if (res.state) {
                this.$data.Previewlist = res.data.data;
            }
        },
        switchtoEdit() {
            this.$data.CyclePreview = false;
        },
        goback() {
            console.log('goback');
            this.sendModal = true;
            this.$refs.ConfirmModal.clase();
        },
        denomShort: function(denom) {
            return denom.substr(1).toUpperCase();
        }
    },
    computed: {
        address: function() {
            return this.$store.getters.getaddress;
        },
        balance: function() {
            return this.$store.getters.getblance;
        },
        balanceLamb: function() {
            return this.$store.getters.getblance;
        },
        isdegeTxt: function() {
            return this.$t('proposalsPage.Vote');
        },
    },
};
</script>

<style lang="less" scoped>
.modal-header {
    .item {
        margin-top: 20px;
        font-size: 14px;
    }
}
</style>
