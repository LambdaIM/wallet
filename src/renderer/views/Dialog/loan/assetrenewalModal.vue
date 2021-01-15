<template>
<div>
  <Modal
    loading
    v-model="sendModal"
    :title="$t('Orderrenewal.title')"
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
    <Row class-name="card-item">
          <Col span="6" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.space') }}:</span>
          </Col>
          <Col span="6" class-name="content-wrapper">{{ size }}GB</Col>


    </Row>
    <p>
      1:对1个月以内将要到期的订单，可以进行续期
    </p>
    <p>
      2:续期时长为一个月
    </p>


    </Form >
    <div slot="footer">
      <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
    </div>

  </Modal>
  <ConfirmModal ref="ConfirmModal" />
</div>
</template>
<script>
import eventhub from '../../../common/js/event.js';
import isaddress from '../../../../utils/isaddress';

import ConfirmModal from '../confirmModal.vue';


const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  props: {

  },
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      denom: '',
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
      price: 0
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

      this.transfer();
    },
    async transfer() {
      let gas = 1;
      let orderId = this.$data.orderid;

      this.$data.transactiondata = null;


      try {
        let res = await ipc.callMain('loan_LoanOrderRenewal', {
          orderId
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('loan_LoanOrderRenewal', res.data);
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
    open(orderid, orderinfo) {
      this.$data.orderid = orderid;
      this.sendModal = true;
      this.$data.size = orderinfo.size;
      this.$data.price = orderinfo.price;
      // this.$data.denom = orderinfo.asset;
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
