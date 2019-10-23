<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('Dialog.selectBuy.Buyspace')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p>
        {{$t('Dialog.selectBuy.Marketname')}}：{{market.name}}
      </p><br/>
      <p>
        {{$t('Dialog.selectBuy.Mineraddress')}}：{{orderinfo.address}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Minimumspace')}}：{{orderinfo.minBuySize}}GB
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Minimumtime')}}：{{orderinfo.minDuration|formatMonth}}月
      </p>
      <br/>
      <p>
        {{$t('Dialog.selectBuy.Maximumtime')}}：{{orderinfo.maxDuration|formatMonth}}月
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
        {{$t('Dialog.selectBuy.remainingspace')}}：{{orderinfo.unUseSize}}GB
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
        {{$t('Dialog.selectBuy.Paymentamount')}}：{{Paymentamount|Lambformat}}
      </p>
              <br />
        <p>
          {{$t('home.Balance')}} : {{balance|Lambformat}}

        </p>
      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">
      <div class="modal-header" slot="header">
        <h2>{{$t('Dialog.selectBuy.Buyspace')}}</h2>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
          <Col span="20" class-name="value">{{address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.selectBuy.Marketname')}}:</Col>
          <Col span="20" class-name="value">{{market.name}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.selectBuy.Mineraddress')}}:</Col>
          <Col span="20" class-name="value">{{orderinfo.address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.selectBuy.space')}} :</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.selectBuy.duration')}} :</Col>
          <Col span="20" class-name="value">{{spaceDuration}} {{$t('Dialog.AutoBuy.month')}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="8" class-name="key">{{$t('Dialog.selectBuy.unitprice')}} :</Col>
          <Col span="16" class-name="value">{{orderinfo.price|Lambformat}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.selectBuy.Paymentamount')}} :</Col>
          <Col span="20" class-name="value">{{Paymentamount|Lambformat}}</Col>
        </Row>
        <Row class-name="item">
            <Input  v-model="gaseFee" >
                              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
                                <span slot="append">LAMB</span>
                              </Input>
          </Row>

      </div>
      <!-- <p>
          <Input v-model="walletPassword" type="password"></Input>
      </p>-->
      <div slot="footer">
        <Button type="primary" @click="confirm">{{$t('home.Modal1.Confirm')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
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
          title: this.$t('Dialog.selectBuy.Minimumtime') + this.$data.orderinfo.minDuration / this.$data.timeunit + '月'
        });
        return;
      }
      if (spaceDuration > this.$data.orderinfo.maxDuration / this.$data.timeunit) {
        this.$Notice.warning({
          title: this.$t('Dialog.selectBuy.Maximumtime') + this.$data.orderinfo.maxDuration / this.$data.timeunit + '月'
        });
        return;
      }

      if (this.bigLess0OrGreater(this.Paymentamount, this.balance)) {
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
          let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
          if (gasres.state) {
            this.$data.gaseFee = gasres.data;
            this.$data.transactiondata = res.data;
            this.sendcancel();
            this.confirmModal = true;
          }
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
    confirm() {
      var comparedNum = this.bigNum(this.toBigNumStr(this.$data.gaseFee)).comparedTo(this.$store.getters.balanceLamb);
      if (comparedNum == 1 || comparedNum == null) {
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Dialog.com.Lesscommission')
        });
        return;
      }
      this.confirmModal = false;
      console.log(this.$data.transactiondata);
      eventhub.$emit('TxConfirm', this.$data.transactiondata, this.toBigNumStr(this.$data.gaseFee));
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

