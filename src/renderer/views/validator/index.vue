    
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
        <FormItem prop="ValidatorIP" label="Validator IP">
            <Input type="text"  v-model="formInline.ValidatorIP" placeholder="Validator Basic Url">
                
            </Input>
        </FormItem>
        
        <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')">Submit</Button>
        </FormItem>
    </Form>
        

        
        
    </div>

 
    
      <Mycard  v-if="node_info.length>0" cardtitle="Node info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-if="item[0]=='network'"  v-for="item in node_info" class-name="card-item">
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
              <span v-if="item[0]!='latest_block_time'">{{item[1]}}</span>
              <span v-else>{{item[1]|formatDate}}</span>

              <span style="color:red" v-if="item[0]=='catching_up'&&item[1]==true">Syncing blocks....</span>

            </Col>
          </Row>
        </div>
      </Mycard>
      <Mycard v-if="validator_info.length>0" cardtitle="Validator info" class="mb10">
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
var  { DAEMON_CONFIG }  = require("../../../config.js");

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
      }
    };
  },
  mounted() {
    this.getdata();
    this.$data.formInline = {
      ValidatorIP:DAEMON_CONFIG.ValidatorIp(),
      
    }

  },
  methods: {
    getdata() {
      var nodeBaseUrl = DAEMON_CONFIG.LambdaNetwork();;
      var pra = {
        url: nodeBaseUrl + "status",
        data: {}
      };
      var _this = this;
            
       ipc.callMain("httpgetstatus", pra)
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
      
      
      
      var ValidatorIP =this.$data.formInline.ValidatorIP;
      var nodeBaseUrl=`http://${ValidatorIP}:13657/`
       
      var pra = {
              url:nodeBaseUrl +"status",
              data: {}
            };
      var _this=this;
            
       ipc.callMain("httpgetstatus", pra)
       .then(function(res){
         console.log(res)
         if(res.state&&res.data.data.result&&res.data.data.result.node_info){
           _this.dataFormat(res)
           _this.$store.dispatch("setinfo", res.data.data.result);
           settings.set('validator', {
                              ip: ValidatorIP
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
</style>