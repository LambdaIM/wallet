<template>
  <div>
    <Modal
      loading
      v-model="AssetlModal"
      title="资产兑换"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p style="text-align: center">
        <RadioGroup v-model="exchangesStatus" type="button">
          <Radio label="true">
            <span>LAMB 兑换 STO</span>
          </Radio>
          <Radio label="false">
            <span>STO 兑换 LAMB</span>
          </Radio>
        </RadioGroup>
      </p>
      <br />
      <div v-if="exchangesStatus=='true'">
        <p>
          <Input @keyup.native="AssetLAMBvalueChane" v-model="AssetLAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="AssetSTOvalue" readonly>
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">STO</span>
          </Input>
        </p>
      </div>
      <div v-else>
        <p>
          <Input @keyup.native="AssetSTOvalueChane" v-model="AssetSTOvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">STO</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="AssetLAMBvalue" readonly>
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
        </p>
        <br />
      </div>

      <div slot="footer">
        <Button type="primary" @click="preAssetPledge">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>

     <Modal v-model="assetConfirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2> 资产兑换 </h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          
          <Row v-if="exchangesStatus=='true'" class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{AssetLAMBvalue}} LAMB 兑换  {{AssetSTOvalue}} STO</Col>
          </Row>
          <Row v-else class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{AssetSTOvalue}} STO  兑换 {{AssetLAMBvalue}} LAMB </Col>
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
export default {
  data() {
    return {
      AssetlModal: false,
      assetConfirmModal:false,
      exchangesStatus: "true",
      AssetLAMBvalue: "",
      AssetSTOvalue:'',
      AssetLAMBvalue:''
    };
  },
  methods: {
    open(){
        this.$data.AssetlModal=true;
    },
    AssetLAMBvalueChane() {
      console.log("- -");
      this.$data.AssetSTOvalue = this.$data.AssetLAMBvalue / 1000;
    },
    AssetSTOvalueChane() {
      this.$data.AssetLAMBvalue = this.$data.AssetSTOvalue * 1000;
    },
    sendcancel(){
      this.$data.AssetlModal=false
    },
    preAssetPledge() {
      // this.LAMBvalue=this.$data.DistributionReward;
      // let value = parseFloat(this.LAMBvalue);

      // // if (value <= 0 || value > this.$data.DistributionReward ) {
      // //   // need to alert
      // //   this.$Notice.warning({
      // //     title: this.$t('home.action.check_balance_amount_transfer')
      // //   });
      // //   return;
      // // }

      console.log(this.$data.exchangesStatus);

      this.$data.withdrawalModal = false;
      var AssetLAMBvalue = this.$data.AssetLAMBvalue;
      var sto = this.$data.AssetSTOvalue;

      if (isNaN(sto) || isNaN(AssetLAMBvalue)) {
        this.$Notice.warning({
          title: this.$t("home.action.Check_the_amount")
        });
        return;
      }
      if (this.$data.exchangesStatus == "false") {
        this.transferAsset(AssetLAMBvalue, sto, false);
      } else {
        this.transferAsset(AssetLAMBvalue, sto, true);
      }
    },
    async transferAsset(amount,asset,isdege) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata=null;
      try {
        let res = await ipc.callMain('AssetPledge', {
          asset,
          amount,
          gas,
          isdege
        });
        // console.log(res);
        if (res.state) {
          this.$data.transactiondata=res.data
          this.sendcancel();
          this.assetConfirmModal = true;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    confirm() {
      this.assetConfirmModal = false;
      console.log(this.$data.transactiondata)
      eventhub.$emit('TxConfirm',this.$data.transactiondata);


    },
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance:function(){
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


