<template>
  <div>
    <Modal
      loading
      v-model="AssetlModal"
      :title="$t('Dialog.com.AssetConversion')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
    <Form  @keydown.native.enter.prevent ="preAssetPledge" >
      <p style="text-align: center">
        <RadioGroup v-model="exchangesStatus" type="button">
          <Radio label="true">
            <span>{{coinTypeShow}} {{$t('Dialog.com.to')}} TBB</span>
          </Radio>
          <Radio v-if="coinType!='ulambs'" label="false">
            <span>TBB {{$t('Dialog.com.to')}} {{coinTypeShow}}</span>
          </Radio>
        </RadioGroup>
      </p>
      <br />
      <div v-if="exchangesStatus=='true'">
        <p>
          <Input @keyup.native="AssetLAMBvalueChane" v-model="AssetLAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{coinTypeShow}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="AssetSTOvalue" readonly>
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">TBB</span>
          </Input>
        </p>
        <br />
        <p>
          {{$t('somemodel.assertTbbTip')}}
        </p>
      </div>
      <div v-else>
        <p>
          <Input @keyup.native="AssetSTOvalueChane" v-model="AssetSTOvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">TBB</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="AssetLAMBvalue" readonly>
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{coinTypeShow}}</span>
          </Input>
        </p>
        <br />
        <p>
          {{$t('somemodel.assertTbbTip')}}
        </p>
      </div>
      </Form>

      <div slot="footer">
        <Button type="primary" @click="preAssetPledge">{{$t('home.Modal1.Submit')}}</Button>
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
      AssetlModal: false,
      assetConfirmModal: false,
      exchangesStatus: 'true',
      AssetLAMBvalue: '',
      AssetSTOvalue: '',
      amountBlance: 0,
      coinType: 'ulamb',
      gaseFee: 0
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(amountBlance, coinType) {
      this.$data.AssetlModal = true;
      this.$data.amountBlance = amountBlance || this.balance;
      this.$data.coinType = coinType || 'ulamb';
      this.$data.exchangesStatus = 'true';
    },
    AssetLAMBvalueChane() {
      console.log('- -');
      this.$data.AssetSTOvalue = this.bigNum(this.$data.AssetLAMBvalue).div(3000).toNumber();
    },
    AssetSTOvalueChane() {
      this.$data.AssetLAMBvalue = this.bigNum(this.$data.AssetSTOvalue).times(3000).toNumber();
    },
    sendcancel() {
      this.$data.AssetlModal = false;
    },
    preAssetPledge() {
      // this.LAMBvalue=this.$data.DistributionReward;
      // let value = parseFloat(this.LAMBvalue);



      console.log(this.$data.exchangesStatus);

      this.$data.withdrawalModal = false;
      var AssetLAMBvalue = this.toBigNumStr(this.$data.AssetLAMBvalue);
      var sto = this.toBigNumStr(this.$data.AssetSTOvalue);

      if (isNaN(sto) || isNaN(AssetLAMBvalue)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      if (Math.floor(this.$data.AssetSTOvalue).toString() !== this.$data.AssetSTOvalue.toString()) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }

      if (this.$data.exchangesStatus == 'true') {
        if (this.bigLess0OrGreater(AssetLAMBvalue, this.$data.amountBlance)) {
          this.$Notice.warning({
            title: this.$t('home.action.check_balance_amount_transfer')
          });
          return;
        }
      } else if (this.bigLess0OrGreater(sto, this.balanceSto)) {
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }


      if (this.$data.exchangesStatus == 'false') {
        this.transferAsset(AssetLAMBvalue, sto, false);
      } else {
        this.transferAsset(AssetLAMBvalue, sto, true);
      }
    },
    async transferAsset(amount, asset, isdege) {
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain('AssetPledge', {
          asset,
          amount,
          gas,
          isdege,
          denom: this.$data.coinType
        });
        // console.log(res);
        if (res.state) {
          console.log(res);
          this.sendcancel();
          this.$refs.ConfirmModal.open('AssetPledge', res.data);

          // let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
          // if (gasres.state) {
          //   this.$data.gaseFee = gasres.data;
          //   this.$data.transactiondata = res.data;
          //   this.sendcancel();
          //   this.assetConfirmModal = true;
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
    coinTypeShow() {
      return this.tomLAMB(this.$data.coinType.substr(1).toUpperCase());
    },
    balanceSto: function() {
      return this.$store.getters.getbalanceSto;
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


