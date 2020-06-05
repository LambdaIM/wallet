<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="授权市场质押"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input :value="AssetName|denomformat" readonly>
            <span slot="prepend">资产名称</span>
          </Input>
        </p>
        <br />
        <p>

          <Input  v-model="Amount" >
          <span slot="prepend">金额</span>
          </Input>
        </p>

        <br />

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
      Amount: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(data) {
      console.log('data', data);
      this.$data.AssetName = data.denom;
      this.sendModal = true;
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      var AssetName = this.$data.AssetName;
      var Amount = parseInt(this.$data.Amount);
      if (isNaN(Amount) || Amount <= 0) {
        this.$Notice.warning({
          title: '质押金额，只能为整数'
        });
        return;
      }
      Amount = this.toBigNumFixed(Amount);



      this.transfer({
        AssetName,
        Amount
      });
    },
    async transfer(praobj) {
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
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
