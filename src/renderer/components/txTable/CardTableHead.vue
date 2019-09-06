<template>
  <div class="head">

    <Row className="cardTable__header cardTable__header-media">
      <Card class="cardTable__header-card">
        <Col :md="24" :lg="13">活动</Col>
        <Col :md="8" :lg="3">时间</Col>
        <Col :md="8" :lg="2">高度</Col>
        <Col :md="8" :lg="3">费用</Col>
        <Col  :md="24" :lg="3">交易哈希</Col>
      </Card>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    tableTitle: {
      type: String
    }
  }
};
</script>

<style lang="less" scoped>
.head{
  @media screen and (max-width:1200px){
    display:none;

  }
}
.cardTable__title {
  font-size: 25px;
  color: #252631;
  margin-bottom: 20px;
}
.cardTable__header {
  font-size: 16px;
  margin-bottom: 20px;
  .cardTable__header-card {
    width: 100%;
    display: inline-block;
    padding: 10px;
  }
}
</style>
