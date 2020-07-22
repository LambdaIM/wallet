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
            <span slot="prepend">{{$t('txPopup.Operator')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('txPopup.Validator')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">TBB</span>
          </Input>
        </p>


        <br/>
        <p v-if="isdege==false" style="color:red">

            <ul class="helpul">
            <li>- {{$t('Dialog.stakingModel.tip',[this.days()])}}。</li>
            <li>- {{$t('Dialog.stakingModel.tip2')}}。</li>
            <li>- {{$t('Dialog.stakingModel.tip3')}}。</li>
            <li>- {{$t('Dialog.stakingModel.tip4')}}。</li>

          </ul>
        </p>
        <p v-else>
          {{$t('home.Balance')}} : {{balance|Stoformat}}

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
      isdege: true,
      gaseFee: 0,
      dataParameters: {}
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(toaddress, isdege, validatorType) {
      this.$data.Tovalue = toaddress;
      this.$data.isdege = isdege || isdege;
      this.sendModal = true;
      this.$data.validatorType = validatorType;
      if (validatorType == undefined) {
        throw new Error('need validatorType');
      }
      this.stakingParameters();
      this.$data.LAMBvalue = '';
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let from = this.address;
      let to = this.Tovalue;
      try {
        var valuenum = parseFloat(this.LAMBvalue);
        if (isNaN(valuenum) == false) {
          if (valuenum < 1 && this.$data.isdege) {
            this.$Notice.warning({
              title: this.$t('stakinginfo.Pledgeamountlessthan1')
            });
            return;
          }
        }
      } catch (error) {

      }

      let value = this.toBigNumStr(this.LAMBvalue);
      if (to == from) {
        this.$Notice.warning({
          title: this.$t('home.action.not_transfer_LAMB_to_yourself')
        });
        return;
      }
      if (this.$data.isdege) {
        if (this.bigLess0OrGreater(value, this.balance)) {
        // need to alert
          this.$Notice.warning({
            title: this.$t('home.action.check_balance_amount_transfer')
          });
          return;
        }
      } else if (this.bigLess0OrGreater(value, this.$data.shares)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }

      // value = wUtils.numberToBig(value) ;
      // 还需要新的校验地址方法
      // if (Utils.isAddress(to) == false) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title:this.$t('home.action.Check_forwarding_address')
      //   });

      //   return;
      // }

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
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('transferDelegation', {
          to,
          amount,
          gas,
          isdege,
          validatorType: this.$data.validatorType // 验证节点为1
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('transferDelegation', res.data);
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
      return this.$store.getters.getbalanceSto;
    },
    balanceLamb: function() {
      return this.$store.getters.getblance;
    },
    isdegeTxt: function() {
      if (this.$data.isdege) {
        return this.$t('Dialog.stakingModel.title1');
      } else {
        return this.$t('Dialog.stakingModel.title2');
      }
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

.helpul{
   list-style-type:none
}
</style>



