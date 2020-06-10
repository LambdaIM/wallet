<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="创建授权市场"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >

        <p>
          <Input  v-model="assetsType" >
            <span slot="prepend">资产名称</span>
          </Input>
        </p>
        <br />
        <p>
          <Input  v-model="ratio" >
            <span slot="prepend">兑换比例</span>
          </Input>
        </p>
        <br />
        <p v-if="assetsType&&ratio">
          {{ratio}}{{assetsType.toUpperCase()}} = 1TBB
        </p>
        <br />
        <p>
          兑换比例指的是这个市场，多少币兑换1TB的存储空间,<br/>
          例如3000lamb=1TBB<br/>
          创建市场需要{{parameter.create_market_cost|BlanceValue}}LAMB


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
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      voteType: 'Yes',
      name: '',
      assetsType: '',
      ratio: '',
      parameter: {}
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

      let assetsType = this.assetsType;
      let ratio = parseInt(this.ratio);



      if (assetsType == '') {
        this.$Notice.warning({
          title: '资产名称不能为空'
        });
        return;
      }
      assetsType = 'u' + assetsType;



      if (isNaN(ratio) || ratio <= 0) {
        this.$Notice.warning({
          title: '兑换比例需要是个整数'
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
      this.transfer(assetsType, ratio);
    },
    async transfer(assetsType, ratio) {
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('CreateDigitalAssetMarket', {
          AssetName: assetsType,
          Ratio: ratio
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('CreateDigitalAssetMarket', res.data);

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
          desc: ex.errormsg.errormsg
        });
        console.log(ex);
      }
    },
    async getparameter() {
      let res = await ipc.callMain('Marketparameters', {

      });
      if (res.state) {
        this.$data.parameter = res.data.data;
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
