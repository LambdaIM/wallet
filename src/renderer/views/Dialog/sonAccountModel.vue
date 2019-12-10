<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('Dialog.withdrawalModal.title')"
      :styles="{top: '200px'}"

    >
      <p>
        <Input v-model="world" type="textarea" :rows="8" placeholder="助记次" />
      </p>
      <br/>
      <p>
        <Input v-model="name" placeholder="备注"  />
      </p>
      <br/>
      <p>
        <Input v-model="password" placeholder="密码"  />
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

      let res = await ipc.callMain('createSonAccount', {
        mnemonic, password, name, index
      });

      console.log(res);
    }

  },
  computed: {
    DistributionReward() {
      return this.bigNumType(this.$store.getters.getDistributionReward);
    },
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getblance;
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

