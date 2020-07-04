
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <blancebar/>
    <div class="testcoin">

         <Row>
        <Col span="11">
        <span v-if="$role('home.guide')" style="    font-size: 15px;">
          {{$t('testcoin.miningaward')}}：<span style="color: #67a7db;">{{MinerRewards|Lambformat}}</span>
        </span>
        <span v-else>
          &nbsp;
        </span>
        </Col>
        <Col span="13" style="    text-align: right;">
          <a @click="gettestcoin">{{$t('testcoin.txtbtn')}}</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a @click="getcommunitylink">{{$t('testcoin.community')}} </a>

        </Col>
    </Row>
    </div>
    <Menu :key="time" ref="menu" @on-select="transferClick" mode="horizontal"  v-bind:active-name="activeItem">
        <MenuItem to="/home" name="txlist">
            <Icon type="ios-paper" />
            {{$t('home.Latest_Transaction')}}
        </MenuItem>
        <MenuItem to="/home/coinlist" name="coinlist">
            <Icon type="ios-paper" />
            {{$t('home.token')}}
        </MenuItem>
        <!-- <MenuItem to="/home/localtxlist" name="localtxlist">
            <Icon type="ios-paper" />
            {{$t('home.Latest_Transaction_local')}}
        </MenuItem> -->
        <Submenu    name="other">
            <template slot="title">
              <Icon type="md-swap"></Icon>
              {{$t('home.Transfer')}}
            </template>
            <MenuGroup :title="$t('home.Transfer')">
                <MenuItem  name="openTransfer">{{$t('home.Transfer')}}</MenuItem>
            </MenuGroup>
            <MenuGroup :title="$t('home.Withdraw')">
                <MenuItem  name="openWithdraw">{{$t('home.Withdraw')}}</MenuItem>
                <MenuItem  name="openWithdrawmarket"> {{$t('home.Withdrawmarketrevenue')}}  </MenuItem>
                <MenuItem v-if="$role('home.tx.Withdrawprofit')" name="openWithdrawprofit">{{$t('home.Withdrawprofit')}}</MenuItem>
                <MenuItem v-if="$role('home.tx.Minerprofit')" name="openMinerprofit">{{$t('somemodel.Extractstorageandmininrewards')}} </MenuItem>
                <MenuItem v-if="$role('home.tx.Minerprofit')" name="openMinerOrder">{{$t('orderrevenue.WithdraworderCommission')}} </MenuItem>

                <MenuItem v-if="$role('home.tx.Minerprofit')" name="openAuthorizedMarket"> {{$t('Assetincomepop.title')}} </MenuItem>
            </MenuGroup>


        </Submenu>
        <!-- <MenuItem v-if="$role('home.subaccount')"   to="/home/subaccount" name="subaccount">
            <Icon type="md-list" />
            {{$t('home.subaccount')}}
        </MenuItem> -->
        <!-- <MenuItem v-if="$role('home.guide')" to="/home/guide" name="guide">
            <Icon type="md-map" />
            {{$t('home.miningguide')}}
        </MenuItem> -->
        <MenuItem v-if="$role('market.sellspace')" to="/home/mysellorder" name="mysellorder">
            <Icon type="md-pricetags" />
            {{$t('marketpage.sellspace')}}
        </MenuItem>

        <MenuItem v-if="$role('home.Myorderlist')"  to="/home/myorderlist" name="myorderlist">
            <Icon type="ios-paper" />
            {{$t('marketpage.orderlist')}}
        </MenuItem>
        <MenuItem v-if="$role('home.lambdas3')"  to="/home/lambdas3" name="lambdas3">
            <Icon type="ios-construct" />
            S3
        </MenuItem>
        <MenuItem   to="/home/Marketoperation" name="Marketoperation">
            <Icon type="md-football" />
            {{$t('home.Marketoperation')}}
        </MenuItem>

    </Menu>
      </div>
      <router-view></router-view>

    <SendModelDialog ref="SendModelDialog" />
    <WithdrawalModalDialog ref="WithdrawalModalDialog" />
    <DistributionModal ref="DistributionModal" />
    <MinerWithdrawalModal ref="MinerWithdrawalModalDialog"/>
    <MinerWithdrawaOrderlModal ref="MinerWithdrawaOrderlModalDialog"/>
    <WithdrawalMarketModal ref="WithdrawalMarketModalDialog" />
    <withdrawalAuthorizedMarketModal ref="withdrawalAuthorizedMarketModalDialog" />

  </div>
</template>
<script>
import blancebar from './blancebar.vue';
import eventhub from '../../common/js/event.js';

