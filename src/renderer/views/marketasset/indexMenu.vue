<template>
    <div class="customer-container">
        <div class="tableContainer">

        <h3>资产-数据存储市场</h3>
    <Menu mode="horizontal"  active-name="1">
        <MenuItem to="/marketindexmenu/" name="1">
            <Icon type="ios-paper" />
            资产列表
        </MenuItem>
        <MenuItem to="/marketindexmenu/marketlist" name="2">
            <Icon type="ios-people" />
            授权市场列表
        </MenuItem>

        <MenuItem to="/marketindexmenu/redeemlist" name="4">
            <Icon type="ios-construct" />
            赎回中的资产
        </MenuItem>
        <MenuItem to="/marketindexmenu/matchingOrderslist" name="5">
            <Icon type="ios-construct" />
            匹配订单
        </MenuItem>
        <MenuItem to="/marketindexmenu/filelist" name="6">
            <Icon type="ios-construct" />
            接受/发送的文件
        </MenuItem>

        <MenuItem to="/marketindexmenu/mininghelp" name="7">
            <Icon type="ios-construct" />
            挖矿说明
        </MenuItem>

    </Menu>
    <router-view></router-view>
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
