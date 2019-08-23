    
<template>
  <div class="customer-container">  
  <div class="setting-wrapper">
      <div style="margin: 6px">
         <!-- <Row>
        <Col span="12">
        <Input @on-search="changeValidatorIP" v-model="ValidatorIP"  >
            <span slot="prepend">Validator  Url</span>
          </Input>

        </Col>
        <Col span="12">
         <Input @on-search="changeValidatorIP" v-model="ValidatorIP"  >
            <span slot="prepend">Validator Url2</span>
        </Input>
        
        </Col>
    </Row> -->
        <Form ref="formInline"  :model="formInline" :rules="ruleInline" :label-width="120" label-position="left">
        <FormItem prop="ValidatorIP" :label="$t('Validator.ip')">
            <Input type="text"  v-model="formInline.ValidatorIP" :placeholder="$t('Validator_node')">
                
            </Input>
        </FormItem>
        
        <FormItem>
            <Button :loading="loadingbtn" type="primary" @click="handleSubmit('formInline')">{{$t('Validator.submit')}}</Button>
        </FormItem>
    </Form>
        

        
        
    </div>

 
    <div class="demo-spin-container" v-if="node_info.length==0">
       <Spin fix></Spin>
    </div>
      <Mycard  v-if="node_info.length>0" :cardtitle="$t('Validator.Node_info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row   v-for="item in node_info" class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{item[1]}}</span>
            </Col>
          </Row>
        </div>
      </Mycard>
      <Mycard v-if="sync_info.length>0" :cardtitle="$t('Validator.Sync_info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-for="item in sync_info" class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span v-if="item[0]!='latest_block_time'">{{item[1]}}</span>
              <span v-else>{{item[1]|blockFormatDate}}</span>

              <span style="color:red" v-if="item[0]=='catching_up'&&item[1]==true">{{$t("Validator.Sync_Block")}}</span>

            </Col>
          </Row>
        </div>
      </Mycard>
      <!-- <Mycard v-if="validator_info.length>0" :cardtitle="$t('Validator.Validator_info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-if="item[0]!='pub_key'" v-for="item in validator_info" class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{item[1]}}</span>
            </Col>
          </Row>
        </div>
      </Mycard> -->
      <!-- <Mycard v-else cardtitle="Validator info" class="mb10">
        <div class="storage-content" slot="card-content">
            <Button  loading>Loading...</Button>
        </div>
      </Mycard> -->
    </div>
  </div>
</template>

<script>
// import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
import Mycard from "@/components/common/useful/Mycard.vue";
import https from "@/server/https.js";
import _ from "underscore";
const {ipcRenderer: ipc} = require('electron-better-ipc');
const settings = require("electron-settings");
var  { DAEMON_CONFIG }  = require("../../../config.js");
import eventhub from "../../common/js/event.js";

export default {
  data() {
    return {
      node_info:[],
      sync_info:[],
      validator_info:[],
      
      formInline: {
                    ValidatorIP:'',
                    
                },
      ruleInline: {
                    ValidatorIP: [
                        { required: true, message: 'Please fill in the Validator IP.', trigger: 'blur' },
                        {  type: 'string', pattern: /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g , message: 'Must be IP'}
                    ]
      },
      loadingbtn:false
    };
  },
  mounted() {
    this.getdata();
    this.getValidatorIp();
    this.$data.formInline = {
      ValidatorIP:'',
      
    }

  },
  methods: {
    getValidatorIp(){
        ipc.callMain("getValidatorIp", {})
        .then((result)=>{
          if(result.state==true){
            this.$data.formInline = {
              ValidatorIP:result.data.ip         
            }

          }
          

        })
        .catch(ex=>{
          

        })
    },
    getdata() {
      var _this = this;
            
       ipc.callMain("blockchainstate", {})
       .then(function(res){
         console.log(res)
         if(res.state&&res.data){
           _this.dataFormat(res.data)
           
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
      
      
      
      var ValidatorIP =this.$data.formInline.ValidatorIP;
      var nodeBaseUrl=`http://${ValidatorIP}:13659/`
       
      var pra = {
              url:nodeBaseUrl +"node_info",
              data: {}
            };
      var _this=this;
      this.$data.loadingbtn=true;
            
       ipc.callMain("httpgetstatus", pra)
       .then(async function(res){
         _this.$data.loadingbtn=false;
         if(res.state&&res.data.data&&res.data.data){
          //  _this.dataFormat(res)
          //  _this.$store.dispatch("setinfo", res.data.data.result);
           settings.set('validator', {
                              ipv1: ValidatorIP
                            });
          
          
          _this.$Notice.success({
                    title: _this.$t("Validator.action.Switching_success"),      
              });
          var tempresult =await ipc.callMain("changeip", "" );
          eventhub.$emit('Refreshbalance');
           
         }else{
           _this.$Notice.error({
                    title: 'error',
                    desc:_this.$t("Validator.action.Switching_fail"),
                    
                });
         }
       })
       .catch(function(err){
         _this.$data.loadingbtn=false;
           _this.$Notice.error({
                    title: 'error',
                    desc:_this.$t("Validator.action.Switching_fail"),
                });
       })
    },
    dataFormat(data){
          console.log('dataFormat')
          this.$store.dispatch("setinfo", data);
      
          this.$data.node_info=_.pairs(data.nodeInfo);
          this.$data.sync_info=_.pairs({nodeSyncing:data.nodeSyncing});
          // this.$data.validator_info=_.pairs(res.data.data.result.validator_info);
    },
    handleSubmit(name) {
      console.log(name);

      this.$refs[name].validate((valid) => {
            if (valid) {
                // this.$Message.success('Success!');
                this.changeValidatorIP();
            } else {
                // this.$Message.error('Fail!');
            }
        })
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
 .demo-spin-container{
    	display: inline-block;
        width: 100%;
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>