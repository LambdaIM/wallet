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
          <Input readonly v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('Dialog.redelegateModel.turnout')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">TBB</span>
          </Input>
        </p>
        <br />
        <p>

              <Select :label-in-value="true" @on-change="getselectvalue" :placeholder="$t('Dialog.redelegateModel.choosepledge')" size="large"  v-model="Tovaluenew" style="width:100%">
                  <Option  v-for="item in validatorsList"  :value="item.operator_address" :label="item.description.moniker">
                      <span >{{item.operator_address.substring(0,40)}}...</span>
                      <span style="float:right;color:red">{{item.description.moniker}}</span>
                  </Option>

              </Select>
        </p>
        <br />
        <p style="color:red">
          {{$t('Dialog.redelegateModel.tip',[this.days()])}}
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

import ConfirmModal from './confirmModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      Tovalue: '',
      Tovaluenew: '',
      LAMBvalue: '',
      isdege: true,
      gaseFee: 0,
      validatorsList: [],
      validatorName: '',
      dataParameters: {}
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    getselectvalue(item) {
      console.log(item);
      this.$data.validatorName = item.label;
    },
    async getListData() {
      console.log('getListData');
      try {
        let res = await ipc.callMain('validatorsList', {});

        // console.log(res);
        console.log(res);

        if (res.state) {
          this.$data.validatorsList = res.data;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    async open(toaddress, isdege, validatorType) {
      this.$data.Tovalue = toaddress;
      this.$data.isdege = isdege || isdege;
      this.sendModal = true;
      this.$data.validatorType = validatorType;
      if (validatorType == undefined) {
        throw new Error('need validatorType');
      }
      this.$data.LAMBvalue = '';
      this.$data.Tovaluenew = '';

      var result = await this.getListData();
      this.stakingParameters();
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let from = this.address;
      let to = this.Tovalue;
      let tonew = this.Tovaluenew;
      let value = this.toBigNumStr(this.LAMBvalue);
      if (to == tonew) {
        this.$Notice.warning({
          title: this.$t('Dialog.redelegateModel.action.differentaddresses')
        });
        return;
      }

      // if (this.bigLess0OrGreater(value, this.balance)) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title: this.$t('home.action.check_balance_amount_transfer')
      //   });
      //   return;
      // }
      if (tonew == '') {
        this.$Notice.warning({
          title: this.$t('Dialog.redelegateModel.action.selectaddresses')
        });
        return;
      }
      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.LAMBvalue = parseFloat(this.LAMBvalue).toFixed(6);
      this.transfer(value);
    },
    async transfer(amount) {
      let SourceAddress = this.Tovalue;
      let DestinationAddress = this.Tovaluenew;
      let gas = 1;
      let validatortype = this.$data.validatorType;

      this.$data.transactiondata = null;

      try {
        let res = await ipc.callMain('redelegate', {
          SourceAddress, DestinationAddress, amount, validatortype
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('redelegate', res.data);

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
    async stakingParameters() {
      try {
        let res = await ipc.callMain('stakingParameters', {});
        if (res.state) {
          console.log('--');
          console.log(res);
          this.$data.dataParameters = res.data;
        }
      } catch (error) {

      }
    },
    days() {
      if (this.$data.dataParameters.unbonding_time == undefined) {
        return '';
      }
      return (this.$data.dataParameters.unbonding_time / (1000 * 1000 * 1000 * 60 * 60 * 24)).toFixed(2);
    }

  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balanceLamb: function() {
      return this.$store.getters.getblance;
    },
    isdegeTxt: function() {
      return this.$t('Dialog.redelegateModel.redelegate');
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



