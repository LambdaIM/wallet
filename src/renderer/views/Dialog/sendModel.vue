<template>
<div>
  <Modal
    loading
    v-model="sendModal"
    :title="denomtitleShow"
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
      <Input v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
        <span slot="prepend">{{$t('home.Modal1.To')}}</span>
      </Input>
    </p>
    <br />
    <p>
      <Input v-model="LAMBvalue">
        <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
        <span slot="append">{{denomShow}}</span>
      </Input>
    </p>
    <div slot="footer">
      <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
    </div>
  </Modal>
  <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>{{$t('home.Modal1.Transfer')}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row  class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
            <Col span="20" class-name="value">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} {{denomShow}}</Col>
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
import eventhub from "../../common/js/event.js";
const ipc = require("electron-better-ipc");
import isaddress from "../../../utils/isaddress"

export default {
  props: {

  },
  data() {
    return {
      sendModal: false,
      confirmModal:false,
      denom:'lamb',
      LAMBvalue: "",
      to:"",
      Tovalue:'',
      denomBlance:''
    };
  },
  methods: {
    preSendLAMB() {
      let from = this.address;
      let to = this.Tovalue;
      let value = this.LAMBvalue;
      if (to == from) {
        this.$Notice.warning({
          title: this.$t("home.action.not_transfer_LAMB_to_yourself")
        });
        return;
      }
      if (this.bigLess0OrGreater(value,this.$data.denomBlance) ) {
        // need to alert
        this.$Notice.warning({
          title: this.$t("home.action.check_balance_amount_transfer")
        });
        return;
      }
      // value = wUtils.numberToBig(value) ;
      // 还需要新的校验地址方法
      if (isaddress(to) == false) {
        // need to alert
        this.$Notice.warning({
          title:this.$t('home.action.Check_forwarding_address')
        });

        return;
      }

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t("home.action.Check_the_amount")
        });
        return;
      }
      this.transfer(value);
    },
    async transfer(amount) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      let denom =this.$data.denom;
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain("transfer", {
          to,
          amount,
          gas,
          denom
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.confirmModal=true;
          this.$data.transactiondata  = res.data;
          //触发事件活着回掉函数
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    confirm() {
      this.confirmModal = false;
      console.log(this.$data.transactiondata)
      eventhub.$emit('TxConfirm',this.$data.transactiondata);


    },
    sendcancel() {
      this.sendModal = false;
      // this.confirmModal=true;
    },
    open(amountBlance,coinType){
      this.$data.denomBlance=amountBlance||this.balance
      this.$data.denom=coinType||'lamb'
      this.sendModal =true;
      this.confirmModal=false;
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance:function(){
      return this.$store.getters.getblance;
    },
    denomShow:function(){
      return this.$data.denom.toUpperCase()
    },
    denomtitleShow:function(){
      return this.$t('home.Modal1.Send_LAMB',[this.$data.denom.toUpperCase()])
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

