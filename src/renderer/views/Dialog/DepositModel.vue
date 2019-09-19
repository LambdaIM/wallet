<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="isdegeTxt"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input readonly v-model="title" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">提案</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">LAMB</span>
          </Input>
        </p>
        <br />
        <p>
          {{$t('home.Balance')}} : {{balanceLamb|Lambformat}}

        </p>
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>{{isdegeTxt}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">提案:</Col>
            <Col span="20" class-name="value">{{title}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} LAMB</Col>
          </Row>
          <Row class-name="item">
            <Input v-model="gaseFee" >
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
      sendModal: false,
      confirmModal: false,
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      title: ''
    };
  },
  methods: {
    open(toaddress, title) {
      this.$data.Tovalue = toaddress;
      this.$data.title = title;

      this.sendModal = true;
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let from = this.address;
      let to = this.Tovalue;
      let value = this.toBigNumStr(this.LAMBvalue);


      if (this.bigLess0OrGreater(value, this.balance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }


      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.transfer(value);
    },
    async transfer(amount) {
      let ProposalID = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;

      try {
        let res = await ipc.callMain('deposit', {
          ProposalID,
          amount,
          gas
        });
        // console.log(res);
        if (res.state) {
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
    confirm() {
      if (this.bigNum(this.toBigNumStr(this.$data.gaseFee)).comparedTo(this.$store.getters.balanceLamb) == 1) {
        this.$Notice.warning({
          title: 'error',
          desc: '请减小手续费，手续费不能大于lamb的余额'
        });
        return;
      }
      this.confirmModal = false;
      // this.passwordModal = true;
      eventhub.$emit('TxConfirm', this.$data.transactiondata, this.toBigNumStr(this.$data.gaseFee));
    }

  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getblance;
    },
    balanceLamb: function() {
      return this.$store.getters.getblance;
    },
    isdegeTxt: function() {
      return 'Deposit';
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



