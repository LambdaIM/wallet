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
          <span slot="prepend">价格</span>
            <span slot="append">{{AssetName|assertdenomformat}}/GB/month</span>
          </Input>
        </p>

        <br />
        <p>
          {{$t('AuthorizeMarketpledge.tip1')}}<br/>
          {{$t('AuthorizeMarketpledge.tip2')}}<br/>
          {{$t('AuthorizeMarketpledge.tip3')}}
        </p>
        <p style="color:red">
          需要注意的是在一个市场中初次质押时候填写的价格为实际有效的价格，之后再次补充质押，价格填1即可，<br/>
          在浏览器中可以查询质押记录和初次质押的价格
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
      Price: ''
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
          title: '请填写价格'
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
          this.$refs.ConfirmModal.open('DigitalAssetPledge', res.data);
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
      return this.$t('proposalsPage.Vote');
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
