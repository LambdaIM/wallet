<template>
  <div class="container">
    <p class="balance">
      {{$t('home.Balance')}}: {{balance|Lambformat}} 
      {{$t('home.Reward')}} :{{DistributionReward|Lambformat}} 
      <!-- <span style="color:green">
        <a @click="openvalidator">{{ $t("home.profits_pledge_system") }}</a>
      </span>-->
    </p>
    <div style="width:94%;    margin: 0 auto;">
      <Tabs >
        <TabPane :label="$t('home.Latest_Transaction')" >
          <Table size="large" :loading="loading" :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="from">
              <Poptip word-wrap trigger="hover" width="200" :content="row.from">
                <span class="etc">{{row.from}}</span>
              </Poptip>
            </template>
            <template slot-scope="{ row, index }" slot="to">
              <Poptip v-if="row.to!='--'" word-wrap trigger="hover" width="200" :content="row.to">
                <span class="etc">{{row.to}}</span>
              </Poptip>
              <span v-else>{{row.to}}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                @click="toDetail(row,index)"
              >{{ $t("home.View_Detail") }}</Button>
              <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
            </template>
          </Table>
        </TabPane>
        <TabPane label="Token">
          <Table :columns="columnsToken" :data="coinList">
            
            
            <template slot-scope="{ row, index }" slot="amount">
              {{bigNumTypeFormat(row.amount,row.denom)}}
            </template>
            <template slot-scope="{ row, index }" slot="denom">
              {{denomFormart(row.denom)}}
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button @click="cointransaction(row)" type="primary" size="small">{{$t('home.Token.Transfer')}}</Button>

              <Button v-if="row.denom!='usto'" @click="openAssert(row)" size="small">{{$t('home.Token.Exchange')}}</Button>
            </template>
          </Table>
        </TabPane>
        <span slot="extra">
          <Button @click="openSend()">
            {{$t('home.Transfer')}}
            <Icon type="md-swap"></Icon>
          </Button>
&nbsp; &nbsp;
          <Button slot="extra" @click="openwithdrawalModal()">
            {{$t('home.Withdraw')}}
            <Icon type="md-swap"></Icon>
          </Button>
&nbsp; &nbsp;
        </span>
      </Tabs>
    </div>

    <div class="tc">
      <!-- <Page :total="sum" show-elevator @on-change="changePage"></Page> -->
    </div>
    <div>
      <!-- <Button to="/api">API 测试</Button> -->
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>

    <SendModelDialog ref="SendModelDialog" />
    <WithdrawalModalDialog ref="WithdrawalModalDialog" />
    <AssetlModalDialog ref="AssetlModalDialog" />
  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
import { DAEMON_CONFIG } from "../../config.js";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
import filters from "../common/js/filter.js";
import * as Utils from "web3-utils";
import wUtils from "../common/js/utils.js";
import eventhub from "../common/js/event.js";
import _ from "underscore";
import { setTimeout, clearTimeout } from "timers";

const { shell } = require("electron");

import SendModelDialog from "@/views/Dialog/sendModel.vue";
import WithdrawalModalDialog from "@/views/Dialog/withdrawalModal.vue";
import AssetlModalDialog from "@/views/Dialog/assetlModal.vue";

