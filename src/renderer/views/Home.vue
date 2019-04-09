<template>
  <div class="container">
    <p class="balance">Balance: {{balance|formatValue}} </p>

    <MyTable title="Latest Local Transaction Records" class="mt20 mytable-container">
      <div class="operation" slot="operation">
        <div class="send-wrapper">
          <!-- <Icon type="md-swap" @click="openSend()" size="32"/> -->
          <Button @click="openSend()" icon="md-swap">Transfer</Button>
        </div>
      </div>
      <Table :columns="columns" :data="data" slot="content">
        <template slot-scope="{ row, index }" slot="source">
          <Poptip word-wrap trigger="hover" width="200" :content="row.source">
            <span class="etc">{{row.source}}</span>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="toDetail(row,index)">View Detail</Button>
          <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
        </template>
      </Table>
    </MyTable>
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
        title="Send LAMB"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">From</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="Tovalue" placeholder="an LAMB address">
            <span slot="prepend">To</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">Amount</span>
            <span slot="append">LAMB</span>
          </Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">Submit</Button>
        </div>
      </Modal>

      <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>Transfer</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">From:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">To:</Col>
            <Col span="20" class-name="value">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">Amount:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}}</Col>
          </Row>
        </div>
        <!-- <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>-->
        <div slot="footer">
          <Button type="primary" @click="confirm">Confirm</Button>
        </div>
      </Modal>

      <Modal v-model="passwordModal" :styles="{top: '200px'}">
        <p class="mt40">
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="sendLAMBTx">Confirm</Button>
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




export default {
  data() {
    return {
      stateType: null,
      balance: 0,
      address: "",
      sendModal: false,
      columns: [
        {
          title: "Amount",
          key: "amount"
        },
        {
          title: "Source",
          key: "source",
          slot: "source"
        },
        {
          title: "Date",
          key: "date"
        },
        {
          title: "Type",
          key: "type"
        },
        {
          title: "Status",
          key: "status"
        },
        {
          title: "detail",
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
      transactiondata:null
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
  mounted() {
    this.getBalance();
    this.transactionList(this.address);
    this.Interval = setInterval(() => {
      // this.getBalance();
      // this.transactionList(this.address);
    }, 2000 * 5);
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    toDetail(row, index) {
      // console.log(row, index);
      let id = index;
      // console.log(id);
      this.$router.push(`/detail/${id}`);
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
      eventhub.$emit('TransferConfirm',this.$data.transactiondata);


    },
    sendLAMBTx() {
      if (this.walletPassword == null) {
        return;
      }
      this.TransferConfirm();
    },
    async TransferConfirm() {
      let password = this.walletPassword;
      try {
        var res = await ipc.callMain("transferConfirm", {
          password:password,
          transactiondata:this.$data.transactiondata
        });
        // console.log(res);
        if(!res.state) return;
        //todo  返回的错误信息需要提示
        this.$Message.info('ok');
        console.log(res)
        await this.getBalance();
        await this.transactionList(this.address);
        this.passwordModal = false;
      } catch (ex) {
        console.log(ex);
      }
    },
    async getBalance() {
      // console.log("importWallet");
      try {
        var res = await ipc.callMain("defaultWalletBlance", {});
        if(!res.state) return;
        this.address = res.data.address;
        this.$store.dispatch("setaddress", this.address);
        this.balance = res.data.balance ;
        console.log(this.balance);
      } catch (ex) {
        console.log(ex);
      }
    },
    async transactionList(address) {
      // console.log("getDefaultWalletBlance");
      function checkaddress(address1) {
        if (address1.toUpperCase() == address.toUpperCase()) {
          return " -  ";
        } else {
          return " +  ";
        }
      }
      function showaddress(address1, address2) {
        if (address1.toUpperCase() == address.toUpperCase()) {
          return "to  " + address2;
        } else {
          return "from  " + address1;
        }
      }
      try {
        let res = await ipc.callMain("transactionList", {});
        // console.log(res);
        if (!res.state) return;
        let tempData = res.data.data;
        this.data = [];
        if (tempData && tempData.code == 200) {
          tempData.data.txList.forEach(item => {
            this.data.push({
              amount: checkaddress(item.from) + filters.formatValue(item.value),
              source: showaddress(item.from, item.to),
              type: "Transaction",
              date: filters.formatDate(item.time),
              status: 1
            });
          });
        }
      } catch (ex) {
        console.log(ex);
      }
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
    padding-bottom: 100px;
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
