<template>
  <div class="container">
    <Mycard :cardtitle="$t('orderinfo.orderdetails')" class="mt20">
      <div v-if="orderinfo != undefined"  class="s3Operation" slot="operation">
        <Button :disabled="ispayorder(orderinfo.buyAddress)==false" type="primary" @click="openS3">{{$t('orderinfo.orderBucket')}}</Button>
      </div>

      <div v-if="orderinfo != undefined" class="transaction-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.Marketaddress') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{ orderinfo.marketAddress }}
          </Col>
          <Col span="3" class-name="content-wrapper">
            <!-- <Button to="/market" icon="ios-arrow-back">{{ $t('Dialog.com.back') }}</Button> -->
            <router-link to="/market">{{ $t('Dialog.com.back') }}</router-link>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.orderType') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ typeFormat(orderinfo.buyAddress) }}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ this.$t('marketpage.Status') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span style="color:green" v-if="orderinfo.status == '0'">
              {{ $t('marketpage.Active') }}
            </span>
            <span style="color:red" v-if="orderinfo.status == '2'">
              {{ $t('marketpage.Expired') }}
            </span>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.orderid') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a @click="openMatchOrder(orderinfo.orderId)">{{ orderinfo.orderId }}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.Mineraddress') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ orderinfo.askAddress }}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.user') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ orderinfo.buyAddress }}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.space') }}:</span>
          </Col>
          <Col span="8" class-name="content-wrapper">{{ orderinfo.size }}GB</Col>
          <Col span="6" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.unitprice') }}:</span>
          </Col>
          <Col span="6" class-name="content-wrapper">
            {{ orderinfo.price | Lambformat }}
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.userPay') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ amountFormat(orderinfo.userPay) }}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.minerPay') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <span v-if="typeBuyType(orderinfo.buyAddress)">
              {{ amountFormat(orderinfo.minerPay) }}
            </span>
            <span v-else>--</span>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.Startingtime') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ orderinfo.createTime | formatDate }}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.EndTime') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ orderinfo.endTime | formatDate }}

          </Col>

        </Row>
        <Row v-if="ispayorder(orderinfo.buyAddress)" class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            &nbsp;
          </Col>
          <Col  span="20" class-name="content-wrapper">
            <div v-if="blocktime!=''">
              <Alert v-if="timeend>=0" :type='timeend>=30?"success":"warning"'>{{$t('renewal.expirationwarning',[timeend])}}</Alert>
              <Alert v-else type="error">{{$t('renewal.expirationwarning2')}}</Alert>
            </div>
            <Button @click="renewalModal" type="info">{{$t('renewal.Orderrenewal')}}</Button>
          </Col>

        </Row>
        <!-- <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('orderinfo.Storagedevice') }}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{ orderinfo.MatchOrder.machineName }}
          </Col>
        </Row> -->

        <br />
        <br />
      </div>
    </Mycard>

    <s3 ref="s3Modal" :orderid="orderid"></s3>
    <renewalModal ref="renewalModal" :orderid="orderid"/>
  </div>
</template>


<script>
import Mycard from '@/components/common/useful/Mycard.vue';

import Activity from '@/components/txTable/Activity.vue';
import { DAEMON_CONFIG } from '../../../config.js';
import moment from 'moment';

import renewalModal from '@/views/Dialog/renewalModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');
var packagejson = require('../../../../package.json');
const { shell } = require('electron');


export default {
  data() {
    return {
      orderinfo: {},
      orderid: '',
      passwordModal: false,
      walletPassword: '',
      managerkey: {},
      runstorage: packagejson.runstorage,
      blocktime: ''
    };
  },
  components: {
    Mycard,
    Activity,
    s3: () => import('../../components/s3/S3.vue'),
    renewalModal
  },

  mounted() {
    this.orderid = this.$route.params.id;
    this.getblocktime();
    this.getorderinfo(this.orderid);
    console.log('order info');
  },
  methods: {
    openMatchOrder: function(orderId) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/orderDetail/match/${orderId}`;
      shell.openExternal(url);
    },
    async getorderinfo(orderId) {
      let res = await ipc.callMain('marketgetOrderinfo', {
        orderId
      });
      if (res.state) {
        this.$data.orderinfo = res.data.data;
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

    typeFormat(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return this.$t('marketpage.payorder');
      } else {
        return this.$t('marketpage.sellorder');
      }
    },
    ispayorder(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return true;
      } else {
        return false;
      }
    },
    amountFormat(item) {
      if (item == undefined) {
        return;
      }
      return this.bigNumTypeFormat(item.amount, item.denom);
    },
    typeBuyType(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return false;
      } else {
        return true;
      }
    },
    openS3() {
      this.$refs.s3Modal.openDialog();
    },
    renewalModal() {
      this.$refs.renewalModal.open(this.orderid, this.$data.orderinfo);
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
