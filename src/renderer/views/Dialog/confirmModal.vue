<template>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">

        <div class="modal-header" slot="header">
          <Form  @keydown.native.enter.prevent ="confirm" >
          <div v-if="txtype='send'">
              <h2>{{$t('home.Modal1.Transfer')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('home.Modal1.From')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row  class-name="item">
                    <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
                    <Col span="20" class-name="value address">{{transactiondata.toAddress}}</Col>
                </Row>
                <Row class-name="item" v-if="transactiondata.amounts">
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{transactiondata.amounts[0].amount}} {{denomShow}}</Col>
                </Row>
          </div>
          <Row class-name="item">
            <Input ref="gasinput_"  v-model="gaseFee" >
              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
              <span slot="append">LAMB</span>
          </Input>
          </Row>
          <Row v-if="editmemo==true"  class-name="item">
            <Input  v-model="memo" readonly type="textarea" :rows="4"  />
          </Row>
          </Form>

        </div>
        <div slot="footer">
          <Button type="primary" @click="confirm">{{$t('home.Modal1.Confirm')}}</Button>
        </div>

      </Modal>
</template>
<script>
import Gasinput from './Gas.vue';
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  components: {
    Gasinput
  },
  data() {
    return {
      confirmModal: false,
      editmemo: false,
      transactiondata: {},
      txtype: '',
      gaseFee: ''
    };
  },
  mounted() {
    eventhub.$on('gaseValue', data => {
      this.$data.gaseFee = data;
    });
  },
  methods: {
    open(txtype, transactiondata) {
      console.log('打开对话框');
      this.$data.txtype = txtype;
      this.$data.transactiondata = transactiondata;
      eventhub.$emit('GetGase', transactiondata);
      this.getgase();

      this.confirmModal = true;
      var _this = this;
      setTimeout(() => {
        _this.$refs.gasinput_.focus();
      });
    },
    confirm() {
      var comparedNum = this.bigNum(this.toBigNumStr(this.$data.gaseFee)).comparedTo(this.$store.getters.balanceLamb);
      if (comparedNum == 1 || comparedNum == null) {
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Dialog.com.Lesscommission')
        });
        return;
      }
      this.confirmModal = false;
      console.log(this.$data.transactiondata);

      eventhub.$emit('TxConfirm', this.$data.transactiondata, this.toBigNumStr(this.$data.gaseFee));
    },
    async getgase() {
      try {
        let res = await ipc.callMain('Simulate', { transactiondata: this.$data.transactiondata });
        if (res.state) {
          this.$data.gaseFee = res.data;
          // eventhub.$emit('gaseValue', res.data);
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
    denomShow: function() {
      return this.transactiondata.amounts[0].denom.substr(1).toUpperCase();
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

.address{
  font-family: Consolas,Monaco,monospace;
}
</style>
