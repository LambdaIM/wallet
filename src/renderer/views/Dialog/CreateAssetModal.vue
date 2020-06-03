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
          <Input  v-model="assetsType" >
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
          <Input  v-model="assetsType" >
            <span slot="prepend">每块高增发量</span>
          </Input>
        </p>
        <br />
        <p v-if="MintType=='3'">
          <Input  v-model="assetsType" >
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
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      MintType: ''
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
      let assetsType = this.assetsType;
      let ratio = parseInt(this.ratio);

      if (name == '') {
        this.$Notice.warning({
          title: '市场名称不能为空'
        });
        return;
      }

      if (assetsType == '') {
        this.$Notice.warning({
          title: '资产名称不能为空'
        });
        return;
      }
      assetsType = 'u' + assetsType;



      if (isNaN(ratio)) {
        this.$Notice.warning({
          title: '兑换比例需要是个整数'
        });
        return;
      }
      this.transfer(name, assetsType, ratio);
    },
    async transfer(name, assetsType, ratio) {
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('vote', {
          name, assetsType, ratio
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('vote', res.data);

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
