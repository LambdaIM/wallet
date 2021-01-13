<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
          <Row v-if="defaultmarket">
            <Col span="12">
            <div>存币总量</div>
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
          <p>1:首先借贷池中双方(出借人和矿工)所有的收益来源于挖矿产出的lamb
          </p>
          <p>2:其次借贷池中矿工借贷的lamb只能用于挖矿，不能用于其他行为
          </p>
          <p>3:出借lamb的和借算力的的人的收益是算法根据当前存款和算力根据一定算法进行分配，关于算法的详细说明见相关文档。
          </p>
          <p>4:出借lamb的人未提取的收益：{{ defaultmarket.supplierRewardPool.amount|BlanceValue}}lamb
          </p>
          <p>5: 出借算力的人未提取的收益：{{ defaultmarket.minerRewardPool.amount|BlanceValue}}lamb
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
