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
          <Input v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('home.Modal1.To')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
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
            <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
            <Col span="20" class-name="value">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} LAMB</Col>
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
const ipc = require("electron-better-ipc");
import eventhub from "../../common/js/event.js";

export default {
    data(){
        return {
            sendModal:false,
            confirmModal:false,
            Tovalue:'',
            LAMBvalue:'',
            isdege:true
        }

    },
    methods: {
     open(toaddress,isdege){
         this.$data.Tovalue = toaddress;
         this.$data.isdege = isdege||isdege;
         this.sendModal = true;

     },
     sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log("-----");
      let from = this.address;
      let to = this.Tovalue;
      let value = parseFloat(this.LAMBvalue);
      if (to == from) {
        this.$Notice.warning({
          title: this.$t("home.action.not_transfer_LAMB_to_yourself")
        });
        return;
      }
      if(this.$data.isdege){
         if (this.this.bigLess0OrGreater(value,this.balance)) {
        // need to alert
            this.$Notice.warning({
              title: this.$t("home.action.check_balance_amount_transfer")
            });
            return;
          }

      }else{
        if (this.this.bigLess0OrGreater(value,this.$data.shares)) {
        // need to alert
            this.$Notice.warning({
              title: this.$t("home.action.check_balance_amount_transfer")
            });
            return;
          }


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
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain("transferDelegation", {
          to,
          amount,
          gas,
          isdege
        });
        // console.log(res);
        if (res.state) {
          this.$data.transactiondata = res.data;
          this.sendcancel();
          this.confirmModal = true;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    confirm() {
      this.confirmModal = false;
      // this.passwordModal = true;
      eventhub.$emit("TxConfirm", this.$data.transactiondata);
    },

    },
 computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getbalance;
    },
    isdegeTxt:function(){
      if(this.$data.isdege){
        return "质押"
      }else{
        return "取消质押"
      }
    }
  }
    
    
    
}
</script>

<style lang="less" scoped>
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>



