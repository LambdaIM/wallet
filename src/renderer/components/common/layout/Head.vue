<template>
  <div class="head-container">
    <Row class="head-wrapper">
      <Col
        span="5"
        class-name="head-logo-wrapper"
      >
      <img
        src="../../../assets/img/logo.png"
        class="head-logo"
        alt="lambda"
      >
      </Col>

      <Col
        span="16"
        offset="2"
        v-if="login==true"
        class-name="head-menu-wrapper"
      >
      <div class="head-menu">
        <div class="head-menu-item">
          <router-link
            to="/home"
            class="item"
          >{{ $t("head.home") }}</router-link>
        </div>
        <div class="head-menu-item">
          <router-link
            to="/staking"
            class="item"
          >{{ $t("head.validator") }}</router-link>
        </div>
        <div class="head-menu-item">
          <router-link
            to="/partner"
            class="item"
          >{{ $t("head.partner") }}</router-link>
        </div>

        <div class="head-menu-item">
          <router-link
            to="/sign"
            class="item"
          >{{ $t("head.sign") }}</router-link>
        </div>

        <div class="head-menu-item overtext">
          <router-link
            to="/settings"
            class="item"
          >
            <Icon
              style="display: inline;"
              type="md-settings"
              size="30"
            />
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
            <Icon
              style="    display: inline;"
              type="ios-copy"
              size="20"
            />
            {{address}}
          </div>
        </div>
      </div>
      </Col>
      <Col
        v-else
        span="16"
        offset="2"
        class-name="head-menu-wrapper"
      >
      <div class="head-menu">
        <div
          class="head-menu-item"
          style="text-align: right;    margin-right: 80px"
        >
          <Dropdown v-if="showChange" @on-click="selectlang">
            <a
              href="javascript:void(0)"
              style="color:white"
            >
            <span>
              <svg
                v-if="langnow =='en'"
                t="1561106310862"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2302"
                width="32"
                height="25"
              >
                <path
                  d="M0 859.7h1024V177.3H0z"
                  fill="#00458F"
                  p-id="2303"
                ></path>
                <path
                  d="M1023.4 416.2H614V177.3h-205v238.9H0v204.6h409v238.9h205V620.8h409.4z"
                  fill="#FFFFFF"
                  p-id="2304"
                ></path>
                <path
                  d="M1023.4 781.1L117.1 177.3H0v79.3l905.1 603.1h118.3z"
                  fill="#FFFFFF"
                  p-id="2305"
                ></path>
                <path
                  d="M0 781.1l906-603.8h117.4v79.3L118 859.7H0z"
                  fill="#FFFFFF"
                  p-id="2306"
                ></path>
                <path
                  d="M1023.4 459H571.2V177.3H452.2V459H0v119H452.2v281.7h119V578h452.2z"
                  fill="#CC3440"
                  p-id="2307"
                ></path>
                <path
                  d="M1023.4 857.8v-54l-275-182.9H667.2l356.2 236.9z m0-680.5H942.2L614 395.7v20.1h50.5l358.9-238.5zM356 620.8L0.1 857.8v1.6h77.7l331.6-220v-18.5h-53.4zM0 177.3v54l276.6 184.8h81.9L0 177.3z"
                  fill="#CC3440"
                  p-id="2308"
                ></path>
              </svg>
            </span>
              <svg
                v-if="langnow =='zh'"
                t="1561106763567"
                class="icon"
                viewBox="0 0 1546 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3099"
                width="32"
                height="25"
              >
                <path
                  d="M11.322 1017.71h1520.904V6.29H11.322v1011.42zM1536 1021.484v-3.774 3.774zM5.032 1024V0h1533.484v1024H5.032z"
                  fill="#353636"
                  p-id="3100"
                ></path>
                <path
                  d="M8.806 2.516H1536v1017.71H8.806z"
                  fill="#D64B24"
                  p-id="3101"
                ></path>
                <path
                  d="M264.177 118.25l32.708 99.381h104.412l-84.285 60.384 31.45 99.38-84.285-61.64-84.285 61.64 32.708-99.38-84.286-60.384h104.413z m271.725-52.835l-1.258 35.224 31.45 12.58-33.966 8.806-1.258 33.965L512 127.057l-32.708 7.547 21.386-26.417-17.612-28.934 31.45 13.838z m116.992 111.96L637.8 207.569l23.901 23.901-33.965-5.032-15.096 30.192-5.032-33.966-33.966-5.032 30.192-15.095-5.032-33.966 23.902 23.902z m-35.223 138.38l11.322 32.707h33.965l-27.675 20.128 10.063 32.707-27.675-20.127-27.676 20.127 11.322-32.707-27.676-20.128h33.966z m-81.77 105.67l-2.515 33.966 32.707 12.58-33.965 8.805-2.516 33.966L512 481.808l-33.966 8.806 22.644-26.417-18.87-28.934 32.708 12.58z"
                  fill="#FBDC00"
                  p-id="3102"
                ></path>
              </svg>
              <!-- 1111 -->
              <svg
              t="1561107977281"
              class="icon arrow"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4038"
              width="12"
              height="12"
            >
              <path
                d="M99.7376 238.0288l409.9328 443.6736 416-440.8064c18.2656-19.5584 47.9616-19.4944 66.304 0.1536 18.3424 19.6352 18.4192 51.4304-4.5568 70.9888L548.3264 782.272c-6.6304 6.3488-14.464 13.632-18.688 14.848-17.2416 7.4368-38.4256 3.712-55.8336-11.1488L28.5824 309.1712c-13.7216-19.7248-13.7984-51.6608 4.544-71.3088 18.3552-19.648 48.1664-19.584 66.6112 0.1664z"
                p-id="4039"
                fill="#ffffff"
              ></path>
            </svg>
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
    <div  class="demo-spin-col" v-if="balanceLoading" >
    <Spin  fix> <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>{{$t("head.action.txloading")}}</Spin>
    </div>
  </div>
