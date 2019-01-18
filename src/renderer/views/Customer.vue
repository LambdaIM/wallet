<template>
  <div class="customer-container">
    <Header />
    <div class="table-head-container">
      <div class="table-head-wrapper">
        <p class="title">Customer(Order)</p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
export default {
components:{
  Header
}
}
</script>

<style lang="less" scoped>
.customer-container{
  .table-head-container{
    margin-top: 20px;
    width: 100%;
    height: 30px;
    .table-head-wrapper{
      width: 96%;
      margin: 0 auto;
      height: 100%;
      .title{
        font-size: 18px;
      }
    }
  }
}
</style>
