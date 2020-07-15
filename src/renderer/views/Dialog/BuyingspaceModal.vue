<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('Dialog.selectBuy.Buyspace')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <Form  @keydown.native.enter.prevent ="prewithdrawalLAMB" >
      <p>
        {{$t('Dialog.selectBuy.Marketname')}}：{{market.name}}
      </p><br/>
      <p>
        {{$t('Dialog.selectBuy.Mineraddress')}}：<a @click="openminerpage(orderinfo.address)">{{orderinfo.address}}</a>
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Minimumspace')}}：{{orderinfo.minBuySize}}GB
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Minimumtime')}}：{{orderinfo.minDuration|formatMonth}}{{$t('Dialog.selectBuy.month')}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Maximumtime')}}：{{orderinfo.maxDuration|formatMonth}}{{$t('Dialog.selectBuy.month')}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.unitprice')}}：{{orderinfo.price|Lambformat}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Odds')}}：{{parseInt(orderinfo.rate)}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.amountspace')}}：{{orderinfo.sellSize}}GB
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.remainingspace')}}：{{orderinfo.unusedSize}}GB
      </p>
      <br/>
      <p>
        <Input v-model="spaceSize">
          <span slot="prepend">{{$t('Dialog.selectBuy.space')}}</span>
          <span slot="append">GB</span>
        </Input>
      </p>
            <br/>
      <p>
        <Input  v-model="spaceDuration">
          <span slot="prepend">{{$t('Dialog.selectBuy.duration')}}</span>
          <span slot="append">{{$t('Dialog.selectBuy.month')}}</span>
        </Input>
      </p>
      <br/>
      <p>
        {{$t('Marketothers.Commissionfee')}}:{{(fee1(market.commissionRate) * Paymentamount )|Lambformat}} &nbsp;  &nbsp;
        {{$t('Marketothers.Orderamount')}}：{{Paymentamount|Lambformat}} &nbsp;  &nbsp;
        {{$t('Marketothers.Transactionfee')}}：0.01 LAMB（{{$t('Marketothers.estimate')}}）<br/>
        {{$t('Dialog.selectBuy.Paymentamount')}}：{{(totalcost+10000)|Lambformat}}

      </p>
              <br />
        <p>
          {{$t('home.Balance')}} : {{balance|Lambformat}}

        </p>
      </Form >
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

import { DAEMON_CONFIG } from '../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');


export default {
  data() {
    return {
      withdrawalModal: false,
      confirmModal: false,
      gaseFee: 0,
      orderinfo: {},
      market: {},
      spaceSize: '',
      spaceDuration: '',
      timeunit: 1000 * 1000 * 1000 * 60 * 60 * 24 * 30

    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(data, market) {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.$data.orderinfo = data;
      this.$data.market = market;
    },
    prewithdrawalLAMB() {
      console.log('- -');

      let spaceSize = parseInt(this.$data.spaceSize);
      let spaceDuration = parseInt(this.$data.spaceDuration);



      if (isNaN(spaceSize) || spaceSize == 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.selectBuy.action.needspacesize')
        });
        return;
      }
      this.$data.spaceSize = spaceSize;
      if (isNaN(spaceDuration) || spaceDuration == 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.selectBuy.action.needstime')
        });
        return;
      }
      this.$data.spaceDuration = spaceDuration;
      if (spaceSize < this.$data.orderinfo.minBuySize) {
        this.$Notice.warning({
          title: this.$t('Dialog.selectBuy.Minimumspace') + this.$data.orderinfo.minBuySize + 'GB'
        });
        return;
      }
      if (spaceDuration < this.$data.orderinfo.minDuration / this.$data.timeunit) {
        this.$Notice.warning({
          title: this.$t('Dialog.selectBuy.Minimumtime') +
          (this.$data.orderinfo.minDuration / this.$data.timeunit).toFixed(2) +
          this.$t('Dialog.AutoBuy.month')
        });
        return;
      }
      if (spaceDuration > this.$data.orderinfo.maxDuration / this.$data.timeunit) {
        this.$Notice.warning({
          title: this.$t('Dialog.selectBuy.Maximumtime') +
          (this.$data.orderinfo.maxDuration / this.$data.timeunit).toFixed(2) +
          this.$t('Dialog.AutoBuy.month')
        });
        return;
      }

      if (this.bigLess0OrGreater(this.totalcost, this.balance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }



      this.$data.withdrawalModal = false;
      this.transfer(spaceSize, spaceDuration, 'CreateBuyOrder');
    },
    async transfer(spaceSize, spaceDuration, txType) {
      // let amount = this.LAMBvalue;

      // amount = amount * 10000;
      this.$data.transactiondata = null;

      try {
        let res = await ipc.callMain(txType, {
          duration: spaceDuration * (this.$data.timeunit) + '',
          size: spaceSize + '',
          sellOrderId: this.$data.orderinfo.orderId,
          marketName: this.$data.market.name
        });
        // console.log(res);
        if (res.state) {
          console.log(res.data);
          this.sendcancel();
          this.$refs.ConfirmModal.open('CreateBuyOrder', res.data);
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
    async openminerpage(address) {
      let res = await ipc.callMain('getlambdaaddressbyminer', {
        address: address
      });
      if (res.state) {
        var lambdaaddress = res.data;
        var explorer = DAEMON_CONFIG.explore();
        let url = `${explorer}/#/address/${lambdaaddress}/activity/1/all`;
        shell.openExternal(url);
      }
    },
    fee1(num) {
      return this.bigNum(num).toNumber();
    }
  },
  computed: {
    DistributionReward() {
      return this.bigNumType(this.$store.getters.getDistributionReward);
    },
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getblance;
    },
    Paymentamount: function() {
      return this.$data.spaceSize * this.$data.spaceDuration * this.$data.orderinfo.price;
    },
    totalcost: function() {
      return (
        this.$data.spaceSize * this.$data.spaceDuration * this.$data.orderinfo.price *
      (1 + this.fee1(this.$data.market.commissionRate))
      );
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

