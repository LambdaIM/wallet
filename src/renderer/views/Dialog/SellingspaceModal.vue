<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('Dialog.sellorder.Sellingspace')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <p>
        {{$t('Dialog.sellorder.Marketaddress')}}：{{market.marketAddress}}
      </p><br/>
      <p>
        {{$t('Dialog.sellorder.Marketname')}}：{{market.name}}
      </p><br/>
      <p>{{$t('Dialog.sellorder.Storagedevice')}}&nbsp;&nbsp;
        <Select :placeholder="$t('Dialog.sellorder.Storagedevicetip')" v-model="machineitem" style="width:300px">
        <Option v-for="item in machineList" :value="item.name" :key="item.name">{{ item.name }}</Option>
    </Select>
      </p>
      <br/>
      <p>{{$t('Dialog.sellorder.Storagedevicetip')}}</p>
      <br/>
      <p>
        <Input  v-model="spaceSize">
          <span slot="prepend">{{$t('Dialog.sellorder.Sellingspace')}}</span>
          <span slot="append">GB</span>
        </Input>
      </p>
      <br/>
      <p>

          <Input @on-keyup="ratechangedebounce"  v-model="rate">
          <span slot="prepend">{{$t('Dialog.sellorder.Odds')}}</span>
          <span slot="append">{{$t('Dialog.sellorder.times')}}</span>
        </Input>

      </p>
      <br/>
      <ul class="ultip">
        <li>{{$t('Dialog.sellorder.ratetip1')}}</li>
        <li>{{$t('Dialog.sellorder.ratetip2')}}</li>
        <li>{{$t('Dialog.sellorder.ratetip3')}}</li>
      </ul>
      <br/>
      <p>

          <Input :disabled="rate==1" @on-keyup="pricechangedebounce"  v-model="unitPrice">
          <span slot="prepend">{{$t('Dialog.sellorder.unitprice1')}}</span>
          <span slot="append">{{$t('Dialog.sellorder.unitprice2')}}</span>
        </Input>

      </p>
      <br/>
      <p >
        {{$t('Dialog.sellorder.Purchasequota')}}
      </p>
      <br/>
      <p>
      <Input  v-model="minSpace">
          <span slot="prepend">{{$t('Dialog.sellorder.Minimumspace')}}</span>
          <span slot="append">GB</span>
        </Input>
      </p>
      <br/>
      <p>
      <Input  v-model="minDuration">
          <span slot="prepend">{{$t('Dialog.sellorder.Minimumtime')}}</span>
          <span slot="append">{{$t('Dialog.sellorder.month')}}</span>
        </Input>
      </p>
      <br/>
      <p>
      <Input  v-model="maxDuration">
          <span slot="prepend">{{$t('Dialog.sellorder.Maximumtime')}}</span>
          <span slot="append">{{$t('Dialog.sellorder.month')}}</span>
        </Input>
      </p>

      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">
      <div class="modal-header" slot="header">
        <h2>{{$t('Dialog.sellorder.Sellingspace')}}</h2>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
          <Col span="20" class-name="value">{{address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.Storagedevice')}}:</Col>
          <Col span="20" class-name="value">{{machineitem}} </Col>
        </Row>

        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.Sellingspace')}}:</Col>
          <Col span="20" class-name="value">{{spaceSize}} GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.unitprice1')}}:</Col>
          <Col span="20" class-name="value">{{unitPrice}} {{$t('Dialog.sellorder.unitprice2')}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('Dialog.sellorder.Odds')}}:</Col>
          <Col span="20" class-name="value">{{rate}} {{$t('Dialog.sellorder.times')}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="5" class-name="key"> {{$t('Dialog.sellorder.Minimumspace')}}:</Col>
          <Col span="19" class-name="value">{{minSpace}}GB</Col>
        </Row>
        <Row class-name="item">
          <Col span="5" class-name="key"> {{$t('Dialog.sellorder.Minimumtime')}}:</Col>
          <Col span="19" class-name="value">{{minDuration}} {{$t('Dialog.sellorder.month')}} </Col>
        </Row>
        <Row class-name="item">
          <Col span="5" class-name="key"> {{$t('Dialog.sellorder.Maximumtime')}}:</Col>
          <Col span="19" class-name="value">{{maxDuration}} {{$t('Dialog.sellorder.month')}} </Col>
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
import { debounce } from 'underscore';
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
      unitPrice: '5',
      maxDuration: '',
      timeunit: 1000 * 1000 * 1000 * 60 * 60 * 24 * 30
    };
  },
  methods: {
    open(market) {
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.$data.market = market;

      this.getMinermachines();
      this.fnrate = debounce(this.ratechange, 1000);
      this.fnpricerate = debounce(this.pricechange, 1000);
    },
    prewithdrawalLAMB() {
      if (this.$data.machineitem == '') {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needstoragedevice')
        });
        return;
      }
      let spaceSize = parseInt(this.$data.spaceSize);
      let unitPrice = parseInt(this.$data.unitPrice);

      let rate = parseInt(this.$data.rate);
      let minSpace = parseInt(this.$data.minSpace);
      let minDuration = parseInt(this.$data.minDuration);
      let maxDuration = parseInt(this.$data.maxDuration);
      if (rate == 1) {
        unitPrice = 5;
        // this.$Message.info(this.$t('Dialog.sellorder.ratetip1'));
      }
      if (rate >= 3 && unitPrice < 5) {
        unitPrice = 5;
        this.$Message.info(this.$t('Dialog.sellorder.ratetip2'));
      }
      if (rate == 2) {
        this.$Message.info(this.$t('Dialog.sellorder.ratetip4'));
        return;
      }


      if (isNaN(spaceSize) || spaceSize <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needspacesize')
        });
        return;
      }
      this.$data.spaceSize = spaceSize;

      if (isNaN(unitPrice) || unitPrice <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needunitprice')
        });
        return;
      }
      this.$data.unitPrice = unitPrice;

      if (isNaN(rate) || rate <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needodds')
        });
        return;
      }
      this.$data.rate = rate;

      if (isNaN(minSpace) || minSpace <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needminspace')
        });
        return;
      }
      if (minSpace > spaceSize) {
        minSpace = spaceSize;
      }

      this.$data.minSpace = minSpace;

      if (isNaN(minDuration) || minDuration <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needunitmintime')
        });
        return;
      }
      if (minDuration > 60) {
        minDuration = 60;
      }


      this.$data.minDuration = minDuration;


      if (isNaN(maxDuration) || maxDuration <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needunitmaxtime')
        });
        return;
      }

      if (maxDuration > 60) {
        maxDuration = 60;
      }

      if (minDuration > maxDuration) {
        maxDuration = minDuration;
      }
      this.$data.maxDuration = maxDuration;



      unitPrice = this.toBigNumStr(unitPrice);

      minDuration = minDuration * this.$data.timeunit;
      maxDuration = maxDuration * this.$data.timeunit;

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
    ratechangedebounce() {
      this.fnrate();
    },
    ratechange() {
      let rate = parseInt(this.$data.rate);

      if (isNaN(rate) || rate <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needodds')
        });
        return;
      }
      if (rate == 1) {
        this.$data.unitPrice = 5;
      }
      if (rate == 2) {
        this.$Message.info(this.$t('Dialog.sellorder.ratetip4'));
        // this.$data.rate = 1;
        // this.$data.unitPrice = 5;
      }
    },
    pricechangedebounce() {
      this.fnpricerate();
    },
    pricechange() {
      let rate = parseInt(this.$data.rate);
      let unitPrice = parseInt(this.$data.unitPrice);
      if (isNaN(rate) || rate == 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needodds')
        });
        return;
      }
      if (isNaN(unitPrice) || unitPrice == 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.sellorder.action.needunitprice')
        });
        return;
      }

      if (rate == 1) {
        this.$data.unitPrice = 5;
        this.$Message.info(this.$t('Dialog.sellorder.ratetip1'));
      }
      if (rate == 2) {
        this.$Message.info(this.$t('Dialog.sellorder.ratetip4'));
        this.$data.rate = 1;
        this.$data.unitPrice = 5;
      }
      if (rate >= 3 && unitPrice < 5) {
        // this.$data.unitPrice = 5;
        this.$Message.info(this.$t('Dialog.sellorder.ratetip2'));
      }
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
.ultip{
      text-align: center;
      list-style-type:none
}
</style>

