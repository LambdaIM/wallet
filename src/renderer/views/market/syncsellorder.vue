<template>
  <div class="customer-container">
    <div class="tableContainer">
      <h3 style="   ">
         {{$t('head.market')}}
          <Dropdown @on-click="selectmarketClick">
        <a href="javascript:void(0)">
            {{selectmarket.name}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu  v-if="marketList" slot="list">
            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList" >{{item.name}}</DropdownItem>


        </DropdownMenu>
    </Dropdown>&nbsp;
    {{$t('marketpage.Pending-order-fee')}}：{{selectmarket.feeRate|Percentformat}}
    {{$t('marketpage.Single-fee')}}：{{selectmarket.commissionRate|Percentformat}}
    {{$t('syncorderpage.orderSynchronizationTime')}}：{{syncTime}}
      </h3>
      <div v-if="syncTime==undefined">

       <Alert type="warning">{{$t('syncorderpage.needSync')}}</Alert>
      </div>
      <br v-else />
      <syncbar :marketName="name" />


    <br/>

    <!-- OrderListcolumnsNotSort -->
    <!-- <div v-if="OrderList.length==0" class="emptydata">
      {{$t('syncorderpage.no-data-text')}}
    </div> -->
    <Table
      @on-sort-change="OrderListSort"
      :loading="loading"
      :columns="OrderListcolumns"
      :data="OrderList"


    >
      <template slot-scope="{ row, index }" slot="action">
        <Button
          :to="`/market/sellorderinfo/${row.orderId}`"

          type="primary"
          size="small"
        >{{$t('marketpage.ordertable.orderdetails')}}</Button>
      </template>
      <template slot-scope="{ row, index }" slot="price">{{row.price|Lambformat}}</template>
      <template slot-scope="{ row, index }" slot="minDuration">{{row.minDuration|formatMonth}}</template>
      <template slot-scope="{ row, index }" slot="rate">{{parseFloat(row.rate)}}</template>
      <template slot-scope="{ row, index }" slot="status">
        <span style="color:green" v-if="row.status=='0'">{{$t('marketpage.Active')}}</span>
        <span style="color:red" v-if="row.status=='1'">{{$t('marketpage.Finish')}}</span>
      </template>
    </Table>

    <br />
    <div style="text-align: center;">
      <Page @on-change="orderListPage" :total="allCount" simple />
    </div>
    <br />
    <br />
    <br />
    </div>
    <BuyingspaceModal ref="Buyingspace" />
  </div>
</template>
<script>
import syncbar from './syncbar.vue';
import eventhub from '../../common/js/event.js';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';
import moment from 'moment';
const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  components: {
    syncbar,
    BuyingspaceModal
  },
  data() {
    return {
      name: '',
      marketAddress: '',
      loading: false,
      allCount: 1,
      pageCount: {},
      OrderList: [],
      orderSortinfo: {},
      islocalfilter: {},
      OrderListcolumns: [
        {
          // title: this.$t('marketpage.selltable.Mineraddress'),
          title: this.$t('syncorderpage.orderID'),
          key: 'orderId'
        },
        // {
        //   title: this.$t('marketpage.myselltable.Storagedevice'),
        //   key: 'machineName'
        // },
        {
          title: this.$t('marketpage.selltable.Mineraddress'),
          key: 'address'
          // slot: 'rate'
        },
        {
          title: this.$t('marketpage.selltable.amountspace'),
          key: 'sellSize',
          sortable: 'custom'
        },
        // {
        //   title: this.$t('marketpage.selltable.remainingspace'),
        //   key: 'unUseSize',
        //   sortable: 'custom'
        // },
        {
          title: this.$t('marketpage.selltable.unitprice'),
          key: 'price',
          slot: 'price',
          sortable: 'custom'
        },
        {
          title: this.$t('marketpage.selltable.minimumspace'),
          key: 'minBuySize',
          sortable: 'custom'
        },
        {
          title: this.$t('marketpage.selltable.minimumduration'),
          key: 'minDuration',
          slot: 'minDuration',
          sortable: 'custom'
        },
        {
          title: this.$t('marketpage.selltable.operating'),
          key: 'action',
          slot: 'action'
        }

        // {
        //   title: this.$t('marketpage.Status'),
        //   key: 'status',
        //   slot: 'status'
        // }
      ],
      marketList: [],
      marketinfo: '',
      selectmarket: {},
      syncTime: ''
    };
  },
  async mounted() {
    eventhub.$on('marketsellordersync', data => {
      console.log('marketsellordersync');
      this.$data.islocal = data;
      this.getOrderList(1);
      this.getmarketsyncTime();
    });

    eventhub.$on('marketconditionfilter', data => {
      console.log('marketconditionfilter');
      this.$data.islocalfilter = data;
      this.$data.allCount = 1;
      this.$data.pageCount = {};
      this.getOrderList(1);
      this.getmarketsyncTime();
    });
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getOrderList(1);
    });
    await this.getmarketlist();

    await this.getmarketinfo(this.$data.selectmarket.marketname);
    await this.getmarketsyncTime();
    this.getOrderList(1);
  },
  methods: {
    OrderListSort(columninfo) {
      if (this.$data.islocal == false) {
        this.$Message.info(this.$t('marketpage.Localsorting3'));
        return;
      }
      console.log(columninfo);
      var key = columninfo.key;
      var order = columninfo.order;
      this.$data.orderSortinfo = {
        key,
        order
      };
      this.$data.allCount = 1;
      this.$data.pageCount = {};

      this.getOrderList(1);
    },
    async    getmarketsyncTime() {
      console.log('getmarketsyncTime');
      var selectItem = this.finddefaultmarket();
      try {
        let res = await ipc.callMain('getmarketsyncTime', {
          marketAddress: selectItem.marketAddress
        });
        if (res.state) {
          // this.$data.syncTime = res.data;
          var langType;
          if (this.$i18n.locale == 'zh') {
            langType = 'zh-cn';
          } else {
            langType = 'en';
          }

          this.$data.syncTime = moment(res.data).locale(langType).fromNow();
        }
      } catch (error) {
        console.log(error);
      }
    },
    orderListPage(page) {
      console.log(page);
      this.getOrderList(page);
    },
    async getOrderList(page) {
      try {
        this.$data.loading = true;
        let res = await ipc.callMain('marketOrderList', {
          marketName: this.$data.name,
          orderType: 'premium', // premium all
          page: page || 1,
          limit: 10,
          marketAddress: this.$data.marketAddress,
          islocal: true,
          orderSortinfo: this.$data.orderSortinfo,
          islocalfilter: this.$data.islocalfilter,
          statusType: 'active' // active表示筛选可用   unActive表示筛选不可用  whole表示不筛选
        });

        if (res.state) {
          this.$data.OrderList = res.data.data || [];
          console.log('this.$data.OrderList', this.$data.OrderList);
          if (this.$data.pageCount[page] == undefined) {
            this.$data.pageCount[page] = 1;
            this.$data.allCount += this.$data.OrderList.length;
          }
          this.$data.loading = false;
        }
      } catch (error) {
        this.$Message.error(this.$t('foot.linkerror'));
      }
    },
    openBuyingspace(row) {
      this.$refs.Buyingspace.open(row, {
        name: this.$data.name,
        marketAddress: this.$data.marketAddress
      });
    },
    async getmarketlist() {
      console.log('getmarketlist');
      try {
        let res = await ipc.callMain('marketlist', {});
        if (res.state) {
          this.$data.marketList = res.data.data;
          this.$data.selectmarket = this.finddefaultmarket();
          this.$data.name = this.$data.selectmarket.name;
          this.$data.marketAddress = this.$data.selectmarket.marketAddress;
        }
      } catch (error) {
        this.$Message.error(this.$t('foot.linkerror'));
      }
    },
    finddefaultmarket() {
      var list = this.$data.marketList;
      var defaultaddress = this.$store.getters.getselectMarket;
      var result = list[0];
      list.forEach(item => {
        if (item.marketAddress == defaultaddress) {
          result = item;
        }
      });

      return result;
    },
    async   getmarketinfo(name) {
      let res = await ipc.callMain('marketinfo', {
        name
      });
      if (res.state) {
        this.$data.marketinfo = res.data.data;
      }
    },
    selectmarketClick(name) {
      console.log(name);
      var _this = this;
      this.$data.marketList.forEach(item => {
        if (name == item.name) {
          _this.$data.selectmarket = item;
        }
      });

      // name: this.$route.params.marketname,
      // marketAddress: this.$route.params.marketAddress,
      this.$data.name = this.$data.selectmarket.name;
      this.$data.marketAddress = this.$data.selectmarket.marketAddress;

      this.$store.dispatch('setselectMarket', this.$data.selectmarket.marketAddress);
      this.getmarketinfo(name);
      this.$data.allCount = 1;
      this.$data.pageCount = {};
      this.getOrderList(1);
      this.getmarketsyncTime();
    }
  }
};
</script>
<style lang="less" scoped>
.customer-container {
  .container {
    margin-top: 40px;
  }
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 10px;
  }
}
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

.emptydata{
  text-align: center;
  // background-color: #fff5f5;
  border-radius: 3px;
  color: #fa795e;
}
</style>
