<template>
  <div class="container">
    <Header/>

    <div class="account-info-container">
      <button @click="importtest">测试导入钱包的函数</button>
      <button @click="openwallet">打开创建的钱包</button>
      <button @click="openImportWalletwallet">打开导入的钱包</button>
      <div>
         
         <Upload :before-upload="beforeUpload">
            <Button icon="ios-cloud-upload-outline">上传key store文件 </Button>
        </Upload>
      </div>
      

    </div>


  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
import { DAEMON_CONFIG } from "../../config.js";
import https from "@/server/https.js";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
import filters from '../common/js/filter.js'
import * as Utils from 'web3-utils';


export default {
  data() {
    return {
      uploadFile:`http://localhost:${DAEMON_CONFIG.RPC_PORT}/ImportWallet/`

    };
  },
  components: {
    Header,
    MyTable
  },
  mounted() {

    
  },
  beforeDestroy(){
    

  },
  methods: {
    importtest(){
      var _this=this;
      //ImportWallet/:password/:name/:mnemonic
      var password=encodeURIComponent('qq123456');
      var name='testwallet';
      var mnemonic=encodeURIComponent('sorry opinion city view misery physical eyebrow hunt gift tragic apology empty');

       https.fetchget(
            `http://localhost:${DAEMON_CONFIG.RPC_PORT}/ImportWallet/${password}/${name}/${mnemonic}/`
          )
          .then(function(res){
            console.log(res)

          })
          .catch(function(err){
            console.log(res)

          })

      
      
    },
    openwallet(){
      var _this=this;
      //ImportWallet/:password/:name/:mnemonic
      var password=encodeURIComponent('qq123456');
      

       https.fetchget(
            `http://localhost:${DAEMON_CONFIG.RPC_PORT}/openWallet/${password}/`
          )
          .then(function(res){
            console.log(res)

          })
          .catch(function(err){
            console.log(err)

          })

      
      
    },
    openImportWalletwallet(){
      var _this=this;
      //ImportWallet/:password/:name/:mnemonic
      var password=encodeURIComponent('qq123456');
      

       https.fetchget(
            `http://localhost:${DAEMON_CONFIG.RPC_PORT}/openImportWallet/${password}/`
          )
          .then(function(res){
            console.log(res)

          })
          .catch(function(err){
            console.log(err)

          })

      
      
    },
    postdata(){
        https.fetchpost(`http://localhost:${DAEMON_CONFIG.RPC_PORT}/ImportWallet`,{
          a:1,
          b:2
        })
    },
    beforeUpload(file){

      
      console.log(file.path)
      var path=encodeURIComponent(file.path);

       https.fetchget(
            `http://localhost:${DAEMON_CONFIG.RPC_PORT}/ImportWalletByfile/${path}/`
          )
          .then(function(res){
            console.log(res)

          })
          .catch(function(err){
            console.log(err)

          })

      return false;

    }
  },
  computed: {
    balance:function(){
      if(this.$data.accountinfo&&this.$data.accountinfo.balance){
        return this.$data.accountinfo.balance/10000

      }else{
        return 0
      }
    }
  },
};
</script>

<style lang="less" scoped>
.container {
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
</style>
