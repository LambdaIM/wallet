<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      title="提取订单佣金"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <Form  @keydown.native.enter.prevent ="preSendLAMB" >
      <Input class="address" v-model="address" readonly>
        <span slot="prepend">{{$t('home.Modal1.From')}}</span>
      </Input>
      <br/>
      <Input class="address" v-model.number="page" >
        <span slot="prepend">页码</span>
      </Input>
      <br/>
      <Input class="address" v-model.number="limit" readonly>
        <span slot="prepend">数量</span>
      </Input>
      <br/>
      <p>
        <ul style="padding-left: 15px;">
          <li>每90个订单为1页，订单数量比较多，页码可以填写1、2、3、4、5、6等</li>
          <li>一次只能同时提取90个订单的收益</li>
          <li>提取操作时间限制{{orderduration|formatHour}}小时提取一次</li>
          <li>订单中的收益是{{minerduration|formatHour}}小时计算一次，如果未到{{minerduration|formatHour}}小时发起提取，提取到的金额为0</li>
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

