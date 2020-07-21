<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="$t('AuthorizeMarketpledge.pledge')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input :value="AssetName|assertdenomformat" readonly>
            <span slot="prepend">{{$t('AuthorizeMarketpledge.AssetName')}}</span>
          </Input>
        </p>
        <br />
        <p>

          <Input  v-model="Size" >
          <span slot="prepend">{{$t('AuthorizeMarketpledge.space')}}</span>
            <span slot="append">GB</span>
          </Input>
        </p>
        <br />
        <p>

          <Input  v-model="Price" >
          <span slot="prepend">{{$t('Dialog.sellorder.unitprice1')}}</span>
            <span slot="append">{{AssetName|assertdenomformat}}/GB/month</span>
          </Input>
        </p>

        <br />
        <p v-if="isNaN(Compensation)==false">{{$t('Marketothers.pledgeassets')}}：{{Compensation}} {{AssetName|assertdenomformat}} </p>
        <p>
          {{$t('AuthorizeMarketpledge.tip1')}}<br/>
          {{$t('AuthorizeMarketpledge.tip2')}}<br/>
          {{$t('AuthorizeMarketpledge.tip3')}}
        </p>
        <p style="color:red">
          {{$t('AuthorizeMarketpledge.tip4')}}
        </p>

      </Form >
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
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
      name: '',
      asset: '',
      AssetName: '',
      Size: '',
      Price: '',
      market: {}
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(data) {
      console.log('data', data);
      this.$data.AssetName = data.assetName;
      this.sendModal = true;
      this.$data.market = data;
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      var AssetName = this.$data.AssetName;
      var Size = parseInt(this.$data.Size);
      var Price = parseFloat(this.$data.Price);
      if (isNaN(Size) || Size <= 0) {
        this.$Notice.warning({
          title: this.$t('AuthorizeMarketpledge.action.need_size')
        });
        return;
      }
      Size = String(Size);

      if (isNaN(Price) || Price <= 0) {
        this.$Notice.warning({
          title: this.$t('AuthorizeMarketpledge.action.need_price')
        });
        return;
      }
      Price = this.toBigNumStr(Price);

      this.transfer({
        AssetName,
        Size,
        Price
      });
    },
    async transfer(praobj) {
      this.$data.transactiondata = null;

      try {
        let res = await ipc.callMain('DigitalAssetPledge', praobj);

        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('DigitalAssetPledge', res.data, {
            totalAmount: this.Compensation
          });
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
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
    },
    Compensation: function() {
      var Size = parseInt(this.$data.Size);
      var Price = parseFloat(this.$data.Price);
      var exchangeRatio = parseInt(this.$data.market.exchangeRatio);

      return (Size * Price * exchangeRatio / 1000).toFixed(3);
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
