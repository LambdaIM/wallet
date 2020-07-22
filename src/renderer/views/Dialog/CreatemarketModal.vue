<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="$t('AuthorizedmarketPop.Createanauthorizedmarket')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input  v-model="marketName" >
            <span slot="prepend">{{$t('AuthorizedmarketPop.Marketname')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input  v-model="assetsType" >
            <span slot="prepend">{{$t('AuthorizedmarketPop.AssetName')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input  v-model="ratio" >
            <span slot="prepend">{{$t('AuthorizedmarketPop.Exchangeratio')}}</span>
          </Input>
        </p>
        <br />
        <p v-if="assetsType&&ratio">
          {{ratio}}{{assetsType.toUpperCase()}} = 1TBB
        </p>
        <br />
        <p>
          {{$t('AuthorizedmarketPop.helptip1')}}<br/>
          {{$t('AuthorizedmarketPop.helptip2')}}<br/>
          {{$t('AuthorizedmarketPop.helptip3')}}{{parameter.create_market_cost|BlanceValue}}LAMB


        </p>


      </Form >
        <div slot="footer">
          <Button :goback="goback" type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>


      <ConfirmModal :goback="goback" ref="ConfirmModal" />
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
      gaseFee: 0,
      voteType: 'Yes',
      name: '',
      assetsType: '',
      ratio: '',
      parameter: {},
      marketName: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open() {
      this.sendModal = true;
      this.getparameter();
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');

      let assetsType = this.assetsType.replace(/\s*/g, '');
      let ratio = parseInt(this.ratio);

      let marketName = this.$data.marketName.replace(/\s*/g, '');

      if (marketName == '') {
        this.$Notice.warning({
          title: this.$t('AuthorizedmarketPop.action.need_marketName')
        });
        return;
      }

      if (assetsType == '') {
        this.$Notice.warning({
          title: this.$t('AuthorizedmarketPop.action.need_assetsType')
        });
        return;
      }
      assetsType = 'u' + assetsType;

      if (isNaN(ratio) || ratio <= 0) {
        this.$Notice.warning({
          title: this.$t('AuthorizedmarketPop.action.need_ratio')
        });
        return;
      }
      if (this.bigLess0OrGreater(this.$data.parameter.create_market_cost, this.balance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }
      this.transfer(assetsType, ratio, marketName);
    },
    async transfer(assetsType, ratio, marketName) {
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('CreateDigitalAssetMarket', {
          AssetName: assetsType,
          Ratio: String(ratio),
          marketName: marketName
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('CreateDigitalAssetMarket', res.data, {
            totalAmount: this.parameter.create_market_cost
          });

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
    },
    async getparameter() {
      console.log('getparameter');

      let res = await ipc.callMain('Marketparameters', {

      });
      if (res.state) {
        this.$data.parameter = res.data.data;
      }
    },
    goback() {
      console.log('goback');
      this.sendModal = true;
      this.$refs.ConfirmModal.clase();
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
      return this.$t('proposalsPage.Vote');
    }
  },
  watch: {
    assetsType: function(data) {
      this.$data.assetsType = data.replace(/\s*/g, '');
    },
    marketName: function(data) {
      this.$data.marketName = data.replace(/\s*/g, '');
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
