<template>
<div class="container">
    <Mycard cardtitle="订单详情" class="mt20">
      <div  class="transaction-content" slot="card-content">
          <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">交易市场地址:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.marketAddress}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">类型:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{typeFormat(orderinfo.buyAddress)}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">订单id:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.orderId}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">空间:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.size}}GB
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">单价:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.price}} LAMB/GB/DAY
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">支付金额:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
           {{amountFormat(orderinfo.userPay)}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">矿工押金:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
           {{amountFormat(orderinfo.minerPay)}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">开始时间:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.createTime}}
          </Col>
        </Row>
                <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">结束时间:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.endTime}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">设备名称:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.machineName}}
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">操作:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
             <Button @click="gets3token" type="primary">获取空间管理的token</Button>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="warning">文件丢失申请仲裁</Button>
          </Col>
        </Row>
        <br/><br/>



      </div>
    </Mycard>

</div>
</template>


<script>
import Mycard from '@/components/common/useful/Mycard.vue';

import Activity from '@/components/txTable/Activity.vue';



const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      orderinfo: {}
    };
  },
  components: {
    Mycard,
    Activity
  },

  mounted() {
    let id = this.$route.params.id;
    this.getorderinfo(id);
  },
  methods: {
    async  getorderinfo(orderId) {
      let res = await ipc.callMain('marketgetOrderinfo', {
        orderId
      });
      if (res.state) {
        this.$data.orderinfo = res.data.data;
      }
    },
    async gets3token() {
      console.log('*********');
    },
    typeFormat(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return '买单';
      } else {
        return '卖单';
      }
    },
    amountFormat(item) {
      if (item == undefined) {
        return;
      }
      return this.bigNumTypeFormat(item.amount, item.denom);
    }
    // marketgetOrderinfo

  },
  computed: {

  }
};
</script>


<style lang="less" scoped>
.container {
  position: relative;
  .transaction-content {
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
  }
}
</style>
