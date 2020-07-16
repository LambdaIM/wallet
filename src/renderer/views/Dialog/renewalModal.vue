<template>
<div>
  <Modal
    loading
    v-model="sendModal"
    :title="$t('renewal.Orderrenewal')"
    :styles="{top: '200px'}"
    @on-cancel="sendcancel"
  >
  <Form  @keydown.native.enter.prevent ="preSendLAMB" >
    <p>
      <Input class="address" v-model="address" readonly>
        <span slot="prepend">{{$t('home.Modal1.From')}}</span>
      </Input>
    </p>
    <br />
    <p>
      <Input class="address" v-model="orderid" readonly>
        <span slot="prepend">{{$t('renewal.orderid')}}</span>
      </Input>
    </p>
    <br />

    <p>
      <Input  v-model.number="Duration">
        <span slot="prepend">{{$t('renewal.Duration')}}</span>
        <span slot="append">{{$t('renewal.month')}}</span>
      </Input>
    </p>
    <br/>
    <Row class-name="card-item">
          <Col span="6" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.space') }}:</span>
          </Col>
          <Col span="6" class-name="content-wrapper">{{ size }}GB</Col>
          <Col span="8" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.unitprice') }}:</span>
          </Col>
          <Col span="4" class-name="content-wrapper">
            {{ price | Lambformat }}
          </Col>
        </Row>
      <br/>
      <p>
        {{$t('Marketothers.Commissionfee')}}:{{renewaLamountFee | Lambformat}} &nbsp;&nbsp;  {{$t('Marketothers.Orderamount')}}：{{ renewaLCost | Lambformat }} &nbsp;&nbsp;

      </p>
      <br/>
      <Row class-name="card-item">
          <!-- <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('home.Balance')}}:</span>
          </Col>
          <Col span="8" class-name="content-wrapper">{{balance|Lambformat}}</Col> -->
          <Col span="6" class-name="title-wrapper">
            <span class="title">{{$t('Dialog.AutoBuy.Paymentamount')}}:</span>
          </Col>
          <Col span="6" class-name="content-wrapper">
            {{ allcost| Lambformat }}
          </Col>
        </Row>

    </Form >
    <div slot="footer">
      <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
    </div>

  </Modal>
  <ConfirmModal ref="ConfirmModal" />
</div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import isaddress from '../../../utils/isaddress';

import ConfirmModal from './confirmModal.vue';


const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  props: {

  },
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      denom: 'lamb',
      LAMBvalue: '',
      to: '',
      Tovalue: '',
      denomBlance: '',
      gaseFee: 0,
      editmemo: false,
      memo: '',
      memoNum: 255,
      orderid: '',
      Duration: '',
      timeunit: 1000 * 1000 * 1000 * 60 * 60 * 24 * 30,
      size: 0,
      price: 0,
      market: {}
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    openmemo() {
      this.$data.editmemo = true;
    },
    preSendLAMB() {
      console.log('preSendLAMB');
      let from = this.address;
      let to = this.Tovalue;

      let value = this.$data.Duration;

      let Duration;

      try {
        Duration = parseInt(value);
      } catch (error) {

      }
      if (Duration > 60) {
        this.$Notice.warning({
          title: this.$t('renewal.maxDuration')
          // title: '续费时长需要小于60个月'
        });
        return;
      }
      /// ////
      if (this.bigLess0OrGreater(this.renewaLamount, this.$store.getters.getblance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }

      /// ////


      if (isNaN(Duration)) {
        this.$Notice.warning({
          title: this.$t('renewal.needDuration')
          // title: '请填写时长'
        });
        return;
      }

      // this.LAMBvalue = parseFloat(this.LAMBvalue).toFixed(6);
      this.transfer(Duration);
    },
    async transfer(duration) {
      let gas = 1;
      let orderId = this.$data.orderid;

      this.$data.transactiondata = null;
      var durationSys = String(this.$data.timeunit * duration);

      try {
        let res = await ipc.callMain('marketOrderRenewal', {
          duration: durationSys,
          orderId
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('OrderRenewal', res.data);
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
      this.sendModal = false;
      // this.confirmModal=true;
    },
    open(orderid, orderinfo, market) {
      this.$data.orderid = orderid;
      this.sendModal = true;
      this.$data.size = orderinfo.size;
      this.$data.price = orderinfo.price;
      this.$data.market = market;
    },
    fee1(num) {
      return this.bigNum(num).toNumber();
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getblance;
    },
    denomShow: function() {
      return this.$data.denom.substr(1).toUpperCase();
    },
    denomtitleShow: function() {
      return this.$t('home.Modal1.Send_LAMB', [this.$data.denom.substr(1).toUpperCase()]);
    },
    renewaLamount: function() {
      return this.$data.size * this.$data.price * this.$data.Duration;
    },
    renewaLamountFee: function() {
      return (this.renewaLamount * this.fee1(this.$data.market.commissionRate)).toFixed(6);
    },
    allcost: function() {
      if (this.$data.market == undefined) {
        return;
      }
      return (this.renewaLamount * (this.fee1(this.$data.market.commissionRate) + 1)).toFixed(6);
    },
    renewaLCost: function() {
      return (this.renewaLamount).toFixed(6);
    }
  },
  watch: {
    Duration: function(data) {
      if (data % 1 != 0) {
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Sellingothers.needint')
        });
      }
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

.address{
  font-family: Consolas,Monaco,monospace;
}
</style>
