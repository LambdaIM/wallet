<template>
  <div class="table-container">
    <div class="table-wrapper">
      <div class="table-head-container">
        <Row class-name="table-head-wrapper">
          <Col span="8" class-name="table-head-title-wrapper">
            <div class="table-head-title">
              <span class="title">{{title}}</span>
            </div>
          </Col>

          <Col span="16" class="operation-wrapper">
            <slot name="operation"></slot>
          </Col>
        </Row>
      </div>

      <div class="table-content-container">
        <div class="table-content-wrapper">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  }
};
</script>

<style lang="less" scoped>
.table-container{
  width: 100%;
  .table-wrapper{
    width: 96%;
    margin: 0 auto;
    .table-head-container{
      width: 100%;
      .title{
        font-size: 18px;
      }
      margin-bottom: 10px;
    }
    .table-content-container{
      width: 100%;
    }
  }
}
</style>
