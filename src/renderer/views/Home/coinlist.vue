
<template>
  <div class="customer-container">
      <div class="tableContainer">
       资产列表
      </div>


  </div>
</template>
<script>
export default {
  data() {
    return {
      activeItem: this.$route.name
    };
  },
  mounted() {

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
    margin-top: 10px;
  }
}
.card-item {
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .item-value {
        font-size: 14px;
      }
}
</style>
