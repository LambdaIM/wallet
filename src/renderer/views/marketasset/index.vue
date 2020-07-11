<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
        <Row>
            <Col span="12"><h3>浏览市场的角色</h3></Col>
            <Col span="12"></Col>
        </Row>
        <br>
        <Row>

          <RadioGroup v-model="roleselect"  size="large">

                 <Poptip word-wrap width="400" trigger="hover" :title="$t('rolepage.roletype.simpleuser')" :content="$t('rolepage.simpleuserbrief')">
                    <Radio label="simple">{{$t('rolepage.roletype.simpleuser')}}</Radio>
                 </Poptip>
                 <Poptip word-wrap width="400" trigger="hover" :title="$t('rolepage.roletype.orderuser')" :content="$t('rolepage.orderuserbrief')">
                    <Radio label="order">{{$t('rolepage.roletype.orderuser')}}</Radio>
                 </Poptip>
                 <Poptip word-wrap width="400" trigger="hover" :title="$t('rolepage.roletype.miner')" :content="$t('rolepage.minerbrief')">
                    <Radio label="miner">{{$t('rolepage.roletype.miner')}}</Radio>
                 </Poptip>
                 <Poptip word-wrap width="400" trigger="hover" :title="$t('rolepage.roletype.validator')" :content="$t('rolepage.validatorbrief')">
                    <Radio label="validator">{{$t('rolepage.roletype.validator')}}</Radio>
                 </Poptip>
                 <Poptip word-wrap width="400" trigger="hover" :title="$t('rolepage.roletype.marketmaker')" :content="$t('rolepage.marketmakerbrief')">
                    <Radio label="marketmaker">{{$t('rolepage.roletype.marketmaker')}}</Radio>
                 </Poptip>

            </RadioGroup>
        </Row>
        <br>
        <Row>
          <Col span="12"><h3>选择市场</h3>

             </Col>
            <Col span="12">

            </Col>
        </Row>
        <br/>
        <Row>
            <Col span="12">
            <div style="margin: 5px;">
              <ul>
                <li>使用lamb购买空间</li>
                <li>挖矿奖励为lamb</li>
                <li>可以创建并运营市场</li>
                <li>可以质押到市场，获取收益</li>
                <li>可以使用s3上传和下载文件</li>

              </ul>
            </div>
            <div style="margin: 5px;">
              <Button to="/market" long>进入lambda 存储市场</Button>


            </div>
             </Col>
            <Col span="12">
            <div style="margin: 5px;">

            <ul>
                <li>使用资产购买空间</li>
                <li>挖矿奖励为市场使用的资产</li>
                <li>可以创建资产和市场</li>
                <li>可以使用s3上传和下载文件</li>
                <li>支持文件交易</li>

              </ul>
            </div>
            <div style="margin: 5px;">
              <Button to="/marketindexmenu" long>进入资产存储市场 </Button>


            </div>
            </Col>
        </Row>
        <br>
        <Row>
          <Col span="12"><h3>挖矿奖励</h3>

             </Col>
            <Col span="12">

            </Col>
        </Row>
        <br/>
        <Row>
          <Col span="12">
           <Tag type="border">10lamb</Tag>
           <Tag type="border">10nnd</Tag>

             </Col>
            <Col span="12">

            </Col>
        </Row>
        <br/>
        <Row>
          <Col span="12">
           <Button>提取挖矿奖励</Button>

             </Col>
            <Col span="12">

            </Col>
        </Row>

        </div>
        <br/>
        <br/>
        <br/>

    </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      roleselect: this.$store.getters.role || 'simple'
    };
  },
  methods: {
    getrole() {
      var role = this.$store.getters.role;
      var reslt = '';
      switch (role) {
        case 'simple': reslt = this.$t('rolepage.roletype.simpleuser'); break;
        case 'order': reslt = this.$t('rolepage.roletype.orderuser'); break;
        case 'miner': reslt = this.$t('rolepage.roletype.miner'); break;
        case 'validator': reslt = this.$t('rolepage.roletype.validator'); break;
        case 'marketmaker': reslt = this.$t('rolepage.roletype.marketmaker'); break;
      }
      return reslt;
    }
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
    margin-top: 40px;
  }
}
</style>
