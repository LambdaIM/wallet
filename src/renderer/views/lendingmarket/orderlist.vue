<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
        匹配订单列表
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


                  <template slot-scope="{ row, index }" slot="asset">
                    {{denomFormart(row.asset) }}
                  </template>


                  <template slot-scope="{ row, index }" slot="createTime">
                    {{row.createTime|blockFormatDate }}
                  </template>



               </Table>
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
        title: this.$t('Matchorders.list.AssetName'),
        key: 'asset',
        slot: 'asset'
      },
      {
        title: this.$t('Matchorders.list.Size'),
        key: 'size'
      },
      {
        title: this.$t('Matchorders.list.price'),
        key: 'price',
        slot: 'price'
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
      matchorderdata: []
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
