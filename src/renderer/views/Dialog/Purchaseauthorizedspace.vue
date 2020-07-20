<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="$t('Purchasespace.Purchaseauthorizedspace')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input :value="AssetName|assertdenomformat" readonly>
            <span slot="prepend">{{$t('Authorizedminingpop.AssetName')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <a @click="openLinkmarket(AssetName)" >{{$t('Purchasespace.operationaddressbrowser')}}</a>
        </p>
        <br />
        <p>
          <Input v-model="priceinfo" >
            <span slot="prepend">矿工价格信息</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="size" >
               <span slot="prepend">{{$t('Purchasespace.Size')}} </span>
               <span slot="append">GB</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="Duration" >
            <span slot="prepend">{{$t('Purchasespace.duration')}} </span>
            <span slot="append">{{$t('Purchasespace.month')}}</span>
          </Input>
        </p>

        <br />

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
import { DAEMON_CONFIG } from '../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');

export default {
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      name: '',
      asset: '',
      AssetName: '',
      Pubkey: '',
      priceinfo: '',
      size: '',
      Duration: '',
      timeunit: 1000 * 1000 * 1000 * 60 * 60 * 24 * 30
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

      var size = parseInt(this.$data.size);
      var Duration = parseInt(this.$data.Duration);
      var address, price;


      // var address = this.$data.priceinfo;
      try {
        var priceinfo = JSON.parse(this.$data.priceinfo);
        // { "address": "lambdamineroper1g74gwkeq2py5zypv4l223p2s82gqlc28rsp826","price": 1000000 }
        address = priceinfo.address;
        price = priceinfo.price;
      } catch (error) {
        this.$Notice.warning({
          title: '价格信格式错误'
        });
        return;
      }



      if (address.length !== 54) {
        this.$Notice.warning({
          title: this.$t('Purchasespace.action.need_miner_address')
        });
        return;
      }

      if (isNaN(size) || size <= 0) {
        this.$Notice.warning({
          title: this.$t('Purchasespace.action.need_miner_size')
        });
        return;
      }


      if (isNaN(Duration) || Duration <= 0) {
        this.$Notice.warning({
          title: this.$t('Purchasespace.action.need_miner_duration')
        });
        return;
      }


      this.transfer(AssetName, address, size, Duration);
    },
    openLinkmarket(name) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/assetMarket/${name}`;
      shell.openExternal(url);
    },
    async transfer(AssetName, address, Size, Duration) {
      this.$data.transactiondata = null;

      Duration = Duration * (this.$data.timeunit) + '';
      Size = String(Size);

      try {
        let res = await ipc.callMain('assertDamCreateBuyOrder', {
          AssetName, address, Size, Duration
        });
        // console.log(res);

        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('assertDamCreateBuyOrder', res.data);

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
