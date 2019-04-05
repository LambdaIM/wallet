<template>
  <div class="head-container">
    <Row class="head-wrapper">
      <Col span="5" class-name="head-logo-wrapper">
        <img src="../../../assets/img/logo.png" class="head-logo" alt="lambda">
      </Col>

      <Col span="16" offset="2" class-name="head-menu-wrapper">
        <div v-if="address!=undefined&&address!=''"  class="head-menu">
          <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.menu1") }}</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.menu2") }}</router-link>
          </div>
          <!-- <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.menu3") }}</router-link>
          </div> -->
          <div class="head-menu-item">
            <router-link to="/home" class="item">{{ $t("head.menu4") }}</router-link>
            <!-- ios-checkmark  ios-loading -->
          </div>
          <div class="head-menu-item">
            <router-link to="/sign" class="item">{{ $t("head.menu5") }} </router-link>
            <!-- ios-checkmark  ios-loading -->
          </div>

          <div class="head-menu-item overtext">
            <router-link to="/settings" class="item">
              <Icon style="    display: inline;" type="md-settings" size="30"/>
              
            </router-link>
          </div>
          <div v-clipboard:copy="address"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"  class="head-menu-item overtext" style="cursor: pointer">
            
              <div class="item">
                <Icon style="    display: inline;" type="ios-copy" size="20"/>
               {{address}}
              </div>
          </div>
        </div>
        <div class="head-menu" v-else>
          <div class="head-menu-item" style="text-align: right;    margin-right: 40px">
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
const settings = require("electron-settings");

export default {
  data(){
    return {
      lang:{
        zh:'简体中文',
        en:'English'
      },
      langnow:this.$i18n.locale
    }
  },
  methods: {
    onCopy: function(e) {
      this.$Message.info(this.$t('head.action.pass1') + e.text);
    },
    onError: function(e) {
      this.$Message.info(this.$t('head.action.pass2'));
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
    getWalletName: function() {
      console.log("-----");
      return this.$store.getters.getWalletName;
    },
    islogin(){
      console.log(settings.get('isopenfile'))
      return settings.get('isopenfile')
    }
  }
};
</script>

<style lang="less" scoped>
.head-container {
  position: relative;
  width: 100%;
  height: 80px;
  background: #09334c;
  background-size: cover;
  // .btn-container{
  //   .item{
  //     position: fixed;
  //     right: 0;
  //     width: 10px;
  //     height: 10px;
  //     background-color: rgb(206, 48, 48);
  //   }
  // }
  // .item1 {
  //   // width: 25px;
  //   position: fixed;
  //   right: 120px;
  //   top: 2px;
  // }
  // .item2 {
  //   width: 20px;
  //   position: fixed;
  //   right: 60px;
  //   top: 2px;
  // }
  .head-wrapper {
    width: 100%;
    height: 80px;
    .head-logo-wrapper {
      margin-left: 20px;
      padding-top: 15px;
      .head-logo {
        width: 200px;
        height: 50px;
      }
    }
    .head-menu-wrapper {
      height: 80px;
      // margin-top: 36px;
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
