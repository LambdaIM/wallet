<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="isdegeTxt"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
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
          {{$t('Dialog.redelegateModel.tip')}}
        </p>

        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>{{isdegeTxt}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.turnout')}}:</Col>
            <Col span="20" class-name="value">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.turnin')}}:</Col>
            <Col span="20" class-name="value">{{Tovaluenew}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('Dialog.redelegateModel.validatorname')}}:</Col>
            <Col span="20" class-name="value">{{validatorName}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} TBB</Col>
          </Row>
          <Row class-name="item">
            <Input v-model="gaseFee" >
                              <span slot="prepend">{{$t('Dialog.com.gasfee')}}</span>
                                <span slot="append">LAMB</span>
                              </Input>
          </Row>
        </div>

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
      sendModal: false,
      confirmModal: false,
      Tovalue: '',
      Tovaluenew: '',
      LAMBvalue: '',
      isdege: true,
      gaseFee: 0,
      validatorsList: [],
      validatorName: ''
    };
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
      var result = await this.getListData();
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

      if (this.bigLess0OrGreater(value, this.balance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }
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
    confirm() {
      if (this.bigNum(this.toBigNumStr(this.$data.gaseFee)).comparedTo(this.$store.getters.balanceLamb) == 1) {
        this.$Notice.warning({
          title: 'error',
          desc: this.$t('Dialog.com.Lesscommission')
        });
        return;
      }
      this.confirmModal = false;
      // this.passwordModal = true;
      eventhub.$emit('TxConfirm', this.$data.transactiondata, this.toBigNumStr(this.$data.gaseFee));
    }

  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getbalanceSto;
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