export default {
  data() {
    return {
      stateType: null,
      
      address: "",
      sendModal: false,
      columns: [
        {
          title: this.$t("home.table.Type"),
          key: "txType"
        },
        {
          title: this.$t("home.table.Amount"),
          key: "amount"
        },
        {
          title: this.$t("home.table.From"),
          key: "from",
          slot: "from"
        },
        {
          title: this.$t("home.table.To"),
          key: "to",
          slot: "to"
        },
        {
          title: this.$t("home.table.Date"),
          key: "date"
        },
        {
          title: this.$t("home.table.Status"),
          key: "status",
          render: (h, params) => {
            // console.log(params);
            if (params.row.status == "1") {
              this.stateType = "md-checkmark";
            } else {
              this.stateType = "md-close";
            }
            return h("Icon", {
              props: {
                type: `${this.stateType}`,
                size: 32
              }
            });
          }
        },
        {
          title: this.$t("home.table.detail"),
          key: "detail",
          slot: "action"
        }
      ],
      data: [],
      accountinfo: null,
      Fromvalue: "",
      Tovalue: "",
      LAMBvalue: "",
      confirmModal: false,
      passwordModal: false,
      walletPassword: null,
      txlist: [],
      Interval: null,
      transactiondata: null,
      txType: null,
      sum: null,
      pageNumber: 1,
      loading: true,
      
      
      columnsToken: [
        {
          title: this.$t('home.Token.name'),
          key: "denom",
          slot: "denom"
        },
        {
          title: this.$t('home.Token.amount'),
          key: "amount",
          slot: "amount"
        },
        {
          title: this.$t('home.Token.operation'),
          key: "action",
          slot: "action"
        }
      ],
      withdrawalModal: false,
      AssetlModal: false,
      AssetLAMBvalue: "",
      AssetSTOvalue: "",
      assetConfirmModal: false,
      exchangesStatus: "true"
    };
  },
  components: {
    MyTable,
    SendModelDialog,
    WithdrawalModalDialog,
    AssetlModalDialog
  },
  computed: {
    amount: value => {
      console.log(value);
    },
    balance:function(){
      return this.$store.getters.getblance;
    },
    DistributionReward:function(){
      return this.$store.getters.getDistributionReward;
    },
    coinList:function(){
      return this.$store.getters.getcoinList;
    }
  },
  async mounted() {
    this.address = await this.WalletBasicinfo();

    
    this.transactionList();

    this.Interval = setInterval(() => {
      
      this.transactionList();
    }, 1000 * 15);

    eventhub.$on("TransactionSuccess", data => {
      console.log("TransactionSuccess");
      
      this.transactionList();
    });

    eventhub.$on("TxType", data => {
      console.log("TxType", data);
      this.$data.txType = data;

      this.transactionList();
    });

    // var num = this.bigNum(0);
    // console.log(num);
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    // AssetLAMBvalueChane(){
    //  console.log('- -')
    //  this.$data.AssetSTOvalue = this.$data.AssetLAMBvalue/1000;
    // },
    // AssetSTOvalueChane(){
    //   this.$data.AssetLAMBvalue= this.$data.AssetSTOvalue *  1000;
    // },
    openwithdrawalModal() {
      // this.$data.withdrawalModal=true;
      this.$refs.WithdrawalModalDialog.open();
    },
    denomFormart(denom){
      //  return  denom..substr(1).toUpperCase()
       return  denom.substr(1).toUpperCase()
    },
    toDetail(row, index) {
      console.log(row, index);
      let id = index;
      // console.log(id);
      this.$router.push(`/detail/${row.txHash}`);
    },
    openSend() {
      // this.sendModal = true;

      this.$refs.SendModelDialog.open();
    },
    openAssert(row) {
      // this.$data.AssetlModal=true;
      this.$refs.AssetlModalDialog.open(row.amount, row.denom);
    },
    cointransaction(row) {
      this.$refs.SendModelDialog.open(row.amount, row.denom);
    },
    async transactionList(pagenum) {
      console.log("transactionList");
      var address = this.address;
      function checkaddress(address1) {
        if (address1.toUpperCase() == address.toUpperCase()) {
          return " -  ";
        } else {
          return " +  ";
        }
      }

      function subAddress(address) {
        if (address) {
          return address.substr(0, 8) + "...";
        } else {
          return "--";
        }
      }
      // this.$data.loading=false;
      try {
        // txType: txPledgeNew
        let param = {
          pageNum: this.$data.pageNumber,
          showNum: 10
        };
        if (this.txType != null || this.txType != "") {
          param.txType = this.txType;
        }

        let res = await ipc.callMain("transactionList", param);
        // console.log(res);
        if (!res.state) return;
        let tempData = res.data.data;
        this.$data.data = null;
        this.data = [];

        if (tempData) {
          // console.log(tempData);
          tempData.forEach(item => {
            if (item.error == undefined) {
              this.data.push({
                // amount: item.value==""?"--":(checkaddress(item.tx.value.msg[0].value.from_address) + item.tx.value.msg[0].value.amount[0].amount+item.tx.value.msg[0].value.amount[0].denom  ,
                amount: this.getamount(item) || "--",
                from: this.getSendAddress(item) || "--",
                to: this.getToAddress(item) || "--",
                txType: item.tags[0].value,
                date: filters.formatDate(item.timestamp),
                status: item.logs[0].success,
                txHash: item.txhash,
                timestampSort: new Date(item.timestamp).getTime()
              });
            } else {
              console.log("读取交易记录失败");
            }
          });
        }
        this.data.sort((item1, item2) => {
          return item2.timestampSort - item1.timestampSort;
        });
        this.$data.loading = false;
      } catch (ex) {
        console.log(ex);
        this.$data.loading = false;
      }
    },
    async WalletBasicinfo() {
      var result = null;
      try {
        let res = await ipc.callMain("defaultWalletBasicinfo", {});
        console.log(res);
        if (!res.state) return;
        result = res.data.address;
      } catch (ex) {}

      return result;
    },
    async changePage(pageNumber) {
      this.$data.pageNumber = pageNumber;
      this.transactionList();
    },
    openvalidator(value) {
      // console.log(value);
      let url = DAEMON_CONFIG.pledgeurl;
      shell.openExternal(url);
    },
    getamount(item) {
      var msg0 = item.tx.value.msg[0];
      var result;
      if (msg0.value != undefined) {
        if (msg0.value.amount != undefined) {
          if (msg0.value.amount instanceof Array) {
            result = this.bigNumTypeFormat( msg0.value.amount[0].amount , msg0.value.amount[0].denom);
          } else {
            result =this.bigNumTypeFormat( msg0.value.amount.amount , msg0.value.amount.denom);
          }
        } else {
          if (msg0.type == "lambda/MsgAssetDrop") {
            result =
              this.bigNumTypeFormat(msg0.value.asset.amount ,
              msg0.value.asset.denom )+
              "->" +
              this.bigNumTypeFormat(msg0.value.token.amount ,
              msg0.value.token.denom);
          } else if (msg0.type == "lambda/MsgAssetPledge") {
            result =
              this.bigNumTypeFormat(msg0.value.token.amount ,
              msg0.value.token.denom )+
              "->" +
              this.bigNumTypeFormat(msg0.value.asset.amount ,
              msg0.value.asset.denom);
          }else {
            item.tags.forEach(item => {
              if (item.key == "rewards") {
                result = this.bigNumTypeFormat(item.value.replace('ulamb',''),'lamb');
              }
            });
          }
        }
      } 
      return result;
    },
    getSendAddress(item) {
      var result;
      var msg0 = item.tx.value.msg[0];
      if (msg0.value.from_address != undefined) {
        result = msg0.value.from_address;
      } else if (msg0.value.address != undefined) {
        result = msg0.value.address;
      } else {
        item.tags.forEach(item => {
          if (item.key == "delegator") {
            result = item.value;
          }
        });
      }

      return result;
    },
    getToAddress(item){
      var value = item.tx.value.msg[0].value;
      var toaddress = value.to_address||value.validator_address;
      if(toaddress==undefined){
        item.tags.forEach(item => {
          if (item.key == "source-validator") {
            toaddress = item.value;
          }
        });
      }
      return toaddress

    }

  }
};
</script>

