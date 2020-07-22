<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="isdegeTxt"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input readonly v-model="title" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t("head.proposals")}}</span>
          </Input>
        </p>
        <br />
        <p style="    text-align: center">
          <RadioGroup  v-model="voteType" type="button">
            <Radio value="Yes" label="Yes">{{$t('proposalsPage.Yes')}}</Radio>
            <Radio value="No" label="No">{{$t('proposalsPage.No')}}</Radio>
            <Radio value="NoWithVeto" label="NoWithVeto">{{$t('proposalsPage.NoWithVeto')}}</Radio>
            <Radio value="Abstain" label="Abstain">{{$t('proposalsPage.Abstain')}}</Radio>
        </RadioGroup>

        </p>
        <br />
        <p>
          {{$t('Dialog.com.Proposaltip')}}

        </p>
      </Form >
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>


      <ConfirmModal :goback="goback" ref="ConfirmModal" />
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
      title: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(toaddress, title) {
      this.$data.Tovalue = toaddress;
      this.$data.title = title;

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
    },
    goback() {
      console.log('goback');
      this.sendModal = true;
      this.$refs.ConfirmModal.clase();
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



