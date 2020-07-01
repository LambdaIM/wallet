<template>
<div class="container">
    <Mycard :cardtitle="$t('orderinfo.orderdetails')" class="mt20">
        <div class="transaction-content" slot="card-content">
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">订单id:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">资产名称:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">购买人地址:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">空间大小:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">价格:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">开始时间:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">提取收益时间:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">用户复制金额:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">结束时间:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    xxxxx
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">&nbsp;      &nbsp;      </span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                     <Button @click="openPopup"  type="primary">订单续期</Button>
                </Col>

            </Row>
        </div>
    </Mycard>
    <br/><br/><br/><br/><br/><br/>
    <assetrenewalModal  ref="assetrenewalModalPopup" />
</div>

</template>
<script>
import Mycard from '@/components/common/useful/Mycard.vue';
import { DAEMON_CONFIG } from '../../../config.js';
import moment from 'moment';

import assetrenewalModal from '@/views/Dialog/assetrenewalModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');
var packagejson = require('../../../../package.json');
const { shell } = require('electron');

export default {
  components: {
    Mycard,
    assetrenewalModal
  },
  data() {
    return {
      orderinfo: {

      }
    };
  },
  mounted() {
    this.getmatchorderinfo();
  },
  methods: {
    openPopup() {
      var orderid = 'xxx'; var orderinfo = {};
      this.$refs.assetrenewalModalPopup.open(orderid, orderinfo);
    },
    async getmatchorderinfo() {
      console.log('getmatchorderlist');
      try {
        let res = await ipc.callMain('Authorizematchdamorderinfo', {});
        if (res.state) {
          var list = res.data || [];
          var result = '';
          // list.forEach(item => {
          //   if (item.denom == 'ulamb') {
          //     result = item.amount;
          //   }
          // });
          this.$data.orderinfo = list;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    }
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
