<template>
<div class="container">
  <!-- <Breadcrumb>
        <BreadcrumbItem to="/marketindexmenu/matchingOrderslist">{{$t('Matchorders.Matchorders')}}</BreadcrumbItem>

        <BreadcrumbItem>{{$t('orderinfo.orderdetails')}}</BreadcrumbItem>
    </Breadcrumb> -->
    <Mycard :cardtitle="$t('orderinfo.orderdetails')" class="mt20">

      <!-- <div v-if="orderinfo != undefined"  class="s3Operation" slot="operation">
        <Button :disabled="orderRenewalstatus(orderinfo.buyAddress)==false" type="primary" @click="openS3">{{$t('orderinfo.orderBucket')}}</Button>
      </div> -->
        <div class="transaction-content" slot="card-content" v-if="orderinfo">
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.Orderid')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.orderId}}
                </Col>

            </Row>

            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.BuyerAddress')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.buyAddress}}
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.Mineroperationaddress')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.askAddress}}
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.category')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderType(orderinfo.buyAddress)}}

                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.Size')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.size}}GB
                </Col>

            </Row>

            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.Startingtime')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.createTime|blockFormatDate}}
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.Withdrawaltime')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.withDrawTime|blockFormatDate}}
                </Col>

            </Row>

            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">{{$t('Matchorders.list.EndTime')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.endTime|blockFormatDate}}
                </Col>

            </Row>
            <Row class-name="card-item">
                <Col span="4" class-name="title-wrapper">
                    <span class="title">&nbsp;      &nbsp;      </span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                <div v-if="blocktime!=''">
                  <Alert v-if="timeend>=0" :type='timeend>=30?"success":"warning"'>{{$t('renewal.expirationwarning',[timeend])}}</Alert>
                  <Alert v-else type="error">{{$t('renewal.expirationwarning2')}}</Alert>
                </div>
                     <Button v-if="orderRenewalstatus(orderinfo.buyAddress)" @click="openPopup"  type="primary">{{$t('Matchorders.list.Orderrenewal')}}</Button>
                </Col>

            </Row>
        </div>
    </Mycard>
    <br/><br/><br/><br/><br/><br/>
    <s3 ref="s3Modal" :orderid="orderid"></s3>
    <assetrenewalModal  ref="assetrenewalModalPopup" />
</div>

</template>
<script>
import Mycard from '@/components/common/useful/Mycard.vue';
import { DAEMON_CONFIG } from '../../../config.js';
import moment from 'moment';

import assetrenewalModal from '@/views/Dialog/loan/assetrenewalModal.vue';
import eventhub from '../../common/js/event.js';

const { ipcRenderer: ipc } = require('electron-better-ipc');
var packagejson = require('../../../../package.json');
const { shell } = require('electron');

export default {
  components: {
    Mycard,
    assetrenewalModal,
    s3: () => import('../../components/s3/S3.vue')
  },
  data() {
    return {
      orderinfo: null,
      blocktime: '',
      orderid: ''
    };
  },
  mounted() {
    console.log(this.$route.params);
    var orderid = this.$route.params.orderid;
    this.$data.orderid = orderid;

    this.getmatchorderinfo(orderid);
    this.getblocktime();

    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getmatchorderinfo(orderid);
      this.getblocktime();
    });
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    openPopup() {
      var orderid = this.$route.params.orderid;
      var orderinfo = this.$data.orderinfo;

      this.$refs.assetrenewalModalPopup.open(orderid, orderinfo);
    },
    async getmatchorderinfo(orderId) {
      console.log('getmatchorderlist');
      try {
        let res = await ipc.callMain('loanmatch_order_info', {
          order_id: orderId
        });
        if (res.state) {
          var list = res.data.data || [];
          var result = '';

          this.$data.orderinfo = list;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    orderType(buyaddress) {
      var address = this.$store.getters.getaddress;
      if (buyaddress == address) {
        return this.$t('Matchorders.list.buy');
      } else {
        return this.$t('Matchorders.list.sell');
      }
    },
    orderRenewalstatus(buyaddress) {
      var address = this.$store.getters.getaddress;
      if (buyaddress == address) {
        return true;
      } else {
        return false;
      }
    },
    async getblocktime() {
      let res = await ipc.callMain('blocktime', {});
      if (res.state) {
        try {
          this.$data.blocktime = res.data.blockLatest.block.header.time;
        } catch (error) {

        }
      }
    },
    openS3() {
      this.$refs.s3Modal.openDialog();
    }
  },
  computed: {
    timeend() {
      var createTime = moment(this.$data.blocktime);
      var endTime = moment(this.$data.orderinfo.endTime);
      var duration = moment.duration(endTime.diff(createTime));
      //  var duration = createTime.diff(endTime)

      return duration.asDays().toFixed(2);
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
