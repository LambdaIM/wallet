<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('Dialog.AutoBuy.Buyspace')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p>
        {{$t('Dialog.AutoBuy.Marketname')}}：{{this.$data.marketinfo.name}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.AutoBuy.Marketaddress')}}：{{this.$data.marketinfo.marketAddress}}
      </p>
      <br/>
      <p>
        {{$t('Dialog.AutoBuy.unitprice')}}(GB/LAMB/month)：{{marketPrice|Lambformat}}
      </p>
      <br/>


      <p>
        <Input  v-model="spaceSize">
          <span slot="prepend">{{$t('Dialog.AutoBuy.space')}}</span>
          <span slot="append">GB</span>
        </Input>
      </p>
      <br/>
      <p>
        <Input  v-model="spaceDuration">
          <span slot="prepend">{{$t('Dialog.AutoBuy.duration')}}</span>
          <span slot="append">{{$t('Dialog.AutoBuy.month')}}</span>
        </Input>
      </p>
      <br/>
      <p>
        {{$t('Dialog.AutoBuy.Paymentamount')}}：{{Paymentamount|Lambformat}}
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
        <h2>{{$t('Dialog.AutoBuy.Buyspace')}}</h2>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
          <Col span="20" class-name="value">{{address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.Marketname')}}:</Col>
          <Col span="20" class-name="value">{{this.$data.marketinfo.name}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.Marketaddress')}}:</Col>
          <Col span="20" class-name="value">{{this.$data.marketinfo.marketAddress}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="8" class-name="key">{{$t('Dialog.AutoBuy.unitprice')}}(GB/LAMB/month):</Col>
          <Col span="16" class-name="value">{{this.$data.marketPrice|Lambformat}}  </Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.space')}}:</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.duration')}}:</Col>
          <Col span="20" class-name="value">{{spaceDuration}} {{$t('Dialog.AutoBuy.month')}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.AutoBuy.Paymentamount')}}:</Col>
          <Col span="20" class-name="value">{{Paymentamount|Lambformat}} </Col>
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
      spaceSize: '',
      spaceDuration: '',
      marketPrice: 0,
      marketinfo: {}
    };
  },
  methods: {
    open(marketinfo, Size, Duration) {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.$data.spaceSize = Size;
      this.$data.spaceDuration = Duration;
      this.$data.marketinfo = marketinfo;
      this.$data.marketPrice = marketinfo.unitprice;
    },
    prewithdrawalLAMB() {
      console.log('- -');

      let spaceSize = parseInt(this.spaceSize);
      let spaceDuration = parseInt(this.spaceDuration);



      if (isNaN(spaceSize) || spaceSize == 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.AutoBuy.action.needspacesize')
        });
        return;
      }
      this.spaceSize = spaceSize;
      if (isNaN(spaceDuration) || spaceDuration == 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.AutoBuy.action.needstime')
        });
        return;
      }
      this.spaceDuration = spaceDuration;
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
      this.$data.transactiondata = null;



      try {
        let res = await ipc.callMain(txType, {
          duration: spaceDuration * (1000 * 1000 * 1000 * 60 * 60 * 24 * 30) + '',
          size: spaceSize + '',
          sellOrderId: '[do-not-input-value]',
          marketName: this.$data.marketinfo.name
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
      return this.$data.spaceSize * this.$data.spaceDuration * this.$data.marketPrice;
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

