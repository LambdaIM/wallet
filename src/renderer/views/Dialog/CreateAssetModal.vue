<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="创建资产"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input v-model="name" >
            <span slot="prepend">资产名称</span>
          </Input>
        </p>
        <br />
        <p>
          <Input  v-model="asset" >
            <span slot="prepend">初始发行量</span>
          </Input>
        </p>
        <br />
        <p>
          增发类型
          <RadioGroup v-model="MintType">
            <Radio label="1">不可增发</Radio>
            <Radio label="2">一次性增发</Radio>
            <Radio label="3">挖矿增发</Radio>
        </RadioGroup>
        </p>
        <br />
        <p  v-if="MintType=='3'">
          <Input  v-model="inflation" >
            <span slot="prepend">每块高增发量</span>
          </Input>
        </p>
        <br />
        <p v-if="MintType=='3'">
          <Input  v-model="inflation_period" >
            <span slot="prepend">增发块高周期</span>
          </Input>
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
      MintType: '1',
      inflation: '',
      inflation_period: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open() {
      this.sendModal = true;
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let name = this.name;
      let asset = parseInt(this.asset);
      let MintType = this.MintType;
      let inflation = parseInt(this.inflation);
      let inflation_period = parseInt(this.inflation_period);

      if (name == '') {
        this.$Notice.warning({
          title: '资产名称不能为空'
        });
        return;
      }


      if (isNaN(asset) || asset <= 0) {
        this.$Notice.warning({
          title: '初始化发行量需要为数值'
        });
        return;
      }
      if (MintType == '3') {
        if (isNaN(inflation) || inflation <= 0) {
          this.$Notice.warning({
            title: '每块高增发量需要为数值'
          });
          return;
        }

        if (isNaN(inflation_period) || inflation_period <= 0) {
          this.$Notice.warning({
            title: '增发块高周期需要为数值'
          });
          return;
        }
      }


      name = 'u' + name;

      this.transfer({
        name,
        asset,
        MintType,
        inflation,
        inflation_period
      });
    },
    async transfer(objpra) {
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('CreateAsset', {
          asset_amount: objpra.asset,
          asset_denom: objpra.name,
          name: objpra.name,
          mint_type: objpra.MintType,
          inflation: objpra.inflation,
          inflation_period: objpra.inflation_period
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('CreateAsset', res.data);

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
