<template>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">

        <div class="modal-header" slot="header">
          <Form  @keydown.native.enter.prevent ="confirm" >
          <div v-if="txtype=='send'">
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
          <div v-if="txtype=='withdrawal'">
            <h2>{{$t('Dialog.withdrawalModal.title')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('home.Modal1.From')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row class-name="item" v-if="transactiondata.amount">
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{transactiondata.amount|BlanceValue }} {{denomShort(transactiondata.denom)}}</Col>
                </Row>
          </div>
          <div v-if="txtype=='minerwithdrawal'">
            <h2>{{$t('somemodel.Extractstorageandmininrewards')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('home.Modal1.From')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row class-name="item" >
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{MinerDistributionReward }} LAMB</Col>
                </Row>
          </div>
          <div v-if="txtype=='withdrawalDistribution'">
                <h2>{{$t('home.Withdrawprofit')}}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key ">{{$t('home.Modal1.From')}}:</Col>
                    <Col span="20" class-name="value address">{{address}}</Col>
                </Row>
                <Row class-name="item" >
                    <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                    <Col span="20" class-name="value">{{DistributionReward }} LAMB</Col>
                </Row>
          </div>
          <div v-if="txtype=='transferDelegation'">
              <h2 v-if="transactiondata.type=='MsgDelegate'">{{$t('Dialog.stakingModel.title1')}}</h2>
              <h2 v-if="transactiondata.type=='MsgUndelegate'">{{$t('Dialog.stakingModel.title2')}}</h2>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
                <Col span="20" class-name="value">{{address}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.validatorAddress}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.amount|BlanceValue}} TBB</Col>
              </Row>

          </div>
          <div v-if="txtype=='redelegate'">
             <h2>{{$t('Dialog.redelegateModel.redelegate')}}</h2>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
                <Col span="20" class-name="value address">{{address}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.turnout')}}:</Col>
                <Col span="20" class-name="value address">{{transactiondata.validatorSourceAddress}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.turnin')}}:</Col>
                <Col span="20" class-name="value address">{{transactiondata.validatorDestinationAddress}}</Col>
              </Row>
              <Row class-name="item">
                <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
                <Col span="20" class-name="value">{{transactiondata.amount|BlanceValue}} TBB</Col>
              </Row>

          </div>
          <Row class-name="item">
            <Input ref="gasinput_"  v-model="gaseFee" >
              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
              <span slot="append">LAMB</span>
          </Input>
          </Row>
          <Row v-if="transactiondata.memo!=undefined "  class-name="item">
            <Input  v-model="transactiondata.memo" readonly type="textarea" :rows="4"  />
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
    },
    denomShort: function(denom) {
      return denom.substr(1).toUpperCase();
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    denomShow: function() {
      return this.transactiondata.amounts[0].denom.substr(1).toUpperCase();
    },
    MinerDistributionReward() {
      return this.bigNumType(this.$store.getters.getMinerReward);
    },
    DistributionReward() {
      // 节点收益
      return this.bigNumType(this.$store.getters.getDistribution);
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
