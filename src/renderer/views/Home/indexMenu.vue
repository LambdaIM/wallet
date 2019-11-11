
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <blancebar/>
    <Menu mode="horizontal"  :active-name="activeItem">
        <MenuItem to="/home" name="txlist">
            <Icon type="ios-paper" />
            最新交易列表
        </MenuItem>
        <MenuItem to="/home/coinlist" name="coinlist">
            <Icon type="ios-paper" />
            资产
        </MenuItem>
        <MenuItem to="/home/localtxlist" name="localtxlist">
            <Icon type="ios-paper" />
            本地最新交易记录
        </MenuItem>

    </Menu>
      </div>
      <router-view></router-view>

  </div>
</template>
<script>
import blancebar from './blancebar.vue';



export default {
  data() {
    return {
      activeItem: this.$route.name
    };
  },
  components: {
    blancebar
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
