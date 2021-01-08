<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
          <Row>
            <Col span="12">
            <div>锁仓总量</div>
            <div>
              <span class="numtitle">111</span> lamb
            </div>
            </Col>
            <Col span="12">
            <div> 算力总量 </div>
            <div>
              <span class="numtitle">22</span> TB
            </div>
            </Col>
        </Row>
        <br/><br/>
        <div class="help">
          <div> 挖矿说明 </div>
          <p>1**************
          </p>
          <p>1**************
          </p>
          <p>1**************
          </p>
          <p>最近一次结算时间：
          </p>
        </div>

        </div>
    </div>
</div>
</template>
<script>
export default {

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
