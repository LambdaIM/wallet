<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Breadcrumb v-if="assetinfo">
                    <BreadcrumbItem to="/marketindexmenu">
                        资产列表
                    </BreadcrumbItem>
                    <BreadcrumbItem>{{ denomShort(assetName) }}</BreadcrumbItem>
                </Breadcrumb>

                <div>
                    <Row>
                        <Col span="12">
                            <Card title="资产信息" icon="logo-usd" :padding="0" shadow style="width: 300px;">
                                <CellGroup v-if="assetinfo">
                                    <Cell title="资产全称" :extra="assetinfo.name" />
                                    <Cell title="状态" to="/components/badge">
                                        <Badge v-if="assetinfo.status==0" count="预挖矿" slot="extra" />
                                        <Badge v-if="assetinfo.status==1" count="预挖矿完成" slot="extra" />
                                        <Badge v-if="assetinfo.status==2" count="授权增发" slot="extra" />
                                        <Badge v-if="assetinfo.status==3" count="已增发完成" slot="extra" />
                                    </Cell>
                                    <Cell v-if="assetfund" title="结束时间" :extra="assetfund.end_time|formatDate" />
                                    <Cell title="初始发行" :extra="bigNumTypeFormat(assetinfo.asset.amount, assetinfo.asset.denom)" />
                                    

                                    <Cell
                                        title="总发行量"
                                        :extra="
                                            bigNumTypeFormat(
                                                assetinfo.total_supply.amount,
                                                assetinfo.total_supply.denom
                                            )
                                        "
                                    />
                                    <Cell title="预挖矿数量" :extra="bigNumTypeFormat(assetfund.asset.amount, assetfund.asset.denom)" />
                                    <Cell
                                       v-if="assetfund"
                                        title="总参与额度"
                                        :extra="
                                            bigNumTypeFormat(assetfund.fund_asset.amount, assetfund.fund_asset.denom)
                                        "
                                    />
                                    <Cell
                                        v-if="assetfund"
                                        title="已完成参与额度"
                                        :extra="percentage(assetfund.amount/assetfund.fund_asset.amount)"
                                    />
                                    <Cell v-if="userfund" title="我的参与额度" 
                                         :extra="bigNumTypeFormat(userfund.invest.amount, userfund.invest.denom)"
                                         />
                                    <Cell v-if="userfund" title="预计挖矿" 
                                         :extra="bigNumTypeFormat(userfund.stake.amount, userfund.stake.denom)"
                                         />
                                </CellGroup>
                                <span v-else>
                                    loading...
                                </span>
                            </Card>
                        </Col>
                        <Col span="12">
                         <div v-if="assetState=='prepare'">
                            <Input v-model="amount">
                                <span slot="prepend">金额</span>
                                <span slot="append">{{denomShort(assetfund.fund_asset.denom)}}</span>
                            </Input>
                            
                            <br />
                            <div>
                                <Button @click="Preparedata" type="success" long>参与预挖</Button>
                            </div>
                            <br />
                            <p>
                                
                                <a @click="openBrowser">在浏览器中查看参与挖矿列</a>
                            </p>
                            <br />
                            <p>
                                <ul class="help">
                                    <li>规则说明
                                    </li>
                                    <li>1.*******
                                    </li>
                                    <li>2.预挖矿获取的资产额度，和用于预挖矿的资产占总预挖矿资产占比，成正比
                                    </li>
                                    <li>3.预挖结束后，发放资产
                                    </li>
                                    <li>4.预挖矿期间，资产不可交易
                                    </li>
                                </ul>
                                

                            </p>
                         </div>
                         <div v-else>
                             <div>
                               <!-- <Button type="primary">开启矿工挖矿</Button> -->
                             </div>
                             <br/>
                             <a @click="openBrowser">在浏览器中查看参与挖矿列</a>
                             <br/>
                               <ul class="help">
                                    <li>规则说明
                                    </li>
                                    <li>1.资产没有关联市场，矿工将无法挖矿，如果需要矿工挖矿，需要创建市场
                                    </li>
                                    <li>2.*******
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
            if(this.$data.assetinfo.status==0){
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
            userfund:null
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
            let url = `${explorer}#/assetDetail/${name}`;
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
                    title: '金额需要为数字'
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
