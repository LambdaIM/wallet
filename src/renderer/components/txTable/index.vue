<template>
  <div  id="cardTable__container">
    <CardTableHead/>
      <div v-if="loading==false">
        <Row className="cardTable__content-item" v-for="(item, index) in txData" :key="index">
          <Card class="cardTable__card-item">
            <Activity :showError="showError" :md="24" :lg="10" :activityData="txData[index].txs"></Activity>
            <Col :xs="5" :md="6" :lg="3"
              >
                <Tag v-if="txerrororsuccess(item)===true" color="success">{{$t('Dialog.com.Success')}} </Tag>
                <Tag v-if="txerrororsuccess(item)===false" color="error">{{$t('Dialog.com.Failed')}}</Tag>
              </Col>
            <Col :xs="4" :md="6" :lg="3"
              >
              <Icon type="md-time" size="24" class="mr5 txIcon" />{{ item.create_time | formatRelativeDate }}</Col>
            <Col :xs="4" :md="6" :lg="2">
              <Icon type="md-list" size="22" class="mr5 txIcon" />

              {{ item.height || 0 }}</Col
            >
            <Col :xs="5" :md="6" :lg="3"
              ><Icon type="logo-usd" size="22" class="mr5 txIcon" />{{ item.fee  }}</Col
            >
            <Col :xs="6" :md="6" :lg="3">
              <router-link :to="`/detail/${item.tx_com_hash}`"
                >{{ item.tx_com_hash.slice(0, addressLength) }}...</router-link
              ></Col
            >
          </Card>
        </Row>
        <Row className="cardTable__content-item" v-if="txData&&txData.length==0" >
          <div style="text-align: center;">
          {{$t("Dialog.com.Nodata")}}
          </div>
        </Row>
      </div>
      <div class="demo-spin-col" v-else>
        <Spin fix></Spin>
      </div>
      <div style="    text-align: center;">
        <a @click="Openbrowser" >{{$t('home.moreonbrowser')}}</a>
      </div>
  </div>
</template>

<script>
import { DAEMON_CONFIG } from '../../../config.js';
const { shell } = require('electron');


export default {
  components: {
    Activity: () => import('./Activity.vue'),
    CardTableHead: () => import('./CardTableHead.vue')
  },
  methods: {
    txerrororsuccess(item) {
      console.log(item);
      var result = true;
      item.txs.forEach(item => {
        if (item.log != '') {
          result = false;
        }
      });
      return result;
    },
    Openbrowser() {
      var explorer = DAEMON_CONFIG.explore();
      var address = this.$store.getters.getaddress;
      let url = `${explorer}#/address/${address}/activity/1/all`;
      console.log(url);
      shell.openExternal(url);
    }



  },
  props: {
    txData: {
      type: Array
    },
    addressLength: {
      type: Number,
      default: 15
    },
    showError: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {

  }
};
</script>

<style lang="less" scoped>
#cardTable__container {
  width: 100%;
  height: 100%;
  font-size: 14px;
  .cardTable__content-item {
    width: 100%;
    margin-bottom: 10px;
    .cardTable__card-item {
      width: 100%;
      display: inline-block;
      padding: 20px 10px;
    }
  }
}
.demo-spin-col{
  display: inline-block;
  width: 100%;
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
