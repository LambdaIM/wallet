<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="购买授权空间"
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
          <a @click="openLinkmarket(AssetName)" >在浏览器中查找矿工地址</a>
        </p>
        <br />
        <p>
          <Input v-model="mineraddress" >
            <span slot="prepend">矿工操作地址 </span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="size" >
               <span slot="prepend">空间大小 </span>
               <span slot="append">GB</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="Duration" >
            <span slot="prepend">时长 </span>
            <span slot="append">月</span>
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
      mineraddress: '',
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
      var address = this.$data.mineraddress;
      var size = parseInt(this.$data.size);
      var Duration = parseInt(this.$data.Duration);

      if (address.length !== 54) {
        this.$Notice.warning({
          title: '请填写矿工地址、检查矿工地址格式'
        });
        return;
      }

      if (isNaN(size) || size <= 0) {
        this.$Notice.warning({
          title: '空间大小需要为整数，并且大于0'
        });
        return;
      }


      if (isNaN(Duration) || Duration <= 0) {
        this.$Notice.warning({
          title: '时长需要为整数，并且大于0'
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
