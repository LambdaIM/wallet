
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <blancebar/>
    <div class="testcoin">

         <Row>
        <Col span="10">
        &nbsp;&nbsp;
        </Col>
        <Col span="14" style="    text-align: right;">
        {{$t('testcoin.txtbref')}} <a @click="gettestcoin">{{$t('testcoin.txtbtn')}}</a>
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
                <MenuItem name="openWithdraw">{{$t('home.Withdraw')}}</MenuItem>
                <MenuItem name="openWithdrawprofit">{{$t('home.Withdrawprofit')}}</MenuItem>
            </MenuGroup>


        </Submenu>

    </Menu>
      </div>
      <router-view></router-view>

    <SendModelDialog ref="SendModelDialog" />
    <WithdrawalModalDialog ref="WithdrawalModalDialog" />
    <DistributionModal ref="DistributionModal" />

  </div>
</template>
<script>
import blancebar from './blancebar.vue';
import eventhub from '../../common/js/event.js';

import SendModelDialog from '@/views/Dialog/sendModel.vue';
import WithdrawalModalDialog from '@/views/Dialog/withdrawalModal.vue';
import DistributionModal from '@/views/Dialog/distributionModal.vue';
const { shell } = require('electron');

export default {
  data() {
    return {
      activeItem: this.$route.name,
      time: ''
    };
  },
  components: {
    blancebar,
    SendModelDialog,
    WithdrawalModalDialog,
    DistributionModal
  },
  mounted() {

  },
  methods: {
    transferClick(name) {
      console.log(name);

      this.$data.time = name;

      switch (name) {
        case 'openTransfer':this.$refs.SendModelDialog.open(); this.$data.activeItem = this.$route.name; break;
        case 'openWithdraw':this.$refs.WithdrawalModalDialog.open(); this.$data.activeItem = this.$route.name; break;
        case 'openWithdrawprofit':this.$refs.DistributionModal.open(); this.$data.activeItem = this.$route.name; break;
        default :this.$data.activeItem = name;
      }

      // this.$nextTick(()=>{
      //   this.$refs.menu.updateActiveName();
      // })
    },
    gettestcoin() {
      var url = 'http://faucet.lambda.im/';
      shell.openExternal(url);
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
