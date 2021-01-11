<template>
<div>
    <div class="customer-container">
      {{defaultmarket}}
      <div class="tableContainer">
          <Row v-if="defaultmarket">
            <Col span="12">
            <div>出借总量</div>
            <div>
              <span class="numtitle">{{ defaultmarket.supplyPool.amount|BlanceValue}}</span> lamb
            </div>
            </Col>
            <Col span="12">
            <div> 算力总量 </div>
            <div>
              <span class="numtitle">{{ (defaultmarket.totalPower/1000).toFixed(3)}}</span> TB
            </div>
            </Col>

        </Row>
        <br/><br/>
        <div class="help" v-if="defaultmarket">
          <div> 挖矿说明 </div>
          <p>1**************
          </p>
          <p>2**************
          </p>
          <p>3 出借lamb的人未提取的收益：{{ defaultmarket.supplierRewardPool.amount|BlanceValue}}lamb
          </p>
          <p>4 出借算力的人未提取的收益：{{ defaultmarket.minerRewardPool.amount|BlanceValue}}lamb
          </p>
        </div>

        </div>
    </div>
</div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  computed: {
    defaultmarket: function() {
      console.log('defaultmarket');
      return this.$store.getters.getselectloanmarket;
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
