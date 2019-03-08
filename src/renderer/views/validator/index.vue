<template>
  <div class="customer-container">  
  <div class="setting-wrapper">
      <div style="margin: 6px">
        
        <Input @on-search="changeValidatorIP" v-model="ValidatorIP" search enter-button="submit" >
            <span slot="prepend">Validator Url</span>
          </Input>
        
    </div>

 
    
      <Mycard v-if="node_info.length>0" cardtitle="Node info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-for="item in node_info" class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{item[1]}}</span>
            </Col>
          </Row>
        </div>
      </Mycard>
      <Mycard v-if="sync_info.length>0" cardtitle="Sync info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-for="item in sync_info" class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{item[1]}}</span>
              <span style="color:red" v-if="item[0]=='catching_up'&&item[1]==true">Syncing blocks....</span>

            </Col>
          </Row>
        </div>
      </Mycard>
      <Mycard v-if="validator_info.length>0" cardtitle="Validator info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-for="item in validator_info" class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{item[1]}}</span>
            </Col>
          </Row>
        </div>
      </Mycard>
      <Mycard v-else cardtitle="Validator info" class="mb10">
        <div class="storage-content" slot="card-content">
            <Button  loading>Loading...</Button>
        </div>
      </Mycard>
    </div>
  </div>
</template>

<script>
// import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
import Mycard from "@/components/common/useful/Mycard.vue";
import https from "@/server/https.js";
import _ from "underscore";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");

export default {
  data() {
    return {
      node_info:[],
      sync_info:[],
      validator_info:[],
      ValidatorIP:''


    };
  },
  mounted() {
    this.getdata();
    this.$data.ValidatorIP=settings.get("user.node");
  },
  methods: {
    getdata() {
      var nodeBaseUrl = settings.get("user.node");
      var pra = {
        url: nodeBaseUrl + "status",
        data: {}
      };
      var _this = this;
            
       ipc.callMain("httpget", pra)
       .then(function(res){
         console.log(res)
         if(res.state&&res.data.data.result){
           _this.dataFormat(res)
           

         }

       })
       .catch(function(err){
         console.log(err)

       })

    },
    changeValidatorIP(){
      console.log('changeValidatorIP')
      //http://39.97.129.59:13657/
      //http://39.107.96.241:13657/
      //http://39.105.77.119:13657/
      
      

      var nodeBaseUrl =this.$data.ValidatorIP;
      var pra = {
              url:nodeBaseUrl +"status",
              data: {}
            };
      var _this=this;
            
       ipc.callMain("httpget", pra)
       .then(function(res){
         console.log(res)
         if(res.state&&res.data.data.result&&res.data.data.result.node_info){
           _this.dataFormat(res)
           settings.set('user', {
                              node: nodeBaseUrl
                            });

          _this.$Notice.success({
                    title: 'Switching Validator success',      
              });
           

         }else{
           _this.$Notice.error({
                    title: 'Switching Validator fail',
                    
                });
         }

       })
       .catch(function(err){
           _this.$Notice.error({
                    title: 'Switching Validator fail',
                    
                });

       })

    },
    dataFormat(res){
      
          this.$store.dispatch("setinfo", res.data.data.result);
      
          this.$data.node_info=_.pairs(res.data.data.result.node_info);
          this.$data.sync_info=_.pairs(res.data.data.result.sync_info);
          this.$data.validator_info=_.pairs(res.data.data.result.validator_info);
    }
  },
  computed: {
    
    
  },
  components: {
    // Header,
    MyTable,
    Mycard
  }
};
</script>

<style lang="less" scoped>
.customer-container {
  padding-bottom: 100px;
  .setting-wrapper {
    padding: 20px;
    .card-item {
      padding-bottom: 15px;
    }
    .title-wrapper {
      .title {
        font-weight: 500;
      }
    }
    .logout-container {
      padding-bottom: 40px;
      width: 100%;
      .logout-wrapper {
        width: 40%;
        margin: 0 auto;
        .logout-button {
          width: 100%;
          background-color: rgb(134, 22, 22);
        }
      }
    }
  }
}
</style>