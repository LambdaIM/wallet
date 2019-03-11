<template>
  <div class="footer-container">
    <div v-if="address!==null"  class="footer-wrapper">
      <!-- <span class="item etc">Validator id: -->
      <span    class="item etc">Validator:
        <Poptip word-wrap trigger="hover" width="300" :content="address">{{address}}</Poptip>
      </span>
      
      <span  class="item">Block height: {{height}}</span>
      <span  class="item" v-if="isSync==true" >Sync Block.... </span>
      <span class="item" v-else>Block time: {{time | formatDate}}</span>
    </div>
    <div v-else class="footer-wrapper">
      <span   class="item">Validator connecting ...</span>
    </div>
  </div>
</template>

<script>
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
export default {
  data() {
    return {
      address: null,
      height: null,
      time: null,
      isSync:true
    };
  },
  mounted() {
    var _this=this;
    _this.getValidatorInfo();
    setInterval(function(){
        _this.getValidatorInfo();
    },1000*30)
  },
  methods: {
    getValidatorInfo() {
      var nodeBaseUrl = settings.get("user.node");
      var pra = {
        url: nodeBaseUrl + "status",
        data: {}
      };
      var _this = this;
            
       ipc.callMain("httpgetstatus", pra)
       .then(function(res){
         console.log(res)
         if(res.state&&res.data.data.result){
           _this.dataFormat(res.data.data.result)
           if(res.data.data.result.node_info){
             _this.$store.dispatch("setinfo", res.data.data.result);
           }
         }

       })
       .catch(function(err){
         _this.$Notice.warning({
          title: "Validator Network connect timed out, please check your network."
        });

       })

    },
    dataFormat(result){
      try {
        this.$data.address=result.validator_info.address;
        this.$data.height=result.sync_info.latest_block_height;
        this.$data.time=result.sync_info.latest_block_time;
        this.$data.isSync=result.sync_info.catching_up;
                  
        
      } catch (error) {
        console.log(error)
        console.log(result)
        
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