import SendModelDialog from '@/views/Dialog/sendModel.vue';
import WithdrawalModalDialog from '@/views/Dialog/withdrawalModal.vue';
import DistributionModal from '@/views/Dialog/distributionModal.vue';

import MinerWithdrawalModal from '@/views/Dialog/MinerWithdrawalModal.vue';
import MinerWithdrawaOrderlModal from '@/views/Dialog/MinerWithdrawaOrderlModal.vue';

import WithdrawalMarketModal from '@/views/Dialog/withdrawalMarketModal.vue';

import withdrawalAuthorizedMarketModal from '@/views/Dialog/withdrawalAuthorizedMarketModal.vue';

import introJs from 'intro.js';
import homesteps from './homesteps.js';
import Introtip from '../../common/js/Introtip.js';

const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      activeItem: this.$route.name,
      time: '',
      MinerRewards: 0
    };
  },
  components: {
    blancebar,
    SendModelDialog,
    WithdrawalModalDialog,
    DistributionModal,
    MinerWithdrawalModal,
    MinerWithdrawaOrderlModal,
    WithdrawalMarketModal,
    withdrawalAuthorizedMarketModal
  },
  mounted() {
    this.getMinerRewards();
    this.$data.Interval = setInterval(async () => {
      this.getMinerRewards();
    }, 1000 * 15);
    //= =
    var role = this.$store.getters.role;
    console.log(Introtip);
    var hasreadtip = Introtip.gettip('home');
    var _this = this;
    if (role != null && hasreadtip != true) {
      setTimeout(() => {
        var Options = {
          prevLabel: this.$t('Guidepage.prevLabel'),
          nextLabel: this.$t('Guidepage.nextLabel'),
          skipLabel: this.$t('Guidepage.skipLabel'),
          doneLabel: this.$t('Guidepage.doneLabel'),
          steps: []
        };
        homesteps.forEach(item => {
          if (document.querySelector(item.element)) {
            item.intro = _this.$t(`Guidepage.${item.element.replace('#', '')}`);
            Options.steps.push(item);
          }
        });
        introJs().setOptions(Options).start()
          .oncomplete(function() {
            Introtip.settip('home');
            console.log(1);
          })
          .onexit(function(data) {
            console.log(data);
            Introtip.settip('home');
            console.log(2);
          });
      }, 1000);
    }
    //= =
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    transferClick(name) {
      console.log(name);

      this.$data.time = name;

      switch (name) {
        case 'openTransfer':this.$refs.SendModelDialog.open(); this.$data.activeItem = this.$route.name; break;
        case 'openWithdraw':this.$refs.WithdrawalModalDialog.open(); this.$data.activeItem = this.$route.name; break;
        case 'openWithdrawprofit':this.$refs.DistributionModal.open(); this.$data.activeItem = this.$route.name; break;
        case 'openMinerprofit':this.$refs.MinerWithdrawalModalDialog.open(); this.$data.activeItem = this.$route.name; break;
        case 'openMinerOrder':this.$refs.MinerWithdrawaOrderlModalDialog.open(); this.$data.activeItem = this.$route.name; break;
        case 'openWithdrawmarket': this.$refs.WithdrawalMarketModalDialog.open(); this.$data.activeItem = this.$route.name; break;

        case 'openAuthorizedMarket': this.$refs.withdrawalAuthorizedMarketModalDialog.open(); this.$data.activeItem = this.$route.name; break;
        default :this.$data.activeItem = name;
      }

      // this.$nextTick(()=>{
      //   this.$refs.menu.updateActiveName();
      // })
    },
    gettestcoin() {
      var url = 'http://faucet.lambdastorage.com/';
      shell.openExternal(url);
    },
    getcommunitylink() {
      var url = 'https://talk.lambdastorage.com/';
      shell.openExternal(url);
    },
    async getMinerRewards() {
      console.log('getMinerRewards');
      try {
        let res = await ipc.callMain('MinerRewards', {});

        console.log(res);

        if (res.state) {
          var list = res.data['miner_rewards'] || [];
          var result = '';
          list.forEach(item => {
            if (item.denom == 'ulamb') {
              result = item.amount;
            }
          });

          this.$data.MinerRewards = result;
          this.$store.dispatch('setMinerReward', result);
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    }
  }

};
</script>
<style lang="less" scoped>
.customer-container {
  .container {
    margin-top: 40px;
  }
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 10px;
  }
}
.card-item {
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .item-value {
        font-size: 14px;
      }
}
.testcoin{
  margin-top: 10px;

}
</style>
