<template>
<div class="container">
    <Mycard cardtitle="订单详情" class="mt20">
      <div  class="transaction-content" slot="card-content">
          <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">交易市场:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            lamb模式交易市场
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">类型:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            买单
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">订单id:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            ffff
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">数量:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            1gb
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">单价:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            1 LAMB/GB/DAY
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">支付金额:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
           1LAMB
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">开始时间:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            2019-10-1
          </Col>
        </Row>
                <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">结束时间:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            2019-10-1
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">地址:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            lambda19zptal4p80w29kqjv4wrwyd4qm2y4u7w9k8nrv
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">状态:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            匹配中
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">状态:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            匹配中
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">操作:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
             <Button type="primary">获取空间管理的token</Button>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="warning">文件丢失申请仲裁</Button>
          </Col>
        </Row>
        <br/><br/><br/><br/><br/><br/><br/><br/>



      </div>
    </Mycard>

</div>
</template>


<script>
import Mycard from '@/components/common/useful/Mycard.vue';

import Activity from '@/components/txTable/Activity.vue';
import txFormat from '@/common/js/txFormat.js';


const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      data: null,
      id: '',
      txType: '',
      loading: false,
      activityData: []
    };
  },
  components: {
    Mycard,
    Activity
  },
  created() {

  },
  // mounted() {

  // },
  methods: {

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
