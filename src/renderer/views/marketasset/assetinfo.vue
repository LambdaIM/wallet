<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Breadcrumb>
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
                                    <Cell title="资产描述" :extra="assetinfo.name" />
                                    <Cell title="状态" to="/components/badge">
                                        <Badge count="预挖矿" slot="extra" />
                                    </Cell>
                                    <Cell title="结束时间" extra="两周" />
                                    <Cell title="预挖数量" extra="100" />

                                    <Cell
                                        title="总发行量"
                                        :extra="
                                            bigNumTypeFormat(
                                                assetinfo.total_supply.amount,
                                                assetinfo.total_supply.denom
                                            )
                                        "
                                    />
                                    <Cell
                                        title="总参与额度"
                                        :extra="
                                            bigNumTypeFormat(assetinfo.curr_supply.amount, assetinfo.curr_supply.denom)
                                        "
                                    />
                                    <Cell title="我的参与额度" extra="10lamb" />
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
                                <span slot="append">LAMB</span>
                            </Input>
                            <br />
                            <p>
                                预计挖XXX 1000个
                            </p>
                            <br />
                            <div>
                                <Button @click="Preparedata" type="success" long>参与预挖</Button>
                            </div>
                            <br />
                            <p>
                                
                                在浏览器中查看参与挖矿列
                            </p>
                            <br />
                            <p>
                                <ul class="help">
                                    <li>规则说明
                                    </li>
                                    <li>1.*******
                                    </li>
                                    <li>2.*******
                                    </li>
                                </ul>
                                

                            </p>
                         </div>
                         <div v-else>
                             <div>
                               <Button type="primary">开启矿工挖矿</Button>
                             </div>
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
    components: {
        ConfirmModal
    },
    mounted() {
        console.log('资产');
        this.$data.assetName = this.$route.params.assetName;
        this.getassetinfo();
    },
    data() {
        return {
            assetName: '',
            assetinfo: null,
            amount:'',
            assetState:"prepare" // prepare
        };
    },
    methods: {
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
                    tokendenom:'ulamb'
                });
                // console.log(res);
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

.help{
    list-style-type:none;
    li{
        margin-bottom: 10px;
    }

}
</style>
