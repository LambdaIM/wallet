<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      title="创建矿工子账户"
      :styles="{top: '200px'}"

    >
      <p>
         <Upload
            :before-upload="handleUpload"
            action
            >
            <Button icon="ios-cloud-upload-outline">Select the file </Button>
        </Upload>
      </p>
      <br/>
      <p>
        <Input v-model="name" placeholder="备注"  />
      </p>
      <br/>
      <p>
        <Input type="password" v-model="password" placeholder="密码"  />
      </p>
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

