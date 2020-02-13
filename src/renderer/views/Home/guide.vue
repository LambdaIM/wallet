<template>
<div class="customer-container">
    <div class="tableContainer">


    <Row>
        <Col span="7">
         <Steps :current="current" direction="vertical">
            <Step title="获取TBB" content="钱包"></Step>
            <Step title="质押挖矿" content="钱包"></Step>
            <Step title="创建挖矿子账户并导出" content="钱包"></Step>
            <Step title="添加矿工服务器并初始化矿工服务" content="矿工管理程序"></Step>
            <Step title="配置矿工服务并启动" content="矿工管理程序"></Step>
            <Step title="初始化矿工" content="钱包"></Step>

            <Step title="添加存储节点服务器并初始化" content="矿工管理程序"></Step>
            <Step title="配置存储节点服务并启动" content="矿工管理程序"></Step>
            <Step title="出售空间" content="钱包"></Step>
        </Steps>
        </Col>
        <Col span="17">
            <div style="    text-align: center;">
                <Button :disabled="previousdisable" @click="previous" type="primary" >上一步</Button>

                <Button :disabled="nextdisable" type="primary" @click="next">下一步</Button>
            </div>
            <br><br>
            <router-view></router-view>
        </Col>
    </Row>

    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      current: 0,
      previousdisable: true,
      nextdisable: false
    };
  },
  mounted() {
    console.log('guide');
    console.log(this.$router);
    var pagename = this.$route.meta.path;
    switch (pagename) {
      case 'guide':break;
      case 'pledge':this.current = 1; break;
      case 'subaccount':this.current = 2; break;
      case 'miningmanagement':this.current = 3; break;
      case 'configminer':this.current = 4; break;
      case 'initializeminer':this.current = 5; break;

      case 'addstorage':this.current = 6; break;
      case 'configstorage':this.current = 7; break;
      case 'sellingspace':this.current = 8; break;
    }
    this.btndisable();
  },
  methods: {
    next () {
      if (this.current == 8) {
        // this.current = 0;
        return;
      } else {
        this.current += 1;
      }
      console.log('***next***');

      this.pageroute();
      this.btndisable();
    },
    previous() {
      if (this.current == 0) {
        // this.current = 8;
        return;
      } else {
        this.current -= 1;
      }

      this.pageroute();
      this.btndisable();
    },
    pageroute() {
      switch (this.current) {
        case 0: this.$router.push('/home/guide'); break;
        case 1: this.$router.push('/home/guide/pledge'); break;
        case 2: this.$router.push('/home/guide/subaccount'); break;
        case 3: this.$router.push('/home/guide/miningmanagement'); break;
        case 4: this.$router.push('/home/guide/configminer'); break;
        case 5: this.$router.push('/home/guide/initializeminer'); break;

        case 6: this.$router.push('/home/guide/addstorage'); break;
        case 7: this.$router.push('/home/guide/configstorage'); break;
        case 8: this.$router.push('/home/guide/sellingspace'); break;
      }
    },
    btndisable() {
      if (this.current == 0) {
        this.$data.previousdisable = true;
        return;
      } else {
        this.$data.nextdisable = false;
      }

      if (this.current == 8) {
        this.$data.nextdisable = true;
      } else {
        this.$data.previousdisable = false;
      }
    }
  }
};

</script>

<style lang="less" scoped>
.customer-container {
  padding-bottom: 100px;
  .container {
    margin-top: 40px;
  }
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 10px;
  }
}


</style>
