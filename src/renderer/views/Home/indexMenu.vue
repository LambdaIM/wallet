
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <blancebar/>
    <Menu @on-select="transferClick" mode="horizontal"  :active-name="activeItem">
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

export default {
  data() {
    return {
      activeItem: this.$route.name
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
      switch (name) {
        case 'openTransfer':this.$refs.SendModelDialog.open(); break;
        case 'openWithdraw':this.$refs.WithdrawalModalDialog.open(); break;
        case 'openWithdrawprofit':this.$refs.DistributionModal.open(); break;
      }
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
</style>
