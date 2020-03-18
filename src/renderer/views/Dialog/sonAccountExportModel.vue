<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('somemodel.Exportsubaccount')"
      :styles="{top: '200px'}"

    >
    <Form  @keydown.native.enter.prevent ="Submit" >
      <p>
        <Input type="password" v-model="password" :placeholder="$t('somemodel.Walletpassword')"  />
      </p>
    </Form >
      <div slot="footer">
        <Button type="primary" @click="Submit">{{$t('home.Modal1.Submit')}}</Button>
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
      password: '',
      sondata: null
    };
  },
  methods: {
    open(row) {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.$data.sondata = row;
    },
    async Submit() {
      try {
        let res = await ipc.callMain('exportSonAccount', {
          address: this.$data.sondata.address,
          password: this.$data.password
        });

        if (res.state) {
          this.$data.withdrawalModal = false;
          eventhub.$emit('exportSonConfirm');
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
