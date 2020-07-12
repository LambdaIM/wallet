<template>
    <div class="customer-container">
        <div class="tableContainer">

        <h3>{{$t('assetsotherpage.assetTitle')}}</h3>
    <Menu mode="horizontal"  :active-name="activeItem">
        <MenuItem to="/marketindexmenu/" name="assetlist">
            {{$t('assetpage.assets')}}
        </MenuItem>
        <MenuItem to="/marketindexmenu/marketlist" name="marketlist">

            {{$t('assetpage.authorizedMarket')}}
        </MenuItem>

        <MenuItem v-if="$role('conlist.redeem')" to="/marketindexmenu/redeemlist" name="redeemlist">
           {{$t('assetpage.assetsinredemption')}}
        </MenuItem>
        <MenuItem  v-if="$role('conlist.Buyingspace')" to="/marketindexmenu/matchingOrderslist" name="matchingOrderslist">
            {{$t('Matchorders.Matchorders')}}
        </MenuItem>
        <MenuItem to="/marketindexmenu/filelist" name="filelist">

            {{$t('assetsotherpage.documentsaccepted')}}
        </MenuItem>

        <MenuItem to="/marketindexmenu/mininghelp" name="mininghelp">

            {{$t('assetpage.miningdescription')}}
        </MenuItem>
        <MenuItem to="/marketindexmenu/lambdas3" name="lambdas3">

             S3
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
