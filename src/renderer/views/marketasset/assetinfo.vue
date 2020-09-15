<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Breadcrumb v-if="assetinfo">
                    <BreadcrumbItem to="/marketindexmenu">
                        {{$t('assetnewpage.Assetlist')}}
                    </BreadcrumbItem>
                    <BreadcrumbItem>{{ denomShort(assetName) }}</BreadcrumbItem>
                </Breadcrumb>

                <div>
                    <Row>
                        <Col span="12">
                            <Card :title="$t('assetnewpage.Assetdetails')" icon="logo-usd" :padding="0" shadow style="width: 300px;">
                                <CellGroup v-if="assetinfo">
                                    <Cell :title="$t('assetnewpage.Fullname')" :extra="assetinfo.name" />
                                    <Cell  v-if="assetinfo.mint_type==1" :title="$t('assetnewpage.Additionaltype')" :extra="$t('CreateassetsPop.Non-issueable') " />
                                    <Cell  v-if="assetinfo.mint_type==2" :title="$t('assetnewpage.Additionaltype')" :extra="$t('CreateassetsPop.One-timeissuance') " />
                                    <Cell  v-if="assetinfo.mint_type==3" :title="$t('assetnewpage.Additionaltype')" :extra=" $t('CreateassetsPop.Additionalmining') " />
                                    
                                    <Cell :title="$t('assetnewpage.state')" >
                                        <Badge v-if="assetinfo.status==0" :count="$t('assetnewpage.premining')" slot="extra" />
                                        <Badge v-if="assetinfo.status==1" :count="$t('assetnewpage.Completionofpremining')" slot="extra" />
                                        <Badge v-if="assetinfo.status==2" :count="$t('assetnewpage.Authorizedadditionalissuance')" slot="extra" />
                                        <Badge v-if="assetinfo.status==3" :count="$t('assetnewpage.Additionalissuancecompleted')" slot="extra" />
                                    </Cell>
                                    <Cell v-if="assetfund" :title="$t('assetnewpage.Endtime')" :extra="assetfund.end_time|formatDate" />
                                    <Cell :title="$t('assetnewpage.Initialissue')" :extra="bigNumTypeFormat(assetinfo.asset.amount, assetinfo.asset.denom)" />
                                    

                                    <Cell
                                        :title="$t('assetnewpage.Totalcirculation')"
                                        :extra="
                                            bigNumTypeFormat(
                                                assetinfo.total_supply.amount,
                                                assetinfo.total_supply.denom
                                            )
                                        "
                                    />
                                    <Cell v-if="assetfund" :title="$t('assetnewpage.Quantityofpremining')" :extra="bigNumTypeFormat(assetfund.asset.amount, assetfund.asset.denom)" />
                                    <Cell
                                       v-if="assetfund"
                                        :title="$t('assetnewpage.Totalparticipation')"
                                        :extra="
                                            bigNumTypeFormat(assetfund.fund_asset.amount, assetfund.fund_asset.denom)
                                        "
                                    />
                                    <Cell
                                        v-if="assetfund"
                                        :title="$t('assetnewpage.Completiondegree')"
                                        :extra="percentage(assetfund.amount/assetfund.fund_asset.amount)"
                                    />
                                    <Cell v-if="userfund" :title="$t('assetnewpage.Myparticipationquota')"
                                         :extra="bigNumTypeFormat(userfund.invest.amount, userfund.invest.denom)"
                                         />
                                    <Cell v-if="userfund" :title="$t('assetnewpage.Expectedmining')"
                                         :extra="bigNumTypeFormat(userfund.stake.amount, userfund.stake.denom)"
                                         />
                                </CellGroup>
                                <span v-else>
                                      <Spin size="large"></Spin>
                                </span>
                            </Card>
                        </Col>
                        <Col span="12">
                         <div v-if="assetState=='prepare'">
                            <Input v-model="amount">
                                <span slot="prepend">{{$t('assetnewpage.amount')}}</span>
                                <span slot="append">{{assetfunddemo}}</span>
                            </Input>
                            
                            <br />
                            <div>
                                <Button @click="Preparedata" type="success" long>{{$t('assetnewpage.Participateinpremining')}}</Button>
                            </div>
                            <br />
                            <div>
                                
                                <a @click="openBrowser">{{$t('assetnewpage.Premininglist')}}</a>
                            </div>
                            <br />
                            <br />

                            <p>
                                <ul class="help">
                                    <li>{{$t('assetnewpage.Ruledescription')}}
                                    </li>
                                    
                                    <li>{{$t('assetnewpage.Ruletip1')}}
                                    </li>
                                    <li>{{$t('assetnewpage.Ruletip2')}}
                                    </li>
                                    <li>{{$t('assetnewpage.Ruletip3')}}
                                    </li>
                                </ul>
                                

                            </p>
                         </div>
                         <div v-else>
                             <div>
                               <!-- <Button type="primary">开启矿工挖矿</Button> -->
                               <h3 v-if="userfund">{{$t('assetnewpage.Myparticipationquota')}}:{{bigNumTypeFormat(userfund.invest.amount, userfund.invest.denom)}}</h3>
                               <h3 v-if="userfund">{{$t('assetnewpage.Expectedmining')}}:{{bigNumTypeFormat(userfund.stake.amount, userfund.stake.denom)}}</h3>
                             </div>
                             <br/>
                             <div>
                                <a @click="openBrowser">{{$t('assetnewpage.Premininglist')}}</a>
                             </div>
                             <br/>
                               <ul class="help">
                                    <li>{{$t('assetnewpage.Ruledescription')}}
                                    </li>
                                    <li>{{$t('assetnewpage.Ruletip_1')}}
                                    </li>
                                    
                                </ul>

                         </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
        <ConfirmModal  ref="ConfirmModal" />
    </div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';

