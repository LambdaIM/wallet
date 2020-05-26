<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('sellpageinfo.Initializeminer')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <Form  @keydown.native.enter.prevent ="prewithdrawalLAMB" >
      <p>
        {{$t('sellpageinfo.Initializeminertip')}}
      </p>
      <br />
      <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('txPopup.Operator')}}</span>
          </Input>
        </p>
        <br />
        <p>
        <Select :placeholder="$t('somemodel.Miningsubaccount')" @on-change="selectvalue" v-model="accountAddress" >
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
      </Form>

      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>

    <ConfirmModal ref="ConfirmModal" />
  </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
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
  components: {
    ConfirmModal
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
          title: this.$t('somemodel.action.accountAddress')
        });
        return;
      }

      if (this.$data.DhtId == '') {
        this.$Notice.warning({
          title: this.$t('sellpageinfo.action.needdhtid')
        });
        return;
      }



      this.$data.withdrawalModal = false;
      this.transfer({
        miningAddress: this.$data.accountAddress,
        dhtId: this.$data.DhtId

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
          this.sendcancel();
          this.$refs.ConfirmModal.open('CreateMiner', res.data);
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

