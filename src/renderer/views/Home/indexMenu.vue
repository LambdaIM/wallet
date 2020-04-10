
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

        <span style="    color: red;">  {{$t('testcoin.txtbref')}} </span>
        <a @click="gettestcoin"><svg t="1575625791429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1802" width="16" height="16"><path d="M693.8 233.8c19.2 42.2 23 113.6-16 148.2C612 132 448.8 80.8 448.8 80.8c19.2 129-70 270-156 375.4-3-51.4-6.2-87-33.2-136.2-6 93.4-77.4 169.6-96.8 263.2-26.2 126.8 19.6 219.6 193.6 317.6h25c-37.8-78.6 5.2-135.6 34.4-178 23.8-34.6 34.2-69 38.2-84.4-0.4 2.8 3.6-21.6 3-18.6 2.8-3 3.6 10.8 5 17.6 2 19.8 14.6 40.6 8.8 76 44.2-49.2 52.6-127.6 45.8-157.6 100 69.8 158.4 232.8 100.8 344.8h24.2c442.6-250 110.2-624.6 52.2-666.8z" fill="#FC5300" p-id="1803"></path></svg><svg t="1575625791429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1802" width="16" height="16"><path d="M693.8 233.8c19.2 42.2 23 113.6-16 148.2C612 132 448.8 80.8 448.8 80.8c19.2 129-70 270-156 375.4-3-51.4-6.2-87-33.2-136.2-6 93.4-77.4 169.6-96.8 263.2-26.2 126.8 19.6 219.6 193.6 317.6h25c-37.8-78.6 5.2-135.6 34.4-178 23.8-34.6 34.2-69 38.2-84.4-0.4 2.8 3.6-21.6 3-18.6 2.8-3 3.6 10.8 5 17.6 2 19.8 14.6 40.6 8.8 76 44.2-49.2 52.6-127.6 45.8-157.6 100 69.8 158.4 232.8 100.8 344.8h24.2c442.6-250 110.2-624.6 52.2-666.8z" fill="#FC5300" p-id="1803"></path></svg>{{$t('testcoin.txtbtn')}}</a>

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
        <MenuItem to="/home/localtxlist" name="localtxlist">
            <Icon type="ios-paper" />
            {{$t('home.Latest_Transaction_local')}}
        </MenuItem>
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
                <MenuItem v-if="$role('home.tx.Withdrawprofit')" name="openWithdrawprofit">{{$t('home.Withdrawprofit')}}</MenuItem>
                <MenuItem v-if="$role('home.tx.Minerprofit')" name="openMinerprofit">{{$t('somemodel.Extractstorageandmininrewards')}} </MenuItem>
            </MenuGroup>


        </Submenu>
        <MenuItem v-if="$role('home.subaccount')"   to="/home/subaccount" name="subaccount">
            <Icon type="md-list" />
            {{$t('home.subaccount')}}
        </MenuItem>
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
            Lambda S3
        </MenuItem>

    </Menu>
      </div>
      <router-view></router-view>

    <SendModelDialog ref="SendModelDialog" />
    <WithdrawalModalDialog ref="WithdrawalModalDialog" />
    <DistributionModal ref="DistributionModal" />
    <MinerWithdrawalModal ref="MinerWithdrawalModalDialog"/>

  </div>
</template>
<script>
import blancebar from './blancebar.vue';
import eventhub from '../../common/js/event.js';

import SendModelDialog from '@/views/Dialog/sendModel.vue';
import WithdrawalModalDialog from '@/views/Dialog/withdrawalModal.vue';
import DistributionModal from '@/views/Dialog/distributionModal.vue';

import MinerWithdrawalModal from '@/views/Dialog/MinerWithdrawalModal.vue';

import introJs from 'intro.js';

import homesteps from './homesteps.js';
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
    MinerWithdrawalModal
  },
  mounted() {
    this.getMinerRewards();
    this.$data.Interval = setInterval(async () => {
      this.getMinerRewards();
    }, 1000 * 15);



    var role = this.$store.getters.role;
    if (role != null) {
      setTimeout(() => {
        console.log('|||||=========|||||||');
        var Options = {
          prevLabel: '上一步',
          nextLabel: '下一步',
          skipLabel: '跳过',
          doneLabel: '完成',
          steps: []
        };
        homesteps.forEach(item => {
          if (document.querySelector(item.element)) {
            Options.steps.push(item);
          }
        });
        introJs().setOptions(Options).start()
          .oncomplete(function() {
            alert('end of introduction');
          })
          .onexit(function() {
            alert('exit of introduction');
          });
      }, 1000);
    }
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
        default :this.$data.activeItem = name;
      }

      // this.$nextTick(()=>{
      //   this.$refs.menu.updateActiveName();
      // })
    },
    gettestcoin() {
      var url = 'http://faucet.lambda.im/';
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
