<template>
  <div class="container">
    <Spin size="large" fix v-if="loading == true"></Spin>
    <Mycard :cardtitle="$t('transactiondetails.Transaction')" class="mt20">
      <div v-if="data!=null" class="transaction-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.TxHash')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkHash(data.txhash,txType)" class="item-value">{{data.txhash}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Type')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">{{data.tags[0].value}}</Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Block_Height')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkHeight(data.height)" class="item-value">{{data.height}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Time')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{data.timestamp | formatDate}}</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.From')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkAddress(sender)" class="item-value">{{sender}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.To')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper" v-if="typeof getToAddress =='string'" >
            <a v-if="!!getToAddress==true" @click="checkAddress(getToAddress)" class="item-value">{{getToAddress}}</a>
            <span v-else>--</span>
          </Col>
          <Col  v-else span="20" class-name="content-wrapper"  >
          <span v-for="oneaddress in  getToAddress">
            <a   @click="checkAddress(oneaddress)" class="item-value">{{oneaddress}}</a>
            <br/>
          </span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Value')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{amount}}</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Fee')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{fee}}</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.GaseUsed')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{data.gas_used}}</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.GasWanted')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{data.gas_wanted}}</span>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Fee')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{memo}}</span>
          </Col>
        </Row>
      </div>
    </Mycard>
  </div>
</template>

<script>
import Mycard from "@/components/common/useful/Mycard.vue";
import { DAEMON_CONFIG } from "../../config.js";
import https from "@/server/https.js";
const { shell } = require("electron");
const ipc = require("electron-better-ipc");
import filters from "../common/js/filter.js";
import * as Utils from "web3-utils";

export default {
  data() {
    return {
      data: null,
      id: "",
      txType: "",
      loading: false
    };
  },
  components: {
    Mycard
  },
  created() {
    // let address = this.$store.getters.getaddress.toLowerCase();
    this.transactionInfo();
    // console.log(address);
    // this.getpaylist(address);
  },
  // mounted() {

  // },
  methods: {
    checkHash(value, txType) {
      // console.log(value);
      var explorer = DAEMON_CONFIG.explore;
      let url = `${explorer}#/txDetail/${value}`;
      shell.openExternal(url);
    },
    checkAddress(value) {
      // console.log(value);
      var explorer = DAEMON_CONFIG.explore;
      let url = `${explorer}/#/address/${value}`;
      shell.openExternal(url);
    },
    checkHeight(value) {
      // console.log(value);
      var explorer = DAEMON_CONFIG.explore;
      let url = `${explorer}/#/blockDetail/${value}`;
      shell.openExternal(url);
    },
    async transactionInfo() {
      this.loading = true;
      let hash = this.$route.params.id;
      let txType = this.$route.params.txType;
      this.$data.txType = txType;
      try {
        var res = await ipc.callMain("transactionInfo", {
          hash,
          txType
        });
        console.log(res.data);

        this.$data.data = res.data;
        this.loading = false;
      } catch (ex) {
        this.loading = false;
        console.log(ex);
      }
    }
  },
  computed: {
    sender() {
      var item = this.$data.data;

      var result = "--";
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
    to() {
      var msg = this.$data.data.tx.value.msg;
      return msg[0].value.to_address;
    },
    amount() {
      var msg0 = this.$data.data.tx.value.msg[0];

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
            this.$data.data.tags.forEach(item => {
              if (item.key == "rewards") {
                result=this.bigNumAdd(item.value.replace('ulamb',''),result);
                
              }
            });
            result =this.bigNumTypeFormat(result,'ulamb')
          }
        }
      } 
      return result;
    },
    getToAddress(){
      var item = this.$data.data;
      var value = item.tx.value.msg[0].value;
      var toaddress=''
      if(item.tags[0].value=='withdraw_delegator_reward'){
        toaddress=[]
        item.tags.forEach(item => {
                  if (item.key == "source-validator") {
                    toaddress.push(item.value);
                  }
                });

        

      }else{
              toaddress = value.to_address||value.validator_address;
              if(toaddress==undefined){
                item.tags.forEach(item => {
                  if (item.key == "source-validator") {
                    toaddress = item.value;
                  }
                });
              }

      }

      return toaddress

    },
    memo() {
      var memo = this.$data.data.tx.value.memo;
      return memo;
    },
    fee(){
      var fee = this.$data.data.tx.value.fee;
      if(fee.amount==null){
        return '无'
      }
      return this.bigNumTypeFormat(fee.amount[0].amount,fee.amount[0].denom);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  .transaction-content {
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
  }
}
</style>
