<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('sellpageinfo.Initializeminer')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p>
        {{$t('sellpageinfo.Initializeminertip')}}
      </p>
      <br />
      <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br />
        <p>
        <Select @on-change="selectvalue" v-model="accountAddress" >
            <Option v-for="item in accountlist" :value="item.address" :label="item.address" :key="item.address">
               <span>{{ item.address }}</span>
            <span style="float:right;color:red">{{item.name}}</span>

            </Option>
        </Select>
        </p><br/>
        <p>
          <Input  v-model="DhtId" placeholder="">
            <span slot="prepend">DhtId</span>
          </Input>
        </p><br/>
        <p>
          <Input  v-model="pubKey" placeholder="">
            <span slot="prepend">pubKey</span>
          </Input>
        </p>
      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>
    <Modal v-model="confirmModal" :styles="{top: '200px'}">
      <div class="modal-header" slot="header">
        <h2>{{$t('sellpageinfo.Initializeminer')}}</h2>
        <Row class-name="item">
          <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
          <Col span="20" class-name="value">{{address}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">挖矿子账户:</Col>
          <Col span="20" class-name="value">{{accountAddress}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">DhtId:</Col>
          <Col span="20" class-name="value">{{DhtId}}</Col>
        </Row>
        <Row class-name="item">
          <Col span="4" class-name="key">pubKey:</Col>
          <Col span="20" class-name="value"><Input  readonly v-model="pubKey" type="textarea"  /></Col>
        </Row>

        <Row class-name="item">
            <Input  v-model="gaseFee" >
                              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
                                <span slot="append">LAMB</span>
                              </Input>
          </Row>
      </div>
      <!-- <p>
          <Input v-model="walletPassword" type="password"></Input>
      </p>-->
      <div slot="footer">
        <Button type="primary" @click="confirm">{{$t('home.Modal1.Confirm')}}</Button>
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
      accountlist: [],
      accountAddress: '',
      DhtId: '',
      pubKey: ''
    };
  },
  methods: {
    open() {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.accountList();
    },
    selectvalue(e) {
      console.log(e);
      this.$data.accountAddress = e;
    },
    prewithdrawalLAMB() {
      console.log('- -');
      if (this.$data.accountAddress == '') {
        this.$Notice.warning({
          title: this.$t('sellpageinfo.action.accountAddress')
        });
        return;
      }

      if (this.$data.DhtId == '') {
        this.$Notice.warning({
          title: this.$t('sellpageinfo.action.needdhtid')
        });
        return;
      }

      if (this.$data.pubKey == '') {
        this.$Notice.warning({
          title: this.$t('sellpageinfo.action.needpubKey')
        });
        return;
      }

      this.$data.withdrawalModal = false;
      this.transfer({
        miningAddress: this.$data.accountAddress,
        dhtId: this.$data.DhtId,
        pubKey: this.$data.pubKey
      }, 'CreateMiner');
    },
    async accountList() {
      console.log('accountList');
      // sonAccountList
      let res = await ipc.callMain('sonAccountList', {});
      // console.log(res);
      if (!res.state) return;
      // console.log(res);
      res.data.forEach(element => {
        element.lambdavalue = '';
        if (element.account.coins != null) {
          element.account.coins.forEach(item => {
            if (item.denom == 'ulamb') {
              element.lambdavalue = item.amount;
            }
          });
        }
      });
      this.$data.accountlist = res.data;
    },
    async transfer(objpra, txType) {
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain(txType, objpra);
        // console.log(res);
        if (res.state) {
          console.log(res.data);
          let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
          if (gasres.state) {
            this.$data.gaseFee = gasres.data;
            this.$data.transactiondata = res.data;
            this.sendcancel();
            this.confirmModal = true;
          }
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
    },
    sendcancel() {
      this.withdrawalModal = false;
      // this.confirmModal=true;
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

