<template>
  <div class="head-container">
    <Row class="head-wrapper">
      <Col span="5" class-name="head-logo-wrapper">
        <img src="../../../assets/img/logo.png" class="head-logo" alt="lambda">
      </Col>

      <Col span="16" offset="2" class-name="head-menu-wrapper">
        <div v-if="address!=undefined&&address!=''"  class="head-menu">
          <div class="head-menu-item">
            <router-link to="/home" class="item">Home</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/home" class="item">Miner</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/home" class="item">Customer</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/home" class="item">Validator</router-link>
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
      </Col>
    </Row>

  </div>
</template>

<script>
const settings = require("electron-settings");

export default {
  methods: {
    onCopy: function(e) {
      this.$Message.info("You just copied: " + e.text);
    },
    onError: function(e) {
      this.$Message.info("Failed to copy texts");
    },
    
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
