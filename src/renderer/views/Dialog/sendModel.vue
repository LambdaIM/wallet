<template>
<div>
  <Modal
    loading
    v-model="sendModal"
    :title="denomtitleShow"
    :styles="{top: '200px'}"
    @on-cancel="sendcancel"
  >
    <p>
      <Input class="address" v-model="address" readonly>
        <span slot="prepend">{{$t('home.Modal1.From')}}</span>
      </Input>
    </p>
    <br />
    <p>
      <Input  class="address" v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
        <span slot="prepend">{{$t('home.Modal1.To')}}</span>
      </Input>
    </p>
    <br />
    <p>
      <Input  v-model="LAMBvalue">
        <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
        <span slot="append">{{denomShow}}</span>
      </Input>
    </p>
    <br />
    <p><Button @click="openmemo" v-if="editmemo==false" type="dashed" >{{$t('Dialog.com.EditMemo')}}</Button>
    <Input  v-else v-model="memo" type="textarea" :rows="4" placeholder="Enter something..." :maxlength="memoNum" />
    </p>
    <div slot="footer">
      <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
    </div>
  </Modal>
  <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>{{$t('home.Modal1.Transfer')}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key ">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value address">{{address}}</Col>
          </Row>
          <Row  class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
            <Col span="20" class-name="value address">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} {{denomShow}}</Col>
          </Row>
          <Row class-name="item">
            <Input v-model="gaseFee" >
                              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
                                <span slot="append">LAMB</span>
                              </Input>
          </Row>
          <Row v-if="editmemo==true"  class-name="item">
            <Input v-model="memo" readonly type="textarea" :rows="4"  />
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
import isaddress from '../../../utils/isaddress';
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
      memoNum: 255
    };
  },
  methods: {
    openmemo() {
      this.$data.editmemo = true;
    },
    preSendLAMB() {
      let from = this.address;
      let to = this.Tovalue;

      let value = this.toBigNumStr(this.LAMBvalue);
      if (to == from) {
        this.$Notice.warning({
          title: this.$t('home.action.not_transfer_LAMB_to_yourself')
        });
        return;
      }
      if (this.bigLess0OrGreater(value, this.$data.denomBlance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }
      // value = wUtils.numberToBig(value) ;
      // 还需要新的校验地址方法
      if (isaddress(to) == false) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.Check_forwarding_address')
        });

        return;
      }

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.LAMBvalue = parseFloat(this.LAMBvalue).toFixed(6);
      this.transfer(value);
    },
    async transfer(amount) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      let denom = this.$data.denom;
      let memo = this.$data.memo;
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain('transfer', {
          to,
          amount,
          gas,
          denom,
          memo
        });
        // console.log(res);
        if (res.state) {
          let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
          if (gasres.state) {
            console.log(gasres.data);
            this.$data.gaseFee = gasres.data;
            this.confirmModal = true;
            this.$data.transactiondata = res.data;
            this.sendcancel();
          }
          // 触发事件活着回掉函数
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
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
    sendcancel() {
      this.sendModal = false;
      // this.confirmModal=true;
    },
    open(amountBlance, coinType, Tovalue) {
      this.$data.denomBlance = amountBlance || this.balance;
      this.$data.denom = coinType || 'ulamb';
      this.sendModal = true;
      this.confirmModal = false;
      this.editmemo = false;
      this.$data.LAMBvalue = '';
      this.$data.Tovalue = Tovalue || '';
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

