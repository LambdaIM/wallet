<template>
    <div class="customer-container">
        <div class="tableContainer">

        <h3>资产-数据存储市场</h3>
    <Menu mode="horizontal"  :active-name="activeItem">
        <MenuItem to="/marketindexmenu/" name="assetlist">
            <Icon type="ios-paper" />
            资产列表
        </MenuItem>
        <MenuItem to="/marketindexmenu/marketlist" name="marketlist">
            <Icon type="ios-people" />
            授权市场列表
        </MenuItem>

        <MenuItem to="/marketindexmenu/redeemlist" name="redeemlist">
            <Icon type="ios-construct" />
            赎回中的资产
        </MenuItem>
        <MenuItem to="/marketindexmenu/matchingOrderslist" name="matchingOrderslist">
            <Icon type="ios-construct" />
            匹配订单
        </MenuItem>
        <MenuItem to="/marketindexmenu/filelist" name="filelist">
            <Icon type="ios-construct" />
            接受的文件
        </MenuItem>

        <MenuItem to="/marketindexmenu/mininghelp" name="mininghelp">
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
