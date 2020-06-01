<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="取消卖单"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>

            订单id：{{sellorderinfo.orderId}}

        </p>
        <br />
        <p>

            市场名称：{{marketName}}

        </p>
        <br />
        <p>
          状态：
                        <span style="color:green" v-if="sellorderinfo.status=='0'">
                           {{$t('marketpage.Active')}}
                        </span>
                        <span style="color:red" v-if="sellorderinfo.status=='1'">
                           {{$t('marketpage.Finish')}}
                        </span>
        </p>


        <br />
        <p>
          价格：{{sellorderinfo.price|Lambformat}}
        </p>
            <br />
        <p>
            总空间：{{sellorderinfo.sellSize}}GB
        </p>
            <br />
        <p>
          剩余空间：{{sellorderinfo.unUseSize}}GB
        </p>


      </Form >
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
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
      sendModal: false,
      confirmModal: false,
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      voteType: 'Yes',
      title: '',
      sellorderinfo: null,
      marketName: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(data, marketName) {
    //   this.$data.Tovalue = toaddress;
    //   this.$data.title = title;
      console.log('data', data);
      this.$data.sellorderinfo = data;
      this.$data.marketName = marketName;

      this.sendModal = true;
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let from = this.address;
      let to = this.Tovalue;
      let value = this.toBigNumStr(this.LAMBvalue);

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.transfer(value);
    },
    async transfer(amount) {
      let ProposalID = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      let option = this.$data.voteType;
      // amount = amount * 10000;

      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('vote', {
          ProposalID,
          option,
          gas
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('vote', res.data);

          // let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
          // if (gasres.state) {
          //   this.$data.gaseFee = gasres.data;
          //   this.$data.transactiondata = res.data;
          //   this.sendcancel();
          //   this.confirmModal = true;
          // }
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
    balance: function() {
      return this.$store.getters.getblance;
    },
    balanceLamb: function() {
      return this.$store.getters.getblance;
    },
    isdegeTxt: function() {
      return this.$t('proposalsPage.Vote');
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
