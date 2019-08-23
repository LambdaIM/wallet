<template>
  <div class="footer-container">
    <div v-if="getstore.address!==null"  class="footer-wrapper">
      <!-- <span class="item etc">Validator id: -->
      <span    class="item etc">{{ $t("foot.validator") }}:
        <Poptip word-wrap trigger="hover" width="300" :content="getIPAndAddress">{{getstore.address}}</Poptip>
      </span>
      
      <span  class="item">{{ $t("foot.block_height") }}: {{getstore.height}}</span>
      <span  class="item" v-if="getstore.isSync==true" >{{ $t("foot.sync_block") }}</span>
      <span class="item" v-else>{{ $t("foot.block_time") }}: {{getstore.time | formatRelativeDate}}</span>
    </div>
    <div v-else class="footer-wrapper">
      <span   class="item">{{ $t("foot.validator_connecting") }}</span>
    </div>
  </div>
</template>

<script>
const {ipcRenderer: ipc} = require('electron-better-ipc');
const settings = require("electron-settings");
var  { DAEMON_CONFIG }  = require("../../../../config.js");
import eventhub from "../../../common/js/event.js";

export default {
  data() {
    return {
      address: null,
      height: null,
      time: null,
      isSync:true,
      ValidatorIP:''
    };
  },
  mounted() {
    var _this=this;
    _this.getValidatorIp();
    _this.getValidatorInfo();
    setInterval(function(){
        _this.getValidatorIp();
        _this.getValidatorInfo();
    },1000*10)
    eventhub.$on("Refreshbalance", data => {
        console.log("Refreshbalance");
        _this.getValidatorIp();
        _this.getValidatorInfo();
      });
  },
  methods: {
    getValidatorIp(){
        ipc.callMain("getValidatorIp", {})
        .then((result)=>{
          if(result.state==true){
            this.$data.ValidatorIP = result.data.ip;         

          }
          

        })
        .catch(ex=>{
          

        })
    },
    getValidatorInfo() {
      var _this = this;
         
       ipc.callMain("blockchainstate", {})
       .then(function(res){
         
         if(res.state&&res.data&&res.data.nodeInfo&&res.data.nodeInfo.error==undefined){
          //  _this.dataFormat(res.data.data.result)
          _this.$store.dispatch("setinfo", res.data);
           
         }else{
           console.log('连接的验证节点异常')
            _this.$Notice.warning({
               title: _this.$t("foot.linkerror")
            });  
         }
       })
       .catch(function(err){
         _this.$Notice.warning({
          title: _this.$t("foot.action.Validator_time_out")
        });
       })
    },
    dataFormat(result){
      console.log(result)

      return {
        address:result.nodeInfo.moniker||result.nodeInfo.id,
        height:result.blockLatest.block_meta.header.height,
        time:result.blockLatest.block_meta.header.time,
        isSync:result.nodeSyncing,
      }
      // try {
      //   this.$data.address=result.validator_info.address;
      //   this.$data.height=result.sync_info.latest_block_height;
      //   this.$data.time=result.sync_info.latest_block_time;
      //   this.$data.isSync=result.sync_info.catching_up;

                  
        
      // } catch (error) {
      //   console.log(error)
      //   console.log(result)
        
      // }
      
    }
  },
  computed: {
    getstore(){
      
      try {
      // this.$data.node_info=this.$store.getters.info.node_info;
        return this.dataFormat(this.$store.getters.info);
        // return _.pairs(this.$store.getters.info.validator_info);  
      } catch (error) {
        return [];
      }
      
    },
    getIPAndAddress(){
      
      try {
      // this.$data.node_info=this.$store.getters.info.node_info;
       var result =  this.dataFormat(this.$store.getters.info);
       return  this.ValidatorIP+"   "+result.address;
        // return _.pairs(this.$store.getters.info.validator_info);  
      } catch (error) {
        return "";
      }
      
    }
  },
};
</script>

<style lang="less" scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  z-index: 9999;
  background: #09334c;
  background-size: cover;
  .footer-wrapper {
    width: 96%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item {
      width: 30%;
      height: 40px;
      // background-color: rgb(211, 211, 211);
      font-size: 14px;
      color: #fff;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>