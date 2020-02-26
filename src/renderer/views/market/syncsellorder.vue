<template>
  <div class="customer-container">
    <div class="tableContainer">
      <syncbar :marketName="name" />
    </div>
    <!-- OrderListcolumnsNotSort -->
    <Table
      @on-sort-change="OrderListSort"
      :loading="loading"
      :columns="OrderListcolumns"
      :data="OrderList"
    >
      <template slot-scope="{ row, index }" slot="action">
        <Button
          v-if="row.status=='0'"
          @click="openBuyingspace(row)"
          type="primary"
          size="small"
        >{{$t('marketpage.selltable.Purchasespace')}}</Button>
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
</template>
<script>
import syncbar from './syncbar.vue';
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  components: {
    syncbar
  },
  data() {
    return {
      name: this.$route.params.marketname,
      marketAddress: this.$route.params.marketAddress,
      loading: false,
      allCount: 1,
      pageCount: {},
      OrderList: [],
      orderSortinfo: {},
      islocalfilter: {},
      OrderListcolumns: [
        {
          title: this.$t('marketpage.selltable.Mineraddress'),
          key: 'address'
        },
        // {
        //   title: this.$t('marketpage.myselltable.Storagedevice'),
        //   key: 'machineName'
        // },
        {
          title: this.$t('marketpage.selltable.amountspace'),
          key: 'sellSize',
          sortable: 'custom'
        },
        {
          title: this.$t('marketpage.selltable.remainingspace'),
          key: 'unUseSize',
          sortable: 'custom'
        },
        {
          title: this.$t('marketpage.selltable.unitprice'),
          key: 'price',
          slot: 'price',
          sortable: 'custom'
        },
        {
          title: this.$t('marketpage.selltable.minimumspace'),
          key: 'minBuySize'
        },
        {
          title: this.$t('marketpage.selltable.minimumduration'),
          key: 'minDuration',
          slot: 'minDuration'
        },
        {
          title: this.$t('marketpage.selltable.operating'),
          key: 'action',
          slot: 'action'
        },
        {
          title: this.$t('marketpage.selltable.Odds'),
          key: 'rate',
          slot: 'rate'
        },
        {
          title: this.$t('marketpage.Status'),
          key: 'status',
          slot: 'status'
        }
      ]
    };
  },
  mounted() {
    this.getOrderList(1);
    eventhub.$on('marketsellordersync', data => {
      console.log('marketsellordersync');
      this.$data.islocal = data;
      this.getOrderList(1);
    });

    eventhub.$on('marketconditionfilter', data => {
      console.log('marketconditionfilter');
      this.$data.islocalfilter = data;
      this.$data.allCount = 1;
      this.$data.pageCount = {};
      this.getOrderList(1);
    });
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getOrderList(1);
    });
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
          if (this.$data.pageCount[page] == undefined) {
            this.$data.pageCount[page] = 1;
            this.$data.allCount += this.$data.OrderList.length;
          }
          this.$data.loading = false;
        }
      } catch (error) {
        this.$Message.error(this.$t('foot.linkerror'));
      }
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
</style>
