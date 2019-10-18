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
        市场单价：{{marketPrice}}  GB/LAMB/month
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
          <span slot="append">月</span>
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
        <h2>购买空间</h2>
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
          <Col span="20" class-name="value">{{this.$data.marketPrice}} GB/LAMB/month </Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">空间:</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">时长:</Col>
          <Col span="20" class-name="value">{{spaceDuration}} 月</Col>
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

      let spaceSize = parseInt(this.spaceSize);
      let spaceDuration = parseInt(this.spaceDuration);

      if (spaceSize == '' || spaceSize == 0) {
        this.$Notice.warning({
          title: '检查空间大小'
        });
        return;
      }
      if (spaceDuration == '' || spaceDuration == 0) {
        this.$Notice.warning({
          title: '检查时长大小'
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

