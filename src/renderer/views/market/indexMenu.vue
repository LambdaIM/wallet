
<template>
  <div class="customer-container">
      <div class="tableContainer">
           <Menu mode="horizontal"  :active-name="activeItem">
        <MenuItem to="/market" name="myorderlist">
            <Icon type="ios-paper" />
            {{$t('marketpage.orderlist')}}
        </MenuItem>
        <MenuItem to="/market/buyspace" name="buyspace">
            <Icon type="ios-pricetag" />
            {{$t('marketpage.buyingspace')}}
        </MenuItem>
        <MenuItem to="/market/mysellorder" name="mysellorderlist">
            <Icon type="md-pricetags" />
            {{$t('marketpage.sellspace')}}
        </MenuItem>
        <MenuItem to="/market/lambdas3" name="lambdas3">
            <Icon type="ios-construct" />
            Lambda S3
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
