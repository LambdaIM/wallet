
<template>
  <div class="customer-container">
      <div class="tableContainer">
           <Menu mode="horizontal"  active-name="1">
        <MenuItem to="/market" name="1">
            <Icon type="ios-paper" />
            我的订单
        </MenuItem>
        <MenuItem to="/market/buyspace" name="2">
            <Icon type="ios-people" />
            购买空间
        </MenuItem>
        <MenuItem to="/market/mysellorder" name="4">
            <Icon type="ios-construct" />
            我的卖单
        </MenuItem>
        <MenuItem to="/market/lambdas3" name="5">
            <Icon type="ios-construct" />
            LambdaS3
        </MenuItem>
    </Menu>
      </div>
      <router-view></router-view>

  </div>
</template>
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
