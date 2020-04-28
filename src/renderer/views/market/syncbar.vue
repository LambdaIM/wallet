<template>
<div>

 <Row>
        <Col span="21">
        <div class="searchtxt" style="    display: inline-block;"  >


 {{$t('marketpage.selltable.unitprice')}} <Input @on-keyup="conditionChange"  v-model.number="condition.priceStart" size="small"  style="width: 120px" /> ~<Input @on-keyup="conditionChange"  v-model.number="condition.priceEnd" size="small"  style="width: 120px" />
 {{$t('marketpage.selltable.Odds')}} <Input @on-keyup="conditionChange" v-model.number="condition.rateStart" size="small"  style="width: 120px" /> ~<Input  @on-keyup="conditionChange" v-model.number="condition.rateEnd" size="small"  style="width: 120px" />

  </div>


        </Col>
        <!-- <Col span="3">

            1
        </Col> -->
        <Col span="1">
        <!-- <Button  to="/market/buyspace"  type="primary">{{stateTxt}}</Button> -->
        <Dropdown @on-click="datasync">
        <!-- @click="datasync" -->
        <Button :loading="loading"   >
          {{$t('marketpage.datasync')}}
          <Icon type="ios-arrow-down"></Icon>
          </Button>

        <DropdownMenu slot="list">
            <DropdownItem name="some">{{$t('syncorderpage.typedata1')}}</DropdownItem>
            <DropdownItem name="more">{{$t('syncorderpage.typedata2')}}</DropdownItem>
            <DropdownItem name="all" divided>{{$t('syncorderpage.typedata3')}}</DropdownItem>

        </DropdownMenu>
    </Dropdown>
        </Col>
    </Row>
      <br/>
     <Row>
        <Col span="18">
        <div class="searchtxt" style="    display: inline-block;"  >



 {{$t('syncorderpage.mineraddress')}}<Input @on-keyup="conditionChange"  v-model="condition.storagenode" size="small"  style="width: 280px" />
 订单ID<Input @on-keyup="conditionChange"  v-model="condition.orderid" size="small"  style="width: 280px" />
  </div>


        </Col>

    </Row>
</div>
</template>

<script>
import { DAEMON_CONFIG } from '../../../config.js';
import eventHub from '@/common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      searchkey: '',
      switchstate: true,
      page: 1,
      loading: false,
      condition: {
        priceStart: '',
        priceEnd: '',
        rateStart: '',
        rateEnd: '',
        storagenode: '',
        statusType: '0',
        orderid: ''
      }
    };
  },
  props: {
    marketName: {
      type: String
    }
  },
  mounted() {

  },
  methods: {
    conditionChange() {
      if (this.$data.condition.priceStart != '' && this.$data.condition.priceEnd != '' &&
      this.$data.condition.priceEnd < this.$data.condition.priceStart) {
        this.$Message.info(this.$t('marketpage.Localsorting4'));
        return;
      }

      if (this.$data.condition.rateStart != '' && this.$data.condition.rateEnd != '' &&
      this.$data.condition.rateEnd < this.$data.condition.rateStart) {
        this.$Message.info(this.$t('marketpage.Localsorting4'));
        return;
      }
      this.$data.condition['statusType'] = '0';
      // this.$data.condition['statusType'] = this.$store.getters.statusType == 'active' ? '0' : '1';

      eventHub.$emit('marketconditionfilter', this.$data.condition);
    },
    switchfn() {
      console.log('=====');

      this.$data.switchstate = !this.$data.switchstate;
      eventHub.$emit('marketsellordersync', this.$data.switchstate);
      // if (this.$data.switchstate) {
      //   this.$data.loading = true;
      //   this.fetchData();
      // }
    },
    datasync(nameType) {
      // eventHub.$emit('marketsellordersync', this.$data.switchstate);
      // if (this.$data.switchstate) {
      this.$Spin.show();
      console.log(nameType);
      var stoppagenum = 1000;
      if (nameType == 'some') {
        stoppagenum = 1000;
      } else if (nameType == 'more') {
        stoppagenum = 10000;
      } else {
        stoppagenum = 100000;
      }

      this.$data.loading = true;
      this.$data.page = 1;
      this.cleardata();
      this.fetchData(stoppagenum);
      // }
    },
    async cleardata() {
      var marketAddress = this.$store.getters.getselectMarket;
      let res = await ipc.callMain('clearlocalmarketdata', {
        marketAddress: marketAddress
      });
    },
    async fetchData(stoppagenum) {
      console.log('-----');
      let res = await ipc.callMain('marketOrderListsync', {
        marketName: this.$props.marketName,
        orderType: 'premium', // premium all
        page: this.$data.page,
        limit: 10,
        statusType: 'active'
      });
      if (res.data == 10 && stoppagenum >= this.$data.page) {
        this.$data.page += 1;
        this.fetchData(stoppagenum);
      } else {
        this.$data.loading = false;
        this.$Spin.hide();
        eventHub.$emit('marketconditionfilter', this.$data.condition);
      }
    }
  },
  computed: {
    stateTxt() {
      if (this.$data.switchstate) {
        return this.$t('marketpage.Localsorting2');
      } else {
        return this.$t('marketpage.Localsorting1');
      }
    }
  }

};

</script>
