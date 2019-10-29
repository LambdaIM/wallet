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
        <div v-if="this.$store.getters.getaddress==orderinfo.MatchOrder.buyAddress&&runstorage==1">
            <Row  class-name="card-item">
              <Col span="4" class-name="title-wrapper">
                <span class="title">{{$t('orderinfo.operating')}}:</span>
              </Col>
              <Col span="20" class-name="content-wrapper">
                <Button @click="Datacollection" type="primary">{{$t('orderinfo.Viewlambdastorage')}} </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="warning">{{$t('orderinfo.Filelossarbitration')}}</Button>
              </Col>
            </Row>
            <Row class-name="card-item">
              <Col span="5" class-name="title-wrapper">
                <span class="title">{{$t('orderinfo.lambdastorageConsole')}}:</span>
              </Col>
              <Col span="19" class-name="content-wrapper">

                {{$t('orderinfo.Username')}}：{{managerkey['access-key']}}
                {{$t('orderinfo.Password')}}：{{managerkey['secret-key']}}<br/>
                <!-- 访问地址：{{managerkey['address']}}<br/> -->

              </Col>
            </Row>
        </div>
        <br/><br/>



      </div>
    </Mycard>
    <Modal

        v-model="passwordModal"
        :title="$t('Sign.Enter_password')"
        :styles="{top: '200px'}"
      >
        <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button  type="primary" @click="s3authorization">{{$t('Sign.submit')}}</Button>
        </div>
      </Modal>

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
    console.log('***********');
    let id = this.$route.params.id;
    this.getorderinfo(id);
    this.getmanagerkey();
  },
  methods: {
    openMatchOrder: function(orderId) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/orderDetail/match/${orderId}`;
      shell.openExternal(url);
    },
    s3authorization: async function() {
      console.log('s3authorization');
      var result = {};
      try {
        result = await ipc.callMain('s3authorization', {
          password: this.$data.walletPassword
        });
      } catch (ex) {
        console.log(ex);
        this.$Message.error(ex.errormsg);
      }

      console.log(result);
      if (result.state == true) {
        console.log(result.data);
        this.$data.passwordModal = false;
        this.orders3();
      }
    },
    async orders3() {
      try {
        var info = await this.addStorageorder(this.$data.orderinfo);
      } catch (error) {
        console.log(error);
        this.$Message.info({
          content: JSON.stringify(error),
          duration: 10,
          closable: true
        });
      }
    },
    async getmanagerkey() {
      let res = await ipc.callMain('lambdastoragemanagerkey', {});
      if (res.state) {
        this.$data.managerkey = res.data.gateway;
      }
    },
    Datacollection: async function() {
      this.$data.passwordModal = true;
    },
    async  getorderinfo(orderId) {
      let res = await ipc.callMain('marketgetOrderinfo', {
        orderId
      });
      if (res.state) {
        this.$data.orderinfo = res.data.data;
      }
    },
    async  addStorageorder(orderinfo) {
      console.log('addStorageorder');
      var orderId = orderinfo.MatchOrder.orderId;
      var pubKey = orderinfo.pubKey;
      var dhtId = orderinfo.dhtId;

      let res = await ipc.callMain('sets3orderinfo', { orderId, pubKey, dhtId });
      if (res.state) {
        console.log(res.data);
        // this.runStorage()//启动cmd 程序
      } else {
        this.$Message.info({
          content: '失败',
          duration: 10,
          closable: true
        });
      }
    },

    async runStorage() {
      console.log('*********');
      try {
        let res = await ipc.callMain('cmdtest', {

        });
        if (res.state) {
          console.log(res.data);
          this.$Message.info({
            content: JSON.stringify(res.data),
            duration: 10,
            closable: true
          });
        } else {
          this.$Message.info({
            content: '失败',
            duration: 10,
            closable: true
          });
        }
      } catch (error) {
        this.$Message.info({
          content: JSON.stringify(error),
          duration: 10,
          closable: true
        });
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
