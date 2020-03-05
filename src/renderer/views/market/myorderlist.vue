
<template>
  <div class="customer-container">
    <div class="tableContainer">
      <!-- <div>{{$t('marketpage.last100data')}}</div> -->
      <Table :loading="loading" :columns="UserOrderscolumns" :data="UserOrderslist">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            @click="orderinfo(row)"
            type="primary"
            size="small"
          >{{$t('marketpage.ordertable.orderdetails')}}</Button>
        </template>
        <template slot-scope="{ row, index }" slot="price">{{row.MatchOrder.price|Lambformat}}</template>
        <template
          slot-scope="{ row, index }"
          slot="userPay"
        >{{amountFormat(row.MatchOrder.userPay)}}</template>
        <template
          slot-scope="{ row, index }"
          slot="buyAddress"
        >{{typeFormat(row.MatchOrder.buyAddress)}}</template>
        <template slot-scope="{ row, index }" slot="minerPay">
          <span
            v-if="typeBuyType(row.MatchOrder.buyAddress)"
          >{{amountFormat(row.MatchOrder.minerPay)}}</span>
          <span v-else>--</span>
        </template>
        <template
          slot-scope="{ row, index }"
          slot="createTime"
        >{{row.MatchOrder.createTime|formatDate}}</template>
        <template slot-scope="{ row, index }" slot="endTime">{{row.MatchOrder.endTime|formatDate}}</template>
        <template slot-scope="{ row, index }" slot="size">{{row.MatchOrder.size}}</template>
        <template slot-scope="{ row, index }" slot="orderId">{{row.MatchOrder.orderId}}</template>
        <template slot-scope="{ row, index }" slot="status">
          <span style="color:green" v-if="row.MatchOrder.status=='0'">{{$t('marketpage.Active')}}</span>
          <span style="color:red" v-if="row.MatchOrder.status=='2'">{{$t('marketpage.Expired')}}</span>
        </template>
      </Table>
      <br />
      <br />
      <div style="text-align: center;">
        <Page @on-change="UserOrdersListPage" :total="allCount" simple />
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  </div>
</template>
<script>

const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');
var packagejson = require('../../../../package.json');

export default {
  data() {
    return {
      UserOrderscolumns: [
        {
          title: this.$t('marketpage.ordertable.orderType'),
          key: 'MatchOrder.buyAddress',
          slot: 'buyAddress'
        },
        {
          title: this.$t('marketpage.ordertable.orderid'),
          key: 'MatchOrder.orderId',
          slot: 'orderId'
        },

        {
          title: this.$t('marketpage.ordertable.amountspace'),
          key: 'MatchOrder.size',
          slot: 'size'
        },
        {
          title: this.$t('marketpage.ordertable.unitprice'),
          key: 'MatchOrder.price',
          slot: 'price'
        },

        {
          title: this.$t('marketpage.ordertable.Startingtime'),
          key: 'MatchOrder.createTime',
          slot: 'createTime'
        },
        {
          title: this.$t('marketpage.ordertable.EndTime'),
          key: 'MatchOrder.endTime',
          slot: 'endTime'
        },
        {
          title: this.$t('marketpage.ordertable.userPay'),
          key: 'MatchOrder.userPay',
          slot: 'userPay'
        },
        {
          title: this.$t('marketpage.ordertable.minerPay'),
          key: 'MatchOrder.minerPay',
          slot: 'minerPay'
        },
        {
          title: this.$t('marketpage.ordertable.orderdetails'),
          key: 'action',
          slot: 'action'
        },
        {
          title: this.$t('marketpage.Status'),
          key: 'status',
          slot: 'status'
        }
      ],
      UserOrderslist: [],
      allCount: 1,
      pageCount: {},
      loading: true
    };
  },
  mounted() {
    this.getUserOrderslist(1);
  },
  methods: {
    orderinfo(item) {
      this.$router.push(`/orderinfo/${item.MatchOrder.orderId}`);
    },
    async getUserOrderslist(page) {
      this.$data.loading = true;
      try {
        let res = await ipc.callMain('marketUserOrderslist', {
          page: page || 1,
          limit: 10
        });
        if (res.state) {
          this.$data.UserOrderslist = res.data.data || [];
          if (this.$data.pageCount[page] == undefined) {
            this.$data.pageCount[page] = 1;
            this.$data.allCount += this.$data.UserOrderslist.length;
          }
          this.$data.loading = false;
        }
      } catch (error) {
        this.$Message.error(this.$t('foot.linkerror'));
      }
    },
    UserOrdersListPage(page) {
      console.log(page);
      this.getUserOrderslist(page);
    },
    amountFormat(item) {
      return this.bigNumTypeFormat(item.amount, item.denom);
    },
    typeFormat(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return this.$t('marketpage.payorder');
      } else {
        return this.$t('marketpage.sellorder');
      }
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
    address: function() {
      return this.$store.getters.getaddress;
    }
  }
};
</script>>



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
