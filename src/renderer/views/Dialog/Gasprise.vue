<template>
<div>
     <Modal
        v-model="showmodel"
        title="设置gas价格"
        @on-ok="submitdata"
        >
        <Input v-model="gasprise" placeholder="请填写价格"  />
        <div>
          <br/>
          验证节点gas价格为{{Validatorgasprise}}，
          您设置的gas的价格不得小于{{Validatorgasprise}},
          gas的价格小于{{Validatorgasprise}},钱包发出的交易无法被打包
        </div>
    </Modal>
</div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      showmodel: false,
      gasprise: '',
      Validatorgasprise: ''
    };
  },
  mounted() {

  },
  methods: {
    open() {
      this.$data.showmodel = true;
      this.$data.gasprise = this.$store.getters.gasprise;
      this.getValidatorgasprise();
    },
    async getgasprise() {
      var _this = this;
      var res = await ipc.callMain('getgasprice', {});
      _this.$data.gasprise = res.data.gasprice;
    },
    async getValidatorgasprise() {
      var _this = this;
      var res = await ipc.callMain('httpgasprise', {});
      _this.$data.Validatorgasprise = res.data.gasprice;
      _this.$data.Validatorgasprise = _this.$data.Validatorgasprise.replace('ulamb', '');
      _this.$data.Validatorgasprise = this.bigNum(_this.$data.Validatorgasprise).toString();
    },
    async  submitdata() {
      var gasprise = this.$data.gasprise;
      gasprise = parseFloat(gasprise);
      if (isNaN(gasprise)) {
        this.$Message.error('gas 的价格 必须为是数字');
        return;
      }
      if (gasprise < 0) {
        this.$Message.error('gas 的价格不能小于0');
        return;
      }
      var res = await ipc.callMain('setgasprice', {
        gasprice: gasprise
      });
      if (res.state) {
        console.log('gas 价格更新成功');
        this.$store.dispatch('setgasprise', gasprise);
      }
    }
  }
};
</script>