<style lang="less" scoped>
.container {
  .balance {
    width: 96%;
    margin: 0 auto;
    margin-top: 30px;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .account-info-container {
    width: 100%;
    height: 90px;
    .account-info-wrapper {
      width: 96%;
      height: 100%;
      border-bottom: 1px solid transparent;
      border-image: linear-gradient(to right, #339cae, #9167d3);
      border-image-slice: 10;
      margin: 0 auto;
      .account-item {
        height: 100%;
        position: relative;
        .item-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .title {
            font-size: 18px;
            color: #999999;
            text-align: center;
            white-space: nowrap;
          }
          .value {
            margin-top: 10px;
            font-size: 16px;
            text-align: center;
            color: #67a7db;
          }
        }
      }
    }
  }
  .mytable-container {
    padding-bottom: 30px;
    .operation-wrapper {
      height: 40px;
      .operation {
        width: 100%;
        height: 100%;
        position: relative;
        .search-wrapper {
          position: absolute;
          left: 28%;
        }
        .repay-wrapper {
          position: absolute;
          left: 70%;
          top: 25%;
        }
        .borrow-wrapper {
          position: absolute;
          left: 83%;
          top: 25%;
        }
        .send-wrapper {
          position: absolute;
          right: 0;
          top: 25%;
        }
      }
    }
  }
  .table-content-container {
    width: 100%;
    .table-content-wrapper {
      width: 96%;
      margin: 0 auto;
    }
  }
}
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>
