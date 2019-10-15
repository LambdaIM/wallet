<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      title="购买空间"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p>
        市场名称：{{this.$data.marketinfo.name}}
      </p>
      <br/>
      <p>
        市场地址：{{this.$data.marketinfo.marketAddress}}
      </p>
      <br/>
      <p>
        市场单价：{{marketPrice}}  GB/LAMB/DAY
      </p>
      <br/>


      <p>
        <Input  v-model="spaceSize">
          <span slot="prepend">空间</span>
          <span slot="append">GB</span>
        </Input>
      </p>
      <br/>
      <p>
        <Input  v-model="spaceDuration">
          <span slot="prepend">时长</span>
          <span slot="append">Day</span>
        </Input>
      </p>
      <br/>
      <p>
        支付金额：{{Paymentamount}} LAMB
      </p>
      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">
      <div class="modal-header" slot="header">
        <h2>{{$t('Dialog.withdrawalModal.title')}}</h2>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
          <Col span="20" class-name="value">{{address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">市场名称:</Col>
          <Col span="20" class-name="value">{{this.$data.marketinfo.name}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">市场地址:</Col>
          <Col span="20" class-name="value">{{this.$data.marketinfo.marketAddress}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">市场单价:</Col>
          <Col span="20" class-name="value">{{this.$data.marketPrice}} GB/LAMB/DAY </Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">空间:</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">时长:</Col>
          <Col span="20" class-name="value">{{spaceDuration}} Day</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">支付金额:</Col>
          <Col span="20" class-name="value">{{Paymentamount}} LAMB</Col>
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
      marketPrice: 2,
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
    },
    prewithdrawalLAMB() {
      console.log('- -');

      let spaceSize = this.toBigNumStr(this.spaceSize);
      let spaceDuration = this.toBigNumStr(this.spaceDuration);

      // if (value <= 0 || value > this.$data.DistributionReward ) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title: this.$t('home.action.check_balance_amount_transfer')
      //   });
      //   return;
      // }

      if (isNaN(spaceSize) || isNaN(spaceDuration)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.$data.withdrawalModal = false;
      this.transfer(spaceSize, spaceDuration, 'automarket');
    },
    async transfer(spaceSize, spaceDuration, txType) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      var marketAddress = this.$data.marketinfo.marketAddress;

      //= =========
      this.sendcancel();
      this.confirmModal = true;
      return;
      //= ========


      try {
        let res = await ipc.callMain(txType, {
          to,
          spaceSize,
          spaceDuration,
          marketAddress,
          gas
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
      if (comparedNum == 1 || comparedNum == null || comparedNum == 0) {
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