</template>

<script>
import eventhub from '../../../common/js/event.js';
import { mapState } from 'vuex';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const settings = require('electron-settings');


export default {
  data() {
    return {
      // log: false
      lang: {
        zh: '简体中文',
        en: 'English'
      },
      langnow: this.$i18n.locale,
      balanceLoading: false,
      balanceLoadingPre: ''
    };
  },
  created() {
    // this.isLogin();
  },
  mounted() {
    let login = settings.get('isopenfilev1');

    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.$data.sequencePre = this.$data.sequence;
      this.$data.balanceLoading = true;
      this.getBalance();
    });
    eventhub.$on('Refreshbalance', data => {
      console.log('TransactionSuccess');
      this.getBalance();
    });


    eventhub.$on('login', data => {
      console.log('loginSuccess');

      this.WalletBasicinfo();
      this.getBalance();
      setInterval(() => {
        this.WalletBasicinfo();
        this.getBalance();
      }, 1000 * 15);
    });
    if (login) {
      this.$store.dispatch('setLogin', login);
      eventhub.$emit('login');
    }
  },
  methods: {
    onCopy(e) {
      this.$Message.info(this.$t('head.action.You_just_copied') + e.text);
    },
    onError(e) {
      this.$Message.info(this.$t('head.action.Failed_to_copy_texts'));
    },
    getBalance() {
      // console.log("importWallet");
      if (this.$data.timeid != undefined) {
        clearTimeout(this.$data.timeid);
      }

      this.$data.timeid = setTimeout(async () => {
        try {
          console.log('读取余额');
          var res = await ipc.callMain('defaultWalletBlance', {});
          if (!res.state) return;

          var balance = res.data.Liquid.balance;
          var balanceSto = res.data.Liquid.balanceSto;
          var coinList = res.data.Liquid.coins || [];
          var DistributionReward = 0;
          var Delegation = res.data.Delegation;
          if (res.data.DistributionReward instanceof Array) {
            res.data.DistributionReward.forEach(item => {
              if (item.denom == 'ulamb') {
                DistributionReward = item.amount || 0;
              }
            });
          }
          this.$data.sequence = res.data.Liquid.sequence;


          this.$store.dispatch('setblance', balance);
          this.$store.dispatch('setDistributionReward', DistributionReward);
          this.$store.dispatch('setbalanceSto', balanceSto);
          this.$store.dispatch('setcoinList', coinList);
          this.$store.dispatch('setDelegation', Delegation);
          console.log('余额信息：', balance);
          if (this.$data.sequencePre != this.$data.sequence) {
            this.$data.balanceLoading = false;
          }
        } catch (ex) {
          console.log(ex);
        }
      }, 50);
    },
    async WalletBasicinfo() {
      console.log('WalletBasicinfo');
      try {
        let res = await ipc.callMain('defaultWalletBasicinfo', {});
        console.log(res);
        if (!res.state) return;
        this.$store.dispatch('setaddress', res.data.address);
        console.log('WalletBasicinfo', res.data.address);
      } catch (ex) {
        console.log(ex);
        console.log('没有找到默认钱包，是否需要重新创建账号');
        this.$Notice.error({
          title: this.$t('head.action.No_wallet_found'),
          desc: this.$t('head.action.configuration_file'),
          duration: 1000
        });
      }
    },
    selectlang(item) {
      console.log(item);
      this.$i18n.locale = item;
      this.$data.langnow = item;
      settings.set('set', { language: item });
      window.location.reload();
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    ...mapState({
      login: state => {
        console.log('---******');
        return state.account.loginState;
      }
    }),
    showChange() {
      var name = this.$route.name;
      var list = ['Register', 'Success', 'Export'];
      if (list.indexOf(name) > -1) {
        return false;
      } else {
        return true;
      }
    }
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
          .activeMenu{
              border-bottom: 2px solid transparent;
              border-image: linear-gradient(to right, #339cae, #9167d3);
              border-image-slice: 10;
          }
        }
      }
    }
  }
  .arrow{
    margin-bottom: 6px;
    margin-left: 6px;
  }
  .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    .demo-spin-col{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 888;
    // border: 1px solid #eee;
    }
</style>
