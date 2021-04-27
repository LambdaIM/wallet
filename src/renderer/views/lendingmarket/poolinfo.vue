<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
          <Row v-if="defaultmarket">
            <Col span="8">
            <div> {{$t('poolmarketinfo.poolinfo.title1')}} </div>
            <div>
              <span class="numtitle">{{ defaultmarket.supplyPool.amount|BlanceValue}}</span> {{tomLAMB('lamb')}}
            </div>
            </Col>
            <Col span="8">
            <div> {{$t('poolmarketinfo.poolinfo.title2')}} </div>
            <div>
              <span class="numtitle">{{ (defaultmarket.totalPower/1000).toFixed(3)}}</span> TB
            </div>
            </Col>
            <Col span="8">
            <div> {{$t('poolmarketinfo.poolinfo.title3')}} </div>
            <div>

              <span class="numtitle" v-if="Marketstatus==0">  {{$t('poolmarketinfo.poolinfo.tag1')}}  </span>
              <span class="numtitle" v-if="Marketstatus==1"> {{$t('poolmarketinfo.poolinfo.tag2')}} </span>
              <span class="numtitle" v-if="Marketstatus==2"> {{$t('poolmarketinfo.poolinfo.tag3')}} </span>
            </div>
            </Col>


        </Row>
        <br/><br/>
        <!-- <div>
            {{tokenp1}} {{powerp1}}
            </div> -->
        <div class="help" v-if="defaultmarket">
          <div> {{$t('poolmarketinfo.poolinfo.help')}} </div>
          <p>{{$t('poolmarketinfo.poolinfo.help1')}}
          </p>
          <p>{{$t('poolmarketinfo.poolinfo.help2')}}
          </p>
          <p>{{$t('poolmarketinfo.poolinfo.help3')}}
          </p>
          <!-- <p>3:出借lamb的人未提取的收益：{{ defaultmarket.supplierRewardPool.amount|BlanceValue}}lamb
          </p>
          <p>4: 出借算力的人未提取的收益：{{ defaultmarket.minerRewardPool.amount|BlanceValue}}lamb
          </p> -->
        </div>

        </div>
    </div>
</div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      power_ratio: '',
      tokenp1: '',
      powerp1: ''

    };
  },
  mounted() {
    this.getParams();
  },
  computed: {
    defaultmarket: function() {
      console.log('defaultmarket');
      return this.$store.getters.getselectloanmarket;
    },
    Marketstatus: function() {
      // 市场总供应量：X Lamb
      // 市场有效算力：Y GB
      // 市场有效借贷 W = Y * Z  z为power_ratio

      // 总收益：出借人总收益：K * (W / (X + W))
      // 矿工收益为：   K * (X  / (X + W))
      var w = this.bigNum(this.$data.power_ratio).times(this.defaultmarket.totalPower);
      var tokenp1 = w.div(w.plus(this.defaultmarket.supplyPool.amount));
      console.log(tokenp1.toString());
      var powerp1 = this.bigNum(this.defaultmarket.supplyPool.amount).div(w.plus(this.defaultmarket.supplyPool.amount));
      console.log(powerp1);
      this.$data.tokenp1 = tokenp1;
      this.$data.powerp1 = powerp1;
      if (tokenp1.eq(powerp1)) {
        return 0;
      }

      if (tokenp1.gt(powerp1)) {
        return 1;
      } else {
        return 2;
      }
    }

  },
  methods: {
    async getParams() {
      let res = await ipc.callMain('loanmarketsParams', {});
      if (res.state) {
        console.log(res.data.data.power_ratio);
        this.$data.power_ratio = res.data.data.power_ratio;
        // power_ratio
      }
    }
  }

};
</script>
<style lang="less" scoped>
.customer-container {
  .container {
    margin-top: 40px;
  }
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 40px;
  }

  .numtitle{
    font-size: 20px;
    font-weight: 700;

  }
  .help{
    p{
      margin-top: 10px;
    }
  }



}
</style>
