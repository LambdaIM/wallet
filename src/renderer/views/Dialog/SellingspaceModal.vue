<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      title="出售空间"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <p>
        市场地址：{{market.marketAddress}}
      </p><br/>
      <p>
        市场名称：{{market.name}}
      </p><br/>
      <p>存储设备&nbsp;&nbsp;
        <Select placeholder="请选择存储设备（最近的100个设备）" v-model="model1" style="width:300px">
        <Option v-for="item in machineList" :value="item.peerId" :key="item.peerId">{{ item.name }}</Option>
    </Select>
      </p><br/>
      <p>
        <Input  v-model="spaceSize">
          <span slot="prepend">出售空间</span>
          <span slot="append">GB</span>
        </Input>
      </p><br/>
      <p>

          <Input  v-model="unitPrice">
          <span slot="prepend">单价</span>
          <span slot="append">LAMB/GB/DAY</span>
        </Input>

      </p>
      <br/>
      <p>

          <Input  v-model="rate">
          <span slot="prepend">赔率</span>
          <span slot="append">倍</span>
        </Input>

      </p>
      <br/>
      <p style="margin-top: 20px;">
        购买限额
      </p>
      <br/>
      <p>
      <Input  v-model="minSpace">
          <span slot="prepend">最少购买空间</span>
          <span slot="append">GB</span>
        </Input>
      </p>
      <br/>
      <p>
      <Input  v-model="minDuration">
          <span slot="prepend">最短购买时间</span>
          <span slot="append">Day</span>
        </Input>
      </p>

      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">
      <div class="modal-header" slot="header">
        <h2>出售空间</h2>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
          <Col span="20" class-name="value">{{address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">出售空间:</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">单价:</Col>
          <Col span="20" class-name="value">{{unitPrice}} LAMB/GB/DAY</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">赔率:</Col>
          <Col span="20" class-name="value">{{rate}} 倍</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key"> 最小空间:</Col>
          <Col span="20" class-name="value">{{minSpace}}GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key"> 最短时间:</Col>
          <Col span="20" class-name="value">{{minDuration}}Day</Col>
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
      model1: '',
      machineList: [],
      market: {},
      spaceSize: '',
      rate: '',
      minSpace: '',
      minDuration: '',
      unitPrice: ''
    };
  },
  methods: {
    open(market) {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.$data.market = market;

      this.getMinermachines();


      console.log('----------');
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
      this.transfer(value, 'withdrawal');
    },
    async transfer(amount, txType) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      //= ===
      this.sendcancel();
      this.confirmModal = true;
      return;
      //= ==

      try {
        let res = await ipc.callMain(txType, {
          to,
          amount,
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
    },
    async getMinermachines() {
      let res = await ipc.callMain('minermachines', {
        page: 1,
        limit: 100
      });

      if (res.state) {
        this.$data.machineList = res.data.data;
      }
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

