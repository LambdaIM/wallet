<template>
  <div class="container">
    <!-- <Header/> -->
    <!-- <MyTable title="Transaction Records" class="mt20 mytable-container">
      <Table no-data-text="no Transaction" :columns="columns" :data="data" slot="content">
        <template slot-scope="{ row, index }" slot="hash">
          <Poptip word-wrap trigger="hover" width="200" :content="row.txHash">
            <a class="etc" @click="checkHash(row.txHash)">{{row.txHash}}</a>
          </Poptip>
        </template>

        <template slot-scope="{ row, index }" slot="time">
            <span >{{row.time | formatDate}}</span>
        </template>

        <template slot-scope="{ row, index }" slot="height">
            <a @click="checkHeight(row.height)">{{row.height}}</a>
        </template>

        <template slot-scope="{ row, index }" slot="from">
          <Poptip word-wrap trigger="hover" width="200" :content="row.from">
            <a class="etc" @click="checkAddress(row.from)">{{row.from}}</a>
          </Poptip>
        </template>

        <template slot-scope="{ row, index }" slot="to">
          <Poptip word-wrap trigger="hover" width="200" :content="row.to">
            <a class="etc" @click="checkAddress(row.to)">{{row.to}}</a>
          </Poptip>
        </template>
      </Table>
    </MyTable>-->
    <Mycard cardtitle="Transaction" class="mt20">
      <div class="transaction-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">TxHash:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkHash(data[id].txHash)" class="item-value">{{data[id].txHash}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">Block Height:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkHeight(data[id].height)" class="item-value">{{data[id].height}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">Time:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{data[id].time | formatDate}}</span>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">From:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkAddress(data[id].from)" class="item-value">{{data[id].from}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">To:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="checkAddress(data[id].to)" class="item-value">{{data[id].to}}</a>
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">Value:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span class="item-value">{{data[id].value | formatValue}}</span>
          </Col>
        </Row>
      </div>
    </Mycard>
  </div>
</template>

<script>
// import Header from "@/components/common/layout/Head.vue";
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
      columns: [
        {
          title: "TxHash",
          key: "txHash",
          slot: "hash"
        },
        {
          title: "Block Height",
          key: "height",
          slot: "height"
        },
        {
          title: "Time",
          key: "time",
          slot: "time"
        },
        {
          title: "From",
          key: "from",
          slot: "from"
        },
        {
          title: "To",
          key: "to",
          slot: "to"
        },
        {
          title: "Value",
          key: "value"
        }
      ],
      data: [],
      id: ""
    };
  },
  components: {
    Mycard
    // Header
  },
  created() {
    let address = this.$store.getters.getaddress.toLowerCase();
    // console.log(address);
    this.getpaylist(address);
  },
  // mounted() {
    
  // },
  methods: {
    checkHash(value) {
      // console.log(value);
      let url = `http://explorer.lambda.im/#/txhashdetail/${value}`;
      shell.openExternal(url);
    },
    checkAddress(value) {
      // console.log(value);
      let url = `http://explorer.lambda.im/#/address/${value}`;
      shell.openExternal(url);
    },
    checkHeight(value) {
      // console.log(value);
      let url = `http://explorer.lambda.im/#/blockdetail/${value}`;
      shell.openExternal(url);
    },
    getpaylist(address) {
      this.id = this.$route.params.id;
      console.log(this.id);
      console.log(address);
      ipc
        .callMain("httpget", {
          url: DAEMON_CONFIG.explorer + "api/tx/getTxAccountList",
          data: {
            accountHash: address,
            pageNum: 1,
            showNum: 10
          }
        })
        .then(res => {
          // console.log("getpaylist", res.data.data);
          if (res.data.data && res.data.data.code == 200) {
            // console.log(res.data.data.data.txList);
            this.data = res.data.data.data.txList;
            // console.log(this.data);
          }
        })
        .catch(function(err) {});
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
