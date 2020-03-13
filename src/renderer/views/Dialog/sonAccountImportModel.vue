<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('somemodel.Importminersubaccount')"
      :styles="{top: '200px'}"

    >
      <p>
         <Upload
            :before-upload="handleUpload"
            action
            >
            <Button icon="ios-cloud-upload-outline">{{$t('somemodel.Select file')}}</Button>
        </Upload>
        {{path}}
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
      password: '',
      path: ''
    };
  },
  methods: {
    open() {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
    },
    async Submit() {
      var password = this.$data.password;
      var name = this.$data.name;
      var file = this.$data.path;
      if (file == '' || name == '' || password == '') {
        this.$Notice.warning({
          title: this.$t('somemodel.action.needwordpass2'),
          desc: this.$t('somemodel.action.needwordpass2')

        });
        return;
      }
      try {
        let res = await ipc.callMain('ImportSonAccount', {
          password, name, file
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
    },
    handleUpload(e) {
      console.log(e.path);

      this.$data.path = e.path;

      return false;
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

