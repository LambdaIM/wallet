<template>
  <div class="footer-container">
    <div v-if="getstore.address!==null"  class="footer-wrapper">
      <!-- <span class="item etc">Validator id: -->

      <span    class="item etc">
        <!-- <Poptip word-wrap trigger="hover" width="300" :content="getIPAndAddress">

          <router-link v-if="login"
            to="/validator"
            class="item"
          ><Badge :type="getNetColour" :text="networkType"></Badge><Icon   type="ios-arrow-dropdown" /></router-link>
          <span v-else>
            <Badge :type="getNetColour" :text="networkType"></Badge>
          </span>

          </Poptip> -->
              <Dropdown @on-click="Switchnetwork" >
                <a style="color:white"  href="javascript:void(0)" >
                    <Icon :color="getNetColour" type="md-cloud" />{{networkType}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>

                <DropdownMenu slot="list">
                    <DropdownItem name="mainnet" style="text-align: left;"> <Icon color="#19be6b" type="md-cloud" />   {{$t('foot.defaultmaster')}}  </DropdownItem>
                    <DropdownItem name="testnet" style="text-align: left;"> <Icon color="#FFC125" type="md-cloud" /> {{$t('foot.Defaulttestnode')}} </DropdownItem>
                    <DropdownItem v-if="login" name="customnet" style="text-align: left;" divided><Icon color="#EE30A7" type="md-cloud" />{{$t('foot.Customnode')}} </DropdownItem>

                </DropdownMenu>
            </Dropdown>



      </span>

      <span  class="item">{{ $t("foot.block_height") }}: {{getstore.height}}</span>
      <span  class="item" v-if="getstore.isSync==true" >{{ $t("foot.sync_block") }}</span>
      <span class="item" v-else>{{ $t("foot.block_time") }}: {{getstore.time | formatRelativeDate}}</span>

    </div>
    <div v-else class="footer-wrapper">

       <span    class="item etc">
    <Dropdown @on-click="Switchnetwork">
        <a class="item" href="javascript:void(0)">
            {{ $t("foot.validator_connecting") }}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem name="mainnet" style="text-align: left;"> <Icon color="#19be6b" type="md-cloud" />   {{$t('foot.defaultmaster')}}  </DropdownItem>
            <DropdownItem name="testnet" style="text-align: left;"> <Icon color="#FFC125" type="md-cloud" /> {{$t('foot.Defaulttestnode')}} </DropdownItem>
            <DropdownItem v-if="login" name="customnet" style="text-align: left;" divided><Icon color="#EE30A7" type="md-cloud" />{{$t('foot.Customnode')}} </DropdownItem>
        </DropdownMenu>
    </Dropdown>
       </span>
    </div>

  </div>
</template>

<script>
import eventhub from '../../../common/js/event.js';
import { mapState } from 'vuex';
import { DAEMON_CONFIG } from '../../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const settings = require('electron-settings');


export default {
  data() {
    return {
      address: null,
      height: null,
      time: null,
      isSync: true,
      ValidatorIP: ''
    };
  },
  mounted() {
    var _this = this;
    _this.getValidatorIp();
    _this.getValidatorInfo();
    setInterval(function() {
      _this.getValidatorIp();
      _this.getValidatorInfo();
    }, 1000 * 10);
    eventhub.$on('Refreshbalance', data => {
      console.log('Refreshbalance');
      _this.getValidatorIp();
      _this.getValidatorInfo();
    });
  },
  methods: {
    changeValidatorIP(ValidatorIP) {
      console.log('changeValidatorIP');
      var nodeBaseUrl = `http://${ValidatorIP}:13659/`;

      var pra = {
        url: nodeBaseUrl + 'node_info',
        data: {}
      };
      var _this = this;

      ipc.callMain('httpgetstatus', pra)
        .then(async function(res) {
          if (res.state && res.data) {
            settings.set('validator', {
              ipv1: ValidatorIP
            });

            _this.$Notice.success({
              title: _this.$t('Validator.action.Switching_success')
            });
            var tempresult = await ipc.callMain('changeip', '');
            eventhub.$emit('Refreshbalance');
            setTimeout(() => {
            // _this.$router.go(0);
              location.reload();
            }, 100);
          } else {
            _this.$Notice.error({
              title: 'error',
              desc: _this.$t('Validator.action.Switching_fail')

            });
          }
        })
        .catch(function(err) {
          _this.$Notice.error({
            title: 'error',
            desc: _this.$t('Validator.action.Switching_fail')
          });
        });
    },
    Switchnetwork(netType) {
      if (netType == 'mainnet') {
        // DAEMON_CONFIG.mainnetip
        this.changeValidatorIP(DAEMON_CONFIG.mainnetip);
      } else if (netType == 'testnet') {
        // DAEMON_CONFIG.testnetip
        this.changeValidatorIP(DAEMON_CONFIG.testnetip);
      } else {
        this.$router.push('/validator');
      }
    },
    getValidatorIp() {
      ipc.callMain('getValidatorIp', {})
        .then(result => {
          if (result.state == true) {
            this.$data.ValidatorIP = result.data.ip;
          }
        })
        .catch(ex => {


        });
    },
    getValidatorInfo() {
      var _this = this;

      ipc.callMain('blockchainstate', {})
        .then(function(res) {
          if (res.state && res.data && res.data.nodeInfo && res.data.nodeInfo.error == undefined) {
          //  _this.dataFormat(res.data.data.result)
            _this.$store.dispatch('setinfo', res.data);
          } else {
            console.log('连接的验证节点异常');
            _this.$store.dispatch('setinfo', null);
            _this.$Notice.warning({
              title: 'error',
              desc: _this.$t('foot.linkerror')
            });
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$store.dispatch('setinfo', null);
          _this.$Notice.warning({
            title: 'error',
            desc: _this.$t('foot.action.Validator_time_out')

          });
        });
    },
    dataFormat(result) {
      console.log(result);
      if (result == null) {
        return {
          address: null
        };
      }

      return {
        address: result.nodeInfo.moniker || result.nodeInfo.id,
        height: result.blockLatest.block_meta.header.height,
        time: result.blockLatest.block_meta.header.time,
        isSync: result.nodeSyncing
      };
      // try {
      //   this.$data.address=result.validator_info.address;
      //   this.$data.height=result.sync_info.latest_block_height;
      //   this.$data.time=result.sync_info.latest_block_time;
      //   this.$data.isSync=result.sync_info.catching_up;



      // } catch (error) {
      //   console.log(error)
      //   console.log(result)

      // }
    }
  },
  computed: {
    getstore() {
      try {
      // this.$data.node_info=this.$store.getters.info.node_info;
        return this.dataFormat(this.$store.getters.info);
        // return _.pairs(this.$store.getters.info.validator_info);
      } catch (error) {
        return [];
      }
    },
    getIPAndAddress() {
      try {
      // this.$data.node_info=this.$store.getters.info.node_info;
        var result = this.dataFormat(this.$store.getters.info);
        return this.ValidatorIP + '   ' + result.address;
        // return _.pairs(this.$store.getters.info.validator_info);
      } catch (error) {
        return '';
      }
    },
    getNetColour() {
      // 主网测试网和不同的服务器用颜色区分
      var network = ''; var result = '';
      try {
        network = this.$store.getters.info.nodeInfo.network;
      } catch (error) {

      }
      var mianpattern = /lambda-chain-?([1-9]\d*.\d*|0.\d*[1-9]\d*)/;
      var testpattern = /lambda-chain-test-?([1-9]\d*.\d*|0.\d*[1-9]\d*)/;

      if (mianpattern.test(network)) {
        // result = this.$t('foot.mainnet');
        result = '1';
      } else if (testpattern.test(network)) {
        // result = this.$t('foot.testnet');
        result = '2';
      } else {
        // result = this.$t('foot.cusnet');
        result = '3';
      }
      if (this.$data.ValidatorIP == DAEMON_CONFIG.mainnetip) {
        // result += this.$t('foot.defaultmaster');
        result += '.1';
      } else if (this.$data.ValidatorIP == DAEMON_CONFIG.testnetip) {
        // result += this.$t('foot.Defaulttestnode');
        result += '.2';
      } else {
        // result += this.$t('foot.Customnode');
        result += '.3';
      }
      var colour = {
        '1.1': '#19be6b',
        '1.2': '#EE30A7',
        '1.3': '#EE30A7',
        '2.1': '#EE30A7',
        '2.2': '#FFC125',
        '2.3': '#EE30A7',
        '3.1': '#EE30A7',
        '3.2': '#EE30A7',
        '3.3': '#EE30A7'
      };
      // this.$data.netcolour
      return colour[result];
    },
    networkType() {
      var network = ''; var result = '';
      try {
        network = this.$store.getters.info.nodeInfo.network;
      } catch (error) {

      }
      var mianpattern = /lambda-chain-?([1-9]\d*.\d*|0.\d*[1-9]\d*)/;
      var testpattern = /lambda-chain-test-?([1-9]\d*.\d*|0.\d*[1-9]\d*)/;

      if (mianpattern.test(network)) {
        result = this.$t('foot.mainnet');
        window.netType = 1;
      } else if (testpattern.test(network)) {
        result = this.$t('foot.testnet');
        window.netType = 2;
      } else {
        result = this.$t('foot.cusnet');
        window.netType = 3;
      }
      // if (this.$data.ValidatorIP == DAEMON_CONFIG.mainnetip) {
      //   result += this.$t('foot.defaultmaster');
      //   // this.$data.netcolour += '.1';
      // } else if (this.$data.ValidatorIP == DAEMON_CONFIG.testnetip) {
      //   result += this.$t('foot.Defaulttestnode');
      //   // this.$data.netcolour += '.2';
      // } else {
      //   result += this.$t('foot.Customnode');
      //   // this.$data.netcolour += '.3';
      // }
      return result + `[${this.$t('foot.validator')}：` + this.$store.getters.info.nodeInfo.moniker + ']';
      // lambda-chain-test3.0  测试网
      // lambda-chain-3.0      主网
      // 主网默认ip 39.107.247.86
      // 测试网络默认ip 47.93.196.236
    },

    ...mapState({
      login: state => {
        console.log('---******');
        return state.account.loginState;
      }
    })
  }
};
</script>

<style lang="less" scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  z-index: 1;
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
