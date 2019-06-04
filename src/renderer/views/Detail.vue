<template>
  <div class="container">
    <Mycard :cardtitle="$t('transactiondetails.Transaction')" class="mt20">
      <div v-if="data!=null" class="transaction-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.TxHash')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkHash(data.txHash,txType)" class="item-value">{{data.txHash}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Type')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{txType}}
          </Col>
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
            <span class="item-value">{{data.create_time | formatDate}}</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.From')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkAddress(data.from)" class="item-value">{{data.from}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.To')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a v-if="!!data.to==true" @click="checkAddress(data.to)" class="item-value">{{data.to}}</a>
            <span v-else>--</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('transactiondetails.Value')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{data.value | formatValue}}</span>
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
      txType:''
    };
  },
  components: {
    Mycard,
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
    checkHash(value,txType) {
      // console.log(value);
      var explorer =DAEMON_CONFIG.explore;
      let url = `${explorer}#/txhashdetail/${value}/${txType}`;
      shell.openExternal(url);
    },
    checkAddress(value) {
      // console.log(value);
      var explorer =DAEMON_CONFIG.explore;
      let url = `${explorer}/#/address/${value}`;
      shell.openExternal(url);
    },
    checkHeight(value) {
      // console.log(value);
      var explorer =DAEMON_CONFIG.explore;
      let url = `${explorer}/#/blockdetail/${value}`;
      shell.openExternal(url);
    },
    // getpaylist(address) {
    //   this.id = this.$route.params.id;
    //   console.log(this.id);
    //   console.log(address);
    //   ipc
    //     .callMain("httpget", {
    //       url: DAEMON_CONFIG.explorer + "api/tx/getTxAccountList",
    //       data: {
    //         accountHash: address,
    //         pageNum: 1,
    //         showNum: 10
    //       }
    //     })
    //     .then(res => {
    //       // console.log("getpaylist", res.data.data);
    //       if (res.data.data && res.data.data.code == 200) {
    //         // console.log(res.data.data.data.txList);
    //         this.data = res.data.data.data.txList;
    //         // console.log(this.data);
    //       }
    //     })
    //     .catch(function(err) {});
    // }
    async transactionInfo() {
     let hash = this.$route.params.id;
     let txType = this.$route.params.txType;
     this.$data.txType=txType;
      try {
        var res = await ipc.callMain("transactionInfo", {
          hash,
          txType
        });
        // console.log(res);
        let tempData = res.data.data;
        if(tempData.code==200){
        this.$data.data=tempData.data;
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
