<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="删除本地配置文件"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">账户地址</span>
          </Input>
        </p>
        <br />
        <p>
          <Input readonly v-model="name" >
            <span slot="prepend">名称</span>
          </Input>
        </p>

        <br />

      </Form >
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal
        loading
        v-model="passwordModal"
        title="确认删除删除本地配置文件"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">账户地址</span>
          </Input>
        </p>
        <br />
        <p>
          <Input readonly v-model="name" >
            <span slot="prepend">名称</span>
          </Input>
        </p>
        <br />
        <p>
          <Input type="password" v-model="password" >
            <span slot="prepend">密码</span>
          </Input>
        </p>

      </Form >
        <div slot="footer">
          <Button type="primary" @click="SubmitForm">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>



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
      passwordModal: false,
      confirmModal: false,
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      voteType: 'Yes',
      title: '',
      address: '',
      name: '',
      password: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(item) {
      this.$data.address = item.address;
      this.$data.name = item.name;
      this.sendModal = true;
      console.log('open');
    },
    sendcancel() {
      this.sendModal = false;
      this.passwordModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      this.sendModal = false;
      this.passwordModal = true;
    },
    async SubmitForm() {
      var address = this.$data.address;
      var password = this.$data.password;

      try {
        let res = await ipc.callMain('deleteaccount', {
          address, password
        });

        if (res.state) {
          this.sendcancel();
          this.$Notice.success({
            title: '成功',
            desc: '删除账户信息成功'
          });
          eventhub.$emit('deleteaccountSuccess');
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

