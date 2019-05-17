<template>
  <div class="container">
    <p class="balance">{{$t('home.Balance')}}: {{balance|formatValue}} 
        <span style="color:green">
        <a @click="openvalidator">{{ $t("home.profits_pledge_system") }}</a>
      </span>
    </p>

    <MyTable :title="$t('home.Latest_Transaction')" class="mt20 mytable-container">
      <div class="operation" slot="operation">
        <div class="send-wrapper">
          <!-- <Icon type="md-swap" @click="openSend()" size="32"/> -->
          <Button @click="openSend()" icon="md-swap">{{$t('home.Transfer')}}</Button>
        </div>
      </div>
      <Table :loading="loading"  :columns="columns" :data="data" slot="content" >
        <template slot-scope="{ row, index }" slot="source">
          <Poptip word-wrap trigger="hover" width="200" :content="row.source">
            <span class="etc">{{row.source}}</span>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="toDetail(row,index)">{{ $t("home.View_Detail") }}</Button>
          <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
        </template>
      </Table>
    </MyTable>
          <div class="tc " >
            <Page :total="sum" show-elevator @on-change="changePage"></Page>
          </div>
    <div>
          <Button to="/api">API 测试</Button>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
    </div>

    <div class="modal-container">
      <Modal
        loading
        v-model="sendModal"
        :title="$t('home.Modal1.Send_LAMB')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('home.Modal1.To')}}</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>{{$t('home.Modal1.Transfer')}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
            <Col span="20" class-name="value">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} LAMB</Col>
          </Row>
          
        </div>
        <!-- <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>-->
        <div slot="footer">
          <Button type="primary" @click="confirm">{{$t('home.Modal1.Confirm')}}</Button>
        </div>
      </Modal>

 
    </div>
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
import _ from "underscore"


export default {
  data() {
    return {
      stateType: null,
      balance: 0,
      address: "",
      sendModal: false,
      columns: [
        {
          title: this.$t("home.table.Type"),
          key: "txType",
            filters: [
              {
                label: "txSend",
                value: "txSend"
              },
              {
                label: "txPledgeNew",
                value: "txPledgeNew"
              },
              {
                label: "txPledgeRevert",
                value: "txPledgeRevert"
              },
              {
                label: "txOrder",
                value: "txOrder"
              },
              {
                label: "txDeal",
                value: "txDeal"
              },
              {
                label: "txProof",
                value: "txProof"
              },
              {
                label: "txCancelOrder",
                value: "txCancelOrder"
              },
              {
                label: "txValidatorUpdate",
                value: "txValidatorUpdate"
              }
            ],
            filterRemote:function(value, row){
              eventhub.$emit('TxType',value[0]);
            },
            filterMultiple: false
        },
        {
          title: this.$t("home.table.Amount"),
          key: "amount"
        },
        {
          title: this.$t("home.table.Source"),
          key: "source",
          slot: "source"
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
      transactiondata:null,
      txType:null,
      sum:null,
      pageNumber:1,
      loading:true
    };
  },
  components: {
    MyTable
  },
  computed: {
    amount: value => {
      console.log(value);
    }
  },
 async mounted() {
    this.address= await this.WalletBasicinfo();
    

    this.getBalance();
    this.transactionList();
    
    this.Interval = setInterval(() => {
      this.getBalance();
      this.transactionList();
    }, 2000 * 5);

    eventhub.$on("TransactionSuccess", (data) => {
      console.log('TransactionSuccess');
      this.getBalance();
      this.transactionList();
     
    });

    eventhub.$on("TxType", (data) => {
      console.log('TxType',data);
      this.$data.txType=data;
      
      this.transactionList()
      
     
    });

    

  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    toDetail(row, index) {
      console.log(row, index);
      let id = index;
      // console.log(id);
      this.$router.push(`/detail/${row.txHash}/${row.txType}`);
    },
    openSend() {
      this.sendModal = true;
    },
    async transfer(amount) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata=null;
      try {
        let res = await ipc.callMain("transfer", {
          to,
          amount,
          gas
        });
        // console.log(res);
        if (res.state) {
          this.$data.transactiondata=res.data
          this.sendcancel();
          this.confirmModal = true;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    preSendLAMB() {
      let from = this.address;
      let to = this.Tovalue;
      let value = parseFloat(this.LAMBvalue);
      if (to == from) {
        this.$Notice.warning({
          title: "You can't transfer LAMB to yourself."
        });
        return;
      }
      if (value <= 0 || value > wUtils.bigToNumber(this.balance) ) {
        // need to alert
        this.$Notice.warning({
          title: "Please check the balance and the amount of transfer."
        });
        return;
      }
      value = wUtils.numberToBig(value) ;
      if (Utils.isAddress(to) == false) {
        // need to alert
        this.$Notice.warning({
          title: "Check the forwarding address"
        });

        return;
      }

      if (isNaN(value)) {
        this.$Notice.warning({
          title: "Check the amount"
        });
        return;
      }
      this.transfer(value);
    },
    sendcancel() {
      this.sendModal = false;
    },
    confirm() {
      this.confirmModal = false;
      // this.passwordModal = true;
      eventhub.$emit('TxConfirm',this.$data.transactiondata);


    },
    async getBalance() {
      // console.log("importWallet");
      try {
        var res = await ipc.callMain("defaultWalletBlance", {});
        if(!res.state) return;
        // this.address = res.data.address;
        // this.$store.dispatch("setaddress", this.address);
        this.balance = res.data.balance ;
        this.$store.dispatch("setblance", this.balance);
        console.log(this.balance);
      } catch (ex) {
        console.log(ex);
      }
    },
    async transactionList(pagenum) {
      console.log("transactionList");
      var address=this.address;
      function checkaddress(address1) {
        if (address1.toUpperCase() == address.toUpperCase()) {
          return " -  ";
        } else {
          return " +  ";
        }
      }
      function showaddress(address1, address2) {
        if (address1.toUpperCase() == address.toUpperCase()) {
          if(address2!=""){
            return "to  " + address2;
          }else{
            return  "--";
          }
          
        } else {
          return "from  " + address1;
        }
      }
      this.$data.loading=true;
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
        this.$data.data=null;
        this.data = [];
        console.log(tempData);
        if (tempData && tempData.code == 200&&tempData.data.txList!=null) {
          this.$data.sum=tempData.data.count;
          tempData.data.txList.forEach(item => {
            this.data.push({
              amount: item.value==""?"--":(checkaddress(item.from) + filters.formatValue(item.value)),
              source: showaddress(item.from, item.to),
              txType: item.txType,
              date: filters.formatDate(item.time),
              status: 1,
              txHash:item.txHash
            });
          });
        }
        this.$data.loading=false;
      } catch (ex) {
        console.log(ex);
        this.$data.loading=false;
      }
    },
    async WalletBasicinfo() {
      var result=null;
      try {
        let res = await ipc.callMain("defaultWalletBasicinfo", {});
        console.log(res);
        if (!res.state) return;
         result = res.data.address;
      } catch (ex) {

      }
      
      return result;
    },
    async changePage(pageNumber){
        this.$data.pageNumber=pageNumber;
        this.transactionList();
    },
      openvalidator(value) {
        // console.log(value);
        let url = DAEMON_CONFIG.pledgeurl;
        shell.openExternal(url);
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
