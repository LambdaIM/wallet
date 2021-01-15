<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="$t('poolmarketinfo.DepositPopup.title')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input readonly v-model="title" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('poolmarketinfo.DepositPopup.Marketname')}}</span>
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
        <br />
        <p>
          1:{{$t('poolmarketinfo.DepositPopup.help1')}}{{min_supply_amount|Lambformat}}<br/>
          2:{{$t('poolmarketinfo.DepositPopup.help2')}}<br/>
          3:{{$t('poolmarketinfo.DepositPopup.help3')}}<br/>
          4:{{$t('poolmarketinfo.DepositPopup.help4')}}<br/>
        </p>
        </Form >


        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>


      <ConfirmModal ref="ConfirmModal" />
</div>
</template>
<script>
import eventhub from '../../../common/js/event.js';
import ConfirmModal from '../confirmModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      title: '',
      min_supply_amount: ''

    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    // loanmarketsParams
    async getParams() {
      let res = await ipc.callMain('loanmarketsParams', {});
      if (res.state) {
        console.log(res.data.data);
        this.$data.min_supply_amount = res.data.data.min_supply_amount;
      }
    },
    async open(loanmarket) {
      this.$data.Tovalue = loanmarket.name;
      this.$data.title = loanmarket.name;

      this.sendModal = true;
      await this.getParams();
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
      if (this.bigLess0OrGreater(this.$data.min_supply_amount, value)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
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
      let name = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;

      try {
        let res = await ipc.callMain('loan_Supply', {
          name,
          amount,
          gas
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('loan_Supply', res.data);

          // let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
          // if (gasres.state) {
          //   this.$data.gaseFee = gasres.data;
          //   this.$data.transactiondata = res.data;
          //   this.sendcancel();
          //   this.confirmModal = true;
          // }
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
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
      return this.$t('proposalsPage.Deposit');
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



