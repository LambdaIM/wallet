<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('somemodel.Miningsubaccount')"
      :styles="{top: '200px'}"

    >
      <p>
        <Input v-model="world" type="textarea" :rows="8" :placeholder="$t('somemodel.Mnemonicword')" />
      </p>
      <br/>
      <p>
        <Input v-model="name" :placeholder="$t('somemodel.remarks')"  />
      </p>
      <br/>
      <p>
        <Input type="password" v-model="password" :placeholder="$t('somemodel.Walletpassword')"  />
      </p>
      <div slot="footer">
        <Button type="primary" @click="Submit">{{$t('home.Modal1.Confirm')}}</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
export default {
  data() {
    return {
      withdrawalModal: false,
      confirmModal: false,
      gaseFee: 0,
      world: '',
      name: '',
      password: ''
    };
  },
  methods: {
    open() {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
    },
    async Submit() {
      var mnemonic = this.$data.world;
      var password = this.$data.password;
      var name = this.$data.name;
      var index = '1';
      if (mnemonic == '' || password == '' || name == '') {
        this.$Notice.warning({
          title: this.$t('somemodel.action.needwordpass1'),
          desc: this.$t('somemodel.action.needwordpass1')
        });
        return;
      }
      try {
        let res = await ipc.callMain('createSonAccount', {
          mnemonic, password, name, index
        });

        if (res.state) {
          this.$data.withdrawalModal = false;
          eventhub.$emit('createSonAccountConfirm');
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