import ConfirmModal from '../Dialog/confirmModal.vue';

const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    computed: {
        assetState(){
            if(this.$data.assetinfo== null||this.$data.assetinfo.status==0){
                return "prepare";
            }else{
                return "other";
            }
        }
    },
    components: {
        ConfirmModal
    },
    mounted() {
        console.log('资产');
        this.$data.assetName = this.$route.params.assetName;
        this.getassetinfo();
        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getassetinfo();
        });
    },
    data() {
        return {
            assetName: '',
            assetinfo: null,
            amount:'',
            
            assetfund:null,
            userfund:null,
            assetfunddemo:''
        };
    },
    methods: {
        percentage(data){
           var num= parseFloat(data);
           if(isNaN(num)){
               return '--';
           }
           return (num*100).toFixed(3)+"%";

        },
        openBrowser(){
            var explorer = DAEMON_CONFIG.explore();
            var name = this.$data.assetName;
            let url = `${explorer}#assetDetail/${name}/fund/1`;
            shell.openExternal(url);

        },
        denomShort: function(denom) {
            return denom.substr(1).toUpperCase();
        },
       async Preparedata(){
            var amount;
            var assetName =this.$data.assetName;

            try{
                amount = parseFloat(this.$data.amount);
            }
            catch(ex){

            }
            if(isNaN(amount)){
                this.$Notice.warning({
                    title: this.$t('assetnewpage.action.amount_limit')
                    });
                return ;
            }
            /// 
            this.$data.transactiondata = null;
            try {
                let res = await ipc.callMain('damAssetInvest', {
                    AssetName:assetName, 
                    token:this.toBigNumStr(amount),
                    tokendenom:this.$data.assetfund.fund_asset.denom
                });
                console.log(res);
                if (res.state) {
                    // this.sendcancel();
                    this.$refs.ConfirmModal.open('damAssetInvest', res.data);
                }

            } catch (ex) {
                    this.$Notice.warning({
                        title: 'error',
                        desc: ex.errormsg,
                    });
                    console.log(ex);
                }
            /// 

        },
        async getassetinfo() {
            let res = await ipc.callMain('damassetinfo', {
                name: this.$data.assetName,
            });
            if (res.state && res.data.data.error == undefined) {
                this.$data.assetinfo = res.data.data;
            }
            this.damassetfund();
            this.damUserassetfund();
        },
       async damassetfund() {
            let res = await ipc.callMain('damassetfund', {
                name: this.$data.assetName,
            });
            if (res.state && res.data.data.error == undefined) {
                this.$data.assetfund = res.data.data;
                this.$data.assetfunddemo = this.denomShort(this.$data.assetfund.fund_asset.denom);
            }
        },
       async damUserassetfund() {
            let res = await ipc.callMain('damUserassetfund', {
                name: this.$data.assetName,
            });
            if (res.state && res.data.data.error == undefined) {
                this.$data.userfund = res.data.data;
                
            }
        }
        

        
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

.help{
    list-style-type:none;
    li{
        margin-bottom: 10px;
    }

}
</style>
