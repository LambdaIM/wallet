<template>
<div class="container">
    <Mycard :cardtitle="$t('orderinfo.orderdetails')" class="mt20">
      <div v-if="orderinfo.MatchOrder!=undefined" class="transaction-content" slot="card-content">
          <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.Marketaddress')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.marketAddress}}
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
            <span class="title">{{$t('orderinfo.orderid')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.orderId}}
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
          <Col span="20" class-name="content-wrapper">
            {{orderinfo.MatchOrder.size}}GB
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="6" class-name="title-wrapper">
            <span class="title">{{$t('orderinfo.unitprice')}}:</span>
          </Col>
          <Col span="18" class-name="content-wrapper">
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
           {{amountFormat(orderinfo.MatchOrder.minerPay)}}
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

        <Row class-name="card-item">
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



const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      orderinfo: {},
      passwordModal: false,
      walletPassword: '',
      managerkey: {}
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
        var info = await this.machineNameinfo(this.$data.orderinfo);
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
    async  machineNameinfo(orderinfo) {
      console.log('machineNameinfo');
      let res = await ipc.callMain('sets3orderinfo', orderinfo);
      if (res.state) {
        console.log(res.data);
      }
    },

    async gets3token() {
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
        // alert(JSON.stringify(res.data))
        } else {
        // alert('失败')
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
