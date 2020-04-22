<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('orderrevenue.WithdraworderCommission')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <Form  @keydown.native.enter.prevent ="preSendLAMB" >
      <Input class="address" v-model="address" readonly>
        <span slot="prepend">{{$t('home.Modal1.From')}}</span>
      </Input>
      <br/>
      <Input class="address" v-model.number="page" >
        <span slot="prepend">{{$t('orderrevenue.Pagenumber')}}</span>
      </Input>
      <br/>
      <Input class="address" v-model.number="limit" readonly>
        <span slot="prepend">{{$t('orderrevenue.Number')}}</span>
      </Input>
      <br/>
      <p>
        <ul style="padding-left: 15px;">
          <li>{{$t('orderrevenue.tip1',[90])}}</li>
          <li>{{$t('orderrevenue.tip2',[90])}}</li>
          <li>{{$t('orderrevenue.tip3',[this.formatHour(orderduration)])}}</li>
          <li>{{$t('orderrevenue.tip4',[this.formatHour(orderduration)])}}</li>

        </ul>


      </p>
    </Form>
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
      limit: 90,
      page: 1,
      orderduration: 0,
      minerduration: 0
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
      this.marketinfo();
    },
    prewithdrawalLAMB() {
      let page = parseInt(this.$data.page);
      if (page < 0 || isNaN(page)) {
        return;
      }

      let limit = String(this.$data.limit);
      page = String(page);


      this.$data.withdrawalModal = false;
      this.transfer({
        page: page,
        limit: limit
      }, 'minerMinerWithDrawCount');
    },
    async transfer(obj, txType) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain(txType, obj);
        // console.log(res);
        if (res.state) {
          console.log(res.data);
          this.sendcancel();
          this.$refs.ConfirmModal.open('MsgMinerWithDrawCount', res.data);
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
    async marketinfo() {
      let res = await ipc.callMain('marketinfo', {

      });
      if (res.state) {
        var { order_with_draw_min_duration, miner_with_draw_duration } = res.data.data;
        this.$data.orderduration = order_with_draw_min_duration;
        this.$data.minerduration = miner_with_draw_duration;
      }
    },
    formatHour(num) {
      return (num / (1000 * 1000 * 1000 * 60 * 60)).toFixed(2);
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

