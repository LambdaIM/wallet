<template>
    <div class="customer-container">
        <div class="tableContainer">
            <h3>借贷存储市场</h3>
            <Menu mode="horizontal"  :active-name="activeItem">
                <MenuItem to="/lendingmarket" name="poolinfo">
                    <Icon type="ios-paper" />
                    市场信息
                </MenuItem>
                <MenuItem to="/lendingmarket/Deposittoken" name="Deposittoken">
                    <Icon type="ios-paper" />
                    存币
                </MenuItem>
                <MenuItem to="/lendingmarket/Depositpower" name="Depositpower">
                    <Icon type="ios-paper" />
                    存算力
                </MenuItem>
                <MenuItem to="/lendingmarket/orderlist" name="orderlist">
                    <Icon type="ios-paper" />
                    订单列表
                </MenuItem>
            </Menu>
        </div>
        <router-view></router-view>


    </div>
</template>
<script>
export default {
  data() {
    return {
      activeItem: ''
    };
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
