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
        <Select placeholder="请选择存储设备（最近的100个设备）" v-model="machineitem" style="width:300px">
        <Option v-for="item in machineList" :value="item.name" :key="item.name">{{ item.name }}</Option>
    </Select>
      </p>
      <br/>
      <p>一个存储设备只能出售一次，建议一次出售全部空间</p>
      <br/>
      <p>
        <Input  v-model="spaceSize">
          <span slot="prepend">出售空间</span>
          <span slot="append">GB</span>
        </Input>
      </p><br/>
      <p>

          <Input  v-model="unitPrice">
          <span slot="prepend">单价</span>
          <span slot="append">LAMB/GB/month</span>
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
          <span slot="prepend">最短购买时长</span>
          <span slot="append">月</span>
        </Input>
      </p>
      <br/>
      <p>
      <Input  v-model="maxDuration">
          <span slot="prepend">最大购买时长</span>
          <span slot="append">月</span>
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
          <Col span="4" class-name="key">存储设备:</Col>
          <Col span="20" class-name="value">{{machineitem}} </Col>
        </Row>

        <Row class-name="item">
          <Col span="4" class-name="key">出售空间:</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">单价:</Col>
          <Col span="20" class-name="value">{{unitPrice}} LAMB/GB/month</Col>
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
          <Col span="4" class-name="key"> 最短时长:</Col>
          <Col span="20" class-name="value">{{minDuration}} 月 </Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key"> 最长时长:</Col>
          <Col span="20" class-name="value">{{maxDuration}} 月 </Col>
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
      machineitem: '',
      machineList: [],
      market: {},
      spaceSize: '',
      rate: '',
      minSpace: '',
      minDuration: '',
      unitPrice: '',
      maxDuration: ''
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


      let spaceSize = parseInt(this.$data.spaceSize);
      let unitPrice = parseInt(this.$data.unitPrice);

      let rate = parseInt(this.$data.rate);
      let minSpace = parseInt(this.$data.minSpace);
      let minDuration = parseInt(this.$data.minDuration);
      let maxDuration = parseInt(this.$data.maxDuration);

      if (this.$data.machineitem == '') {
        this.$Notice.warning({
          title: '请选择存储设备'
        });
        return;
      }


      if (isNaN(spaceSize) || spaceSize == 0) {
        this.$Notice.warning({
          title: '检查空间大小'
        });
        return;
      }
      if (isNaN(unitPrice) || unitPrice == 0) {
        this.$Notice.warning({
          title: '检查单价'
        });
        return;
      }
      if (isNaN(rate) || rate == 0) {
        this.$Notice.warning({
          title: '检查赔率'
        });
        return;
      }
      if (isNaN(minSpace) || minSpace == 0) {
        this.$Notice.warning({
          title: '检查最小空间'
        });
        return;
      }
      if (isNaN(minDuration) || minDuration == 0) {
        this.$Notice.warning({
          title: '检查最小时长'
        });
        return;
      }
      if (isNaN(maxDuration) || maxDuration == 0) {
        this.$Notice.warning({
          title: '检查最大时长'
        });
        return;
      }
      unitPrice = this.toBigNumStr(unitPrice);
      minDuration = minDuration * (1000 * 1000 * 1000 * 60 * 60 * 24 * 30);
      maxDuration = maxDuration * (1000 * 1000 * 1000 * 60 * 60 * 24 * 30);

      // maxDuration



      this.$data.withdrawalModal = false;
      this.transfer({
        spaceSize,
        unitPrice,
        rate,
        minSpace,
        minDuration,
        maxDuration
      }, 'CreateSellOrder');
    },
    async transfer(sellobj, txType) {
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;


      try {
        let res = await ipc.callMain(txType, {
          marketName: this.$data.market.name,
          price: sellobj.unitPrice,

          rate: sellobj.rate + '.000000000000000000',
          sellSize: sellobj.spaceSize + '',
          machineName: this.$data.machineitem,
          cancelTimeDuration: 1 + '',
          minBuySize: sellobj.minSpace + '',
          minBuyDuration: sellobj.minDuration + '',
          maxBuyDuration: sellobj.maxDuration + '',
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
    },
    getmachineName(key) {
      var result;
      this.$data.machineList.forEach(item => {
        if (item.peerId == key) {
          result = item.name;
        }
      });
      return result;
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

