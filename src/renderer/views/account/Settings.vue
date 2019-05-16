<template>
  <div class="setting-container">
    <div class="setting-wrapper">
      <Mycard v-if="walletInfo" :cardtitle="$t('seting.Wallet_Info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row  class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{$t("seting.Wallet_Name")}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{walletInfo.name}}</span>
               <Button @click="modal2 = true" type="primary" shape="circle" icon="ios-create"></Button>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{$t("seting.Account_Address")}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{walletInfo.address}}</span>
              
    <Button 
      v-clipboard:copy="walletInfo.address"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
      type="primary"
      shape="circle"
      icon="ios-copy"
      ></Button>
            <!-- <Button
                v-clipboard:copy="walletInfo.address"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="primary"
                shape="circle"
                icon="ios-copy"
              ></Button> -->
            </Col>
          </Row>
        </div>
      </Mycard>

      <Mycard  cardtitle="Storage Info" class="mb10">
        <div v-if="pledgeMinerData!=null" class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="3" class-name="title-wrapper">
              <span class="title">Storage</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>Used {{pledgeMinerData.use_size/(1024*1024)}} TB / {{pledgeMinerData.size/(1024*1024)}} TB</span>
              <p>
                <Progress :percent="calProgress" :stroke-width="5"/>
              </p>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="3" class-name="title-wrapper">
              <span class="title">Pledge</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{pledgeMinerData.money|formatValue}} LAMB</span>
            </Col>
          </Row>
        </div>
      </Mycard>

      <Mycard :cardtitle="$t('seting.Privat_Key_Info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <!-- <Col span="4" class-name="title-wrapper">
              <span class="title">Private Key</span>
            </Col>
            <Col span="6" class-name="content-wrapper">
              <span>{{hidden}}</span>
            </Col>

            <Col span="4" class-name="content-wrapper">
              <a>Private Key Visible</a>
            </Col> -->

            <Col span="4" class-name="content-wrapper">
              <a @click="openkeystore" >{{$t("seting.Keystore_File_Backup")}}</a>
            </Col>
          </Row>

          <!-- <Row class-name="card-item">
            <Col span="20">
              <p
                class="notice tc"
              >Wallet Password can’t be recovered, you can only create a new Wallet using Private Key once forgotten</p>
            </Col>
          </Row> -->
        </div>
      </Mycard>
                 <Mycard v-if="getstore.length>0" :cardtitle="$t('seting.Validator_Node_info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row v-if="item[0]!='pub_key'" v-for="item in getstore"  class-name="card-item">
            <Col  span="4" class-name="title-wrapper">
              <span class="title">{{item[0]}}</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{item[1]}}</span>
            </Col>
          </Row>
          <Row   class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              &nbsp;
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span><router-link to="/validator" class="item">{{$t("seting.Switch_Validator")}}</router-link></span>
            </Col>
          </Row>
          
          

          
        </div>
      </Mycard>
      <Mycard v-if="getstore.length==0" :cardtitle="$t('seting.Validator_Node_info')" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row   class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              &nbsp;
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span><router-link to="/validator" class="item">{{$t("seting.Switch_Validator")}}</router-link></span>
            </Col>
          </Row>
        </div>
      </Mycard>

      <!-- <Mycard cardtitle="Store Path for File" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">Store Path for File</span>
            </Col>
            <Col span="16" class-name="content-wrapper">
              <a>F:\program\BumoWallet-win32-x64-v1.1.0\BumoWallet-win32-x64\buchain\data</a>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">KeyStore File Path</span>
            </Col>
            <Col span="16" class-name="content-wrapper">
              <a>F:\program\BumoWallet-win32-x64-v1.1.0\BumoWallet-win32-x64\wallets\kerinlinlin.wallet</a>
            </Col>
          </Row>
        </div>
      </Mycard> -->

      <Mycard :cardtitle="$t('seting.Version')" class="mb20">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">{{$t("seting.Current_Version")}}</span>
            </Col>
            <Col span="3" class-name="content-wrapper">
              <span>V0.0.1</span>
            </Col>
            <!-- <Col span="3" class-name="content-wrapper">
              <a>Check Version</a>
            </Col> -->
          </Row>
        </div>
      </Mycard>

      <div class="logout-container">
        <div class="logout-wrapper">
          <button class="btn logout-button" @click="logout">{{$t('seting.Logout')}}</button>
        </div>
      </div>


          <Modal v-model="modal2" width="360">
            <p slot="header" >
                <span>{{$t('seting.edit_name')}}</span>
            </p>
            <div style="text-align:center">
                <p v-if="walletInfo!=null">  <Input v-model="editvalue" :placeholder="walletInfo.name"  /></p>
                
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="editName">{{$t('seting.Submit')}}</Button>
            </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Mycard from "@/components/common/useful/Mycard.vue";

import https from "@/server/https.js";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
import { DAEMON_CONFIG } from "../../../config.js";
import _ from "underscore";


export default {
  data() {
    return {
      used: 3.04,
      total: 5,
      hidden: "*********************************",
      progressPercent: "",
      walletInfo:null,
      pledgeMinerData:null,
      modal2:false,
      editvalue:""

    };
  },
  mounted() {
    this.getAccountInfo();
    // this.pledgeMiner();
  },
  methods: {
     onCopy: function (e) {
       this.$Message.info('You just copied: ' + e.text);
      
    },
    onError: function (e) {
      this.$Message.info('Failed to copy texts');
      
    },
    logout() {
      settings.set('isopenfile',false)
      this.$store.dispatch("set", false); 
      this.$router.push("/");
      // console.log('8888')
    },
   async getAccountInfo() {
      var _this=this;
      var res = await ipc.callMain("defaultWalletBasicinfo", {});
      _this.$data.walletInfo=res.data
       
    },
    openkeystore(){
      ipc.callMain('openkeystore', {})
    },
    async pledgeMiner(){
       console.log('**********')
          try{
            var result = await ipc.callMain("pledgeMiner", {
            })
            console.log(result)
            if(result.state==true){
              this.$data.pledgeMinerData=result.data
            }else{
              this.$Message.info('read pledgeMiner info error');
            }
            
          }
          catch(ex){
            console.log(ex);
            this.$Message.info(ex.errormsg);
          }
     },
    async editName(){
      console.log('********** editName')
      var name=this.$data.editvalue;
      try{
        var res = await ipc.callMain("editWalletName", {name});

      console.log(res)
      if(res.state){
        this.$Message.info(this.$t("seting.action.Modified_success"));
        this.$data.modal2=false;
        this.getAccountInfo();
      }else{
        this.$Message.info(this.$t("seting.action.Modification_failed"));

      }

      }catch(ex){
        this.$Message.info(this.$t("seting.action.Modification_failed"));
      }
      
      
      // _this.$data.walletInfo=res.data

    }
  },
  computed: {
    calProgress() {
      this.progressPercent = (this.$data.pledgeMinerData.use_size / this.$data.pledgeMinerData.size).toFixed(4) * 100;
      // console.log(this.progressPercent);
      return this.progressPercent;
    },
    getstore(){
      console.log(' - -')
      try {
      // this.$data.node_info=this.$store.getters.info.node_info;
        return _.pairs(this.$store.getters.info.validator_info);  
      } catch (error) {
        return [];
      }
      
    }
  },
  components: {
    Mycard
  }
};
</script>

<style lang="less" scoped>
.setting-container {
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
