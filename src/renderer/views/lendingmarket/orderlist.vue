<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">

        <Table :columns="matchordercolumns" :data="matchorderdata">

                 <template slot-scope="{ row, index }" slot="operation">
                    <Button @click="pageto(row)" type="primary" size="small"> {{$t('Matchorders.list.Details')}} </Button>
                  </template>

                  <template slot-scope="{ row, index }" slot="price">
                    {{row.price |BlanceValue }}
                  </template>

                  <template slot-scope="{ row, index }" slot="category">
                    {{orderType(row.buyAddress) }}
                  </template>



                  <template slot-scope="{ row, index }" slot="createTime">
                    {{row.createTime|blockFormatDate }}
                  </template>



               </Table>
               <br/>
               <div style="text-align: center;">
                     <Page   @on-change="orderListPage" :total="allCount" simple/>
                    </div>
        </div>
    </div>
</div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      loading: false,
      matchordercolumns: [{
        title: this.$t('Matchorders.list.Orderid'),
        key: 'orderId'
      },
      {
        title: this.$t('Matchorders.list.Size'),
        key: 'size'
      },
      {
        title: this.$t('Matchorders.list.Startingtime'),
        key: 'createTime',
        slot: 'createTime'
      },
      {
        title: this.$t('Matchorders.list.category'),
        key: 'category',
        slot: 'category'
      },
      {
        title: this.$t('Matchorders.list.operating'),
        key: 'operation',
        slot: 'operation'
      }],
      matchorderdata: [],
      allCount: 1,
      pageCount: {}
    };
  },
  mounted() {
    this.getListdata(1);
  },
  methods: {
    async getListdata(page) {
      // loanmatch_match_orders

      try {
        this.$data.loading = true;
        let res = await ipc.callMain('loanmatch_match_orders', {
          page,
          limit: 10
        });
        if (res.state) {
          console.log(res.data.data);
          this.$data.matchorderdata = res.data.data;
          if (this.$data.pageCount[page] == undefined) {
            this.$data.pageCount[page] = 1;
            this.$data.allCount += this.$data.matchorderdata.length;
          }
        }
        this.$data.loading = false;
      } catch (error) {
        this.$data.loading = false;
        console.log(error);
      }
    },
    pageto(item) {
      console.log('**************');
      this.$router.push(`/lendingmarket/orderdetails/${item.orderId}`);
    },
    orderType(buyaddress) {
      var address = this.$store.getters.getaddress;
      if (buyaddress == address) {
        return this.$t('Matchorders.list.buy');
      } else {
        return this.$t('Matchorders.list.sell');
      }
    },
    orderListPage(number) {
      this.getListdata(number);
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
    margin-top: 40px;
  }
}
</style>
