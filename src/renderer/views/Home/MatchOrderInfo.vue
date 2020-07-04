<template>
<div class="container">
    <Mycard :cardtitle="$t('orderinfo.orderdetails')" class="mt20">
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
                    <span class="title">{{$t('Matchorders.list.AssetName')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.asset|assertdenomformat}}
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
                    <span class="title">{{$t('Matchorders.list.price')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{orderinfo.price|BlanceValue}}
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
                    <span class="title">{{$t('Matchorders.list.Paymentamount')}}:</span>
                </Col>
                <Col span="17" class-name="content-wrapper">
                    {{bigNumTypeFormat(orderinfo.userPay.amount,orderinfo.userPay.denom)}}
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
    <assetrenewalModal  ref="assetrenewalModalPopup" />
</div>

</template>
<script>
import Mycard from '@/components/common/useful/Mycard.vue';
import { DAEMON_CONFIG } from '../../../config.js';
import moment from 'moment';

import assetrenewalModal from '@/views/Dialog/assetrenewalModal.vue';
import eventhub from '../../common/js/event.js';

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
      orderinfo: null,
      blocktime: ''
    };
  },
  mounted() {
    console.log(this.$route.params);
    var orderid = this.$route.params.orderid;

    this.getmatchorderinfo(orderid);
    this.getblocktime();

    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getmatchorderinfo(orderid);
      this.getblocktime();
    });
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
        let res = await ipc.callMain('Authorizematchdamorderinfo', {
          orderId: orderId
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
        return '买单';
      } else {
        return '卖单';
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
