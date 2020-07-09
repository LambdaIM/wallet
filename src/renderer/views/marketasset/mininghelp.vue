<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
        <ul style="margin-left: 10px;">
                <li>{{$t('assetpage.Mininginstructions.tip1')}}</li>
                <li>{{$t('assetpage.Mininginstructions.tip2')}}</li>
              </ul>
        </div>
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
    // width: 94%;
    margin: 0 auto;
    margin-top: 40px;
  }
}
</style>
