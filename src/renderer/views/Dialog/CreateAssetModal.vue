<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        title="创建资产"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form  @keydown.native.enter.prevent ="preSendLAMB" >
        <p>
          <Input v-model="name" >
            <span slot="prepend">资产名称</span>
          </Input>
        </p>
        <br />
        <p>
          <Input  v-model="asset" >
            <span slot="prepend">初始发行量</span>
          </Input>
        </p>
        <br />
        <p>
          增发类型
          <RadioGroup v-model="MintType">
            <Radio label="1">不可增发</Radio>
            <Radio label="2">一次性增发</Radio>
            <Radio label="3">挖矿增发</Radio>
        </RadioGroup>
        </p>
        <br />
        <div v-if="MintType=='3'">
            <br />
            <p >
              <Input  v-model="total_supply" >
                <span slot="prepend">发行总量</span>
              </Input>
            </p>
            <br />
            <p >
              <Input  v-model="inflation" >
                <span slot="prepend">每块高增发量</span>
              </Input>
            </p>
            <br />
            <p >
              <Input  v-model="adjust_rate" >
                <span slot="prepend">减产系数</span>
              </Input>
            </p>
            <br />
            <p >
              <Input  v-model="max_adjust_count" >
                <span slot="prepend">最大减产次数</span>
              </Input>
              <br />
            </p>
            <br />
            <p >
              <Input  v-model="adjust_period" >
                <span slot="prepend">减产周期</span>
              </Input>
              <br />
            </p>
            <p >
              <Input  v-model="genesis_height" >
                <span slot="prepend">初次增发块高</span>
              </Input>
              <br />
            </p>
        </div>

        <p>
          创建资产需要{{parameter.create_market_cost|BlanceValue}}LAMB
        <p/>

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

import BigNumber from 'bignumber.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      sendModal: false,
      confirmModal: false,
      name: '',
      asset: '',
      MintType: '1',
      inflation: '',
      inflation_period: '',
      parameter: {},
      total_supply: '',
      adjust_rate: '',
      max_adjust_count: '',
      genesis_height: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open() {
      this.sendModal = true;

      this.getparameter();
    },
    sendcancel() {
      this.sendModal = false;
    },
    preSendLAMB() {
      console.log('-----');
      let name = this.name;
      let asset = parseInt(this.asset);
      let MintType = parseInt(this.MintType);
      let inflation = parseInt(this.inflation);


      let total_supply = parseInt(this.total_supply);

      let adjust_rate = parseFloat(this.adjust_rate);

      let max_adjust_count = parseInt(this.max_adjust_count);

      let genesis_height = parseInt(this.genesis_height);

      let adjust_period = parseInt(this.adjust_period);

      if (name == '') {
        this.$Notice.warning({
          title: '资产名称不能为空'
        });
        return;
      }


      if (isNaN(asset) || asset <= 0) {
        this.$Notice.warning({
          title: '初始化发行量需要为数值'
        });
        return;
      }
      if (MintType == '3') {
        if (isNaN(inflation) || inflation <= 0) {
          this.$Notice.warning({
            title: '每块高增发量需要为数值'
          });
          return;
        }

        if (isNaN(total_supply) || total_supply <= 0) {
          this.$Notice.warning({
            title: '发行总量需要为数值'
          });
          return;
        }

        if (isNaN(adjust_rate) || adjust_rate >= 1) {
          this.$Notice.warning({
            title: '减产系数需要为小数'
          });
          return;
        }

        if (isNaN(max_adjust_count) || max_adjust_count <= 0) {
          this.$Notice.warning({
            title: '最大减产次数需要为数值'
          });
          return;
        }

        if (isNaN(adjust_period) || adjust_period <= 0) {
          this.$Notice.warning({
            title: '减产周期需要为数值'
          });
          return;
        }

        if (isNaN(genesis_height) || genesis_height <= 0) {
          this.$Notice.warning({
            title: '初次增发块高需要为数值'
          });
          return;
        }
      }



      if (this.bigLess0OrGreater(1e5, this.balance)) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
      }


      name = 'u' + name;
      var reg = new RegExp(/^[a-zA-Z0-9]{3,16}$/);
      if (!reg.test(name)) {
        this.$Notice.warning({
          title: '资产符号长度2-15个字符'
        });
        return;
      }



      var adjust_rate_Big = new BigNumber(adjust_rate || 0.1);
      adjust_rate = adjust_rate_Big.toPrecision(18);


      this.transfer({
        name,
        asset,
        MintType,
        inflation,
        total_supply,
        adjust_rate,
        max_adjust_count,
        genesis_height,
        adjust_period
      });
    },
    async transfer(objpra) {
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain('CreateAsset', {
          asset_amount: this.toBigNumStr(objpra.asset),
          asset_denom: objpra.name,
          name: objpra.name,
          mint_type: objpra.MintType,
          inflation: this.toBigNumStr(objpra.inflation || 0),
          total_supply: this.toBigNumStr(objpra.total_supply || 0),
          adjust_rate: String(objpra.adjust_rate || ''),
          max_adjust_count: String(objpra.max_adjust_count || 0),
          genesis_height: String(objpra.genesis_height || 0),
          adjust_period: String(objpra.adjust_period || 0)
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          this.$refs.ConfirmModal.open('CreateAsset', res.data);

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
    async getparameter() {
      console.log('getparameter');
      let res = await ipc.callMain('Assetparameters', {

      });
      if (res.state) {
        this.$data.parameter = res.data.data;
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
