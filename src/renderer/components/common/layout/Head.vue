<template>
  <div class="head-container">
    <Row class="head-wrapper">
      <Col span="5" class-name="head-logo-wrapper">
        <img src="../../../assets/img/logo.png" class="head-logo" alt="lambda">
      </Col>

      <Col span="16" offset="2" v-if="login==true" class-name="head-menu-wrapper">
        <div class="head-menu">
          <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.home") }}</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.miner") }}</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.validator") }}</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/sign" class="item">{{ $t("head.sign") }}</router-link>
          </div>

          <div class="head-menu-item overtext">
            <router-link to="/settings" class="item">
              <Icon style="display: inline;" type="md-settings" size="30"/>
            </router-link>
          </div>

          <div
            v-clipboard:copy="address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            class="head-menu-item overtext"
            style="cursor: pointer"
          >
            <div class="item">
              <Icon style="    display: inline;" type="ios-copy" size="20"/>
              {{address}}
            </div>
          </div>
        </div>
      </Col>
      <Col v-else  span="16" offset="2" class-name="head-menu-wrapper">
        <div class="head-menu">
            <div class="head-menu-item" style="text-align: right;    margin-right: 80px">
               <Dropdown @on-click="selectlang">
                              <a href="javascript:void(0)" style="color:white">
                                  {{lang[langnow]}}
                                  <!-- 1111 -->
                                  <Icon type="ios-arrow-down"></Icon>
                              </a>
                              <DropdownMenu slot="list">
                                  <DropdownItem name="en">English</DropdownItem>
                                  <DropdownItem name="zh">简体中文</DropdownItem>
                              </DropdownMenu>
                          </Dropdown>
            </div>
        </div>
      </Col>
      
    </Row>
  </div>
</template>

<script>
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
import {mapState} from 'vuex';
export default {
  data() {
    return {
      // log: false
      lang:{
        zh:'简体中文',
        en:'English'
      },
      langnow:this.$i18n.locale
    };
  },
  created() {
    // this.isLogin();
    
  },
  mounted() {
   let login=settings.get("isopenfile");
   this.$store.dispatch("set", login); 
   if(login){
     this.WalletBasicinfo();
   }
  },
  beforeUpdate(){
    let login=settings.get("isopenfile");
   this.$store.dispatch("set", login); 
   if(login){
     this.WalletBasicinfo();
   }
  },
  methods: {
    onCopy(e) {
      this.$Message.info(this.$t("head.action.You_just_copied") + e.text);
    },
    onError(e) {
      this.$Message.info(this.$t("head.action.Failed_to_copy_texts"));
    },
    async WalletBasicinfo() {
      console.log("WalletBasicinfo");
      try {
        let res = await ipc.callMain("defaultWalletBasicinfo", {});
        console.log(res);
        if (!res.state) return;
        this.$store.dispatch("setaddress", res.data.address);
        console.log("WalletBasicinfo",res.data.address);
      } catch (ex) {
        console.log(ex);
        console.log("没有找到默认钱包，是否需要重新创建账号");
        this.$Notice.error({
          title: this.$t("head.action.No_wallet_found"),
          desc: this.$t("head.action.configuration_file"),
          duration: 1000
        });
      }
    },
    selectlang(item){
      console.log(item);
      this.$i18n.locale  = item;
      this.$data.langnow = item;
      settings.set('set', {language: item});
      window.location.reload();
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    ...mapState({
      login:state=>{
        console.log('---******')
        return state.account.loginState
        }
    })
    // login:function(){
    //   return this.$store.getters.getLogin;
    // }
  }
};
</script>

<style lang="less" scoped>
.head-container {
  width: 100%;
  height: 100px;
  background: url(../../../assets/img/bgs_01.jpg);
  background-size: cover;
  .head-wrapper {
    width: 100%;
    height: 100px;
    .head-logo-wrapper {
      margin-left: 20px;
      padding-top: 20px;
    }
    .head-menu-wrapper {
      height: 100px;
      .head-menu {
        display: flex;
        height: 100%;
        justify-content: space-around;
        align-items: center;
        .overtext {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .head-menu-item {
          width: 100%;
          text-align: center;
          &:hover:not(:last-child) {
            border-bottom: 2px solid transparent;
            border-image: linear-gradient(to right, #339cae, #9167d3);
            border-image-slice: 10;
          }
          .item {
            display: inline-block;
            width: 100%;
            color: #fff;
            font-size: 18px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
