<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('somemodel.Extractstorageandmininrewards')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p>
           <Tag v-for="item in MinerRewards">{{bigNumTypeFormat(item.amount,item.denom)}}</Tag>
      </p>

      <p v-if="MinerRewards.length==0">
        {{$t('Dialog.com.Nodata')}}
      </p>
      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>
    <ConfirmModal ref="ConfirmModal" />
  </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      withdrawalModal: false,
      confirmModal: false,
      gaseFee: 0,
      MinerRewards: []
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open() {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;

      this.getMinerRewards();
    },
    prewithdrawalLAMB() {
      console.log('- -');
      this.LAMBvalue = this.DistributionReward;
      let value = this.toBigNumStr(this.LAMBvalue);

      // if (value <= 0 || value > this.$data.DistributionReward ) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title: this.$t('home.action.check_balance_amount_transfer')
      //   });
      //   return;
      // }

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.$data.withdrawalModal = false;
      this.transfer(value, 'minerwithdrawal');
    },
    async transfer(amount, txType) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain(txType, {
          to,
          amount,
          gas
        });
        // console.log(res);
        if (res.state) {
          console.log(res.data);
          this.sendcancel();
          this.$refs.ConfirmModal.open('minerwithdrawal', res.data);
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
    },
    sendcancel() {
      this.withdrawalModal = false;
      // this.confirmModal=true;
    },
    async getMinerRewards() {
      console.log('getMinerRewards');
      try {
        let res = await ipc.callMain('MinerRewards', {});
        if (res.state) {
          var list = res.data['miner_rewards'] || [];
          var result = '';
          this.$data.MinerRewards = list;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    }

  },
  computed: {
    DistributionReward() {
      return this.bigNumType(this.$store.getters.getMinerReward);
    },
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getblance;
    }
  }
};
</script>
<style lang="less" scoped>
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>

