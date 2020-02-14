<template>
<div>
      <Row>
        <Col span="12">
        <h4>1通过lamb 兑换TBB</h4>
        <br/><br/>
        <Button  @click="openAssert" type="primary" >兑换TBB</Button>
        <br/><br/>


        </Col>
        <Col span="12">
        <h4>2通过交易所 购买TBB</h4>
        <br/><br/>
        <span>
            可以到康波交易所购买TBB<br/>
            康波交易所 <a @click="openweb('https://kangbo.io/')">https://kangbo.io/ </a>
        </span>

        </Col>
    </Row>
    <Row>
      <Col span="12">
        <h4>3 测试网进行挖矿需要先获取测试币</h4>
        <br/><br/>
        <span>
          获取测试币地址 <a @click="openweb('http://faucet.lambda.im/')">http://faucet.lambda.im/</a>
        </span>

        </Col>
    </Row>
    <AssetlModalDialog ref="AssetDialog" />
</div>
</template>
<script>
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
const { shell } = require('electron');

export default {
  methods: {
    openAssert() {
      this.$refs.AssetDialog.open(0, 'ulamb');
    },
    openweb(url) {
      shell.openExternal(url);
    }
  },
  components: {
    AssetlModalDialog
  }

};
</script>
<style lang="less" scoped>

</style>
