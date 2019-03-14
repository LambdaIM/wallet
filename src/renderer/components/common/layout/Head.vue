<template>
  <div class="head-container">
    <Row class="head-wrapper">
      <Col span="5" class-name="head-logo-wrapper">
        <img src="../../../assets/img/logo.png" class="head-logo" alt="lambda">
      </Col>

      <Col span="16" offset="2" class-name="head-menu-wrapper">
        <div class="head-menu">
          <div class="head-menu-item">
            <router-link to="/home" class="item">Home</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/miner" class="item">Miner</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/customer" class="item">Customer</router-link>
          </div>
          <div class="head-menu-item">
            <router-link to="/validator" class="item">Validator</router-link>
          </div>

          <div class="head-menu-item overtext">
            <router-link to="/settings" class="item">
              <Icon style="display: inline;" type="md-settings" size="30"/>
              {{address}}
            </router-link>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
const ipc = require('electron-better-ipc');

export default {
  mounted() {
    this.WalletBasicinfo();
  },
  methods: {
    async WalletBasicinfo() {
      // console.log("importWallet");
      try {
        var res = await ipc.callMain("defaultWalletBasicinfo", {});
        
        this.$store.dispatch("setaddress", res.data.address);
      } catch (ex) {
        console.log(ex);
        console.log('没有找到默认钱包，是否需要重新创建账号');
        this.$Notice.error({
                    title: 'No default wallet was found',
                    desc: 'Please check your configuration file',
                    duration: 1000
                });
      }
    },
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    }
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
