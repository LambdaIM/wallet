<template>
<div>
      <Row>
        <Col span="12">
        <h4>1通过lamb 兑换TBB</h4>
        <br/><br/>
        <Button  @click="openAssert" type="primary" >兑换TBB</Button>


        </Col>
        <Col span="12">
        <h4>2通过交易所 购买TBB</h4>
        <br/><br/>
        <span>
            可以到康柏交易所购买TBB,康柏交易所 https://kangbo.io/
        </span>

        </Col>
    </Row>
    <AssetlModalDialog ref="AssetDialog" />
</div>
</template>
<script>
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
export default {
  methods: {
    openAssert() {
      this.$refs.AssetDialog.open(0, 'ulamb');
    }
  },
  components: {
    AssetlModalDialog
  }

};
</script>
<style lang="less" scoped>

</style>
