<template>
<div class="container">
    <Mycard :cardtitle="$t('orderinfo.orderdetails')" class="mt20">
      <div v-if="orderinfo.MatchOrder!=undefined" class="transaction-content" slot="card-content">
          <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.Marketaddress')}}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{orderinfo.MatchOrder.marketAddress}}
          </Col>
          <Col span="3" class-name="content-wrapper">

            <Button to="/market"  icon="ios-arrow-back" type="primary">{{$t('Dialog.com.back')}}</Button>

          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.orderType')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{typeFormat(orderinfo.MatchOrder.buyAddress)}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{this.$t('marketpage.Status')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
          <span style="color:green" v-if="orderinfo.MatchOrder.status=='0'">
              {{$t('marketpage.Active')}}
          </span>
          <span style="color:red" v-if="orderinfo.MatchOrder.status=='2'">
              {{$t('marketpage.Expired')}}
          </span>

          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.orderid')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
           <a @click="openMatchOrder(orderinfo.MatchOrder.orderId)"> {{orderinfo.MatchOrder.orderId}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.Mineraddress')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.askAddress}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.user')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.buyAddress}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.space')}}:</span>
          </Col>
          <Col span="8" class-name="content-wrapper">
            {{orderinfo.MatchOrder.size}}GB
          </Col>
          <Col span="6" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.unitprice')}}:</span>
          </Col>
          <Col span="6" class-name="content-wrapper">
            {{orderinfo.MatchOrder.price|Lambformat}}
          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.userPay')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">

           {{amountFormat(orderinfo.MatchOrder.userPay)}}

          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.minerPay')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
           <span v-if="typeBuyType(orderinfo.MatchOrder.buyAddress)">
           {{amountFormat(orderinfo.MatchOrder.minerPay)}}
          </span>
          <span v-else>--</span>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.Startingtime')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.createTime|formatDate}}
          </Col>
        </Row>
                <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.EndTime')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.endTime|formatDate}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.Storagedevice')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.machineName}}
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
import { DAEMON_CONFIG } from '../../../config.js';


const { ipcRenderer: ipc } = require('electron-better-ipc');
var packagejson = require('../../../../package.json');
const { shell } = require('electron');


export default {
  data() {
    return {
      orderinfo: {},
      passwordModal: false,
      walletPassword: '',
      managerkey: {},
      runstorage: packagejson.runstorage
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
    openMatchOrder: function(orderId) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/orderDetail/match/${orderId}`;
      shell.openExternal(url);
    },
    async  getorderinfo(orderId) {
      let res = await ipc.callMain('marketgetOrderinfo', {
        orderId
      });
      if (res.state) {
        this.$data.orderinfo = res.data.data;
      }
    },

    typeFormat(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return this.$t('marketpage.payorder');
      } else {
        return this.$t('marketpage.sellorder');
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
    }

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
