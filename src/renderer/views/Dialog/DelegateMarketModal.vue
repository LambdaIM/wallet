<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="$t('Marketoperation.marketpledge')"
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
          <Input readonly v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('home.Modal1.To')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">LAMB</span>
          </Input>
        </p>


        <br/>

        {{$t('Marketoperation.pledgetip1')}} {{market_delegate_min_cost|Lambformat}}


        </Form >
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>


      <ConfirmModal ref="ConfirmModal" />
</div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');



export default {
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      Tovalue: '',
      LAMBvalue: '',
      isdege: true,
      gaseFee: 0,
      dataParameters: {},
      market_delegate_min_cost: 0
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(toaddress) {
      this.$data.Tovalue = toaddress;


      this.sendModal = true;


      this.$data.LAMBvalue = '';

      this.getmarketinfo();
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let from = this.address;
      let to = this.Tovalue;
      try {
        var valuenum = parseFloat(this.LAMBvalue);
        if (isNaN(valuenum) == false) {
          if (valuenum < 1) {
            this.$Notice.warning({
              title: this.$t('stakinginfo.Pledgeamountlessthan1')
            });
            return;
          }
        }
      } catch (error) {

      }



      let value = this.toBigNumStr(this.LAMBvalue);

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }

      if (to == from) {
        this.$Notice.warning({
          title: this.$t('home.action.not_transfer_LAMB_to_yourself')
        });
        return;
      }

      if (this.bigLess0OrGreater(value, this.balance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }
      if (this.bigNum(value).comparedTo(this.$data.market_delegate_min_cost) == -1) {
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Marketoperation.tip', [this.toBigNumTonum(this.$data.market_delegate_min_cost)])
        });
        return;
      }



      this.LAMBvalue = parseFloat(this.LAMBvalue).toFixed(6);
      this.transfer(Number(value));
    },
    async transfer(amount) {
      let to = this.Tovalue;

      this.$data.transactiondata = null;

      try {
        let res = await ipc.callMain('marketTransferDelegateMarket', {
          marketName: to,
          amount

        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('marketTransferDelegateMarket', res.data);
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
    },
    async   getmarketinfo() {
      console.log('getmarketinfo');
      let res = await ipc.callMain('marketinfo', {});
      if (res.state) {
        this.$data.market_delegate_min_cost = res.data.data.market_delegate_min_cost;
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

.helpul{
   list-style-type:none
}
</style>
