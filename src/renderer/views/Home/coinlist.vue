
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <Table :columns="columnsToken" :data="coinList">


            <template slot-scope="{ row, index }" slot="amount">
              {{bigNumTypeFormat(row.amount,row.denom)}}
            </template>
            <template slot-scope="{ row, index }" slot="denom">
              {{denomFormart(row.denom)}}
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button @click="cointransaction(row)" type="primary" size="small">{{$t('home.Token.Transfer')}}</Button>

              <Button v-if="row.denom=='ulamb'" @click="openAssert(row)" size="small">{{$t('home.Token.Exchange')}}</Button>
            </template>
          </Table>

        </TabPane>
      </div>
      <SendModelDialog ref="SendModelDialog" />
      <AssetlModalDialog ref="AssetlModalDialog" />


  </div>
</template>
<script>
import SendModelDialog from '@/views/Dialog/sendModel.vue';
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';

export default {
  data() {
    return {

      columnsToken: [
        {
          title: this.$t('home.Token.name'),
          key: 'denom',
          slot: 'denom'
        },
        {
          title: this.$t('home.Token.amount'),
          key: 'amount',
          slot: 'amount'
        },
        {
          title: this.$t('home.Token.operation'),
          key: 'action',
          slot: 'action'
        }
      ]
    };
  },
  mounted() {

  },
  components: {
    SendModelDialog,
    AssetlModalDialog
  },
  methods: {
    denomFormart(denom) {
      return denom.substr(1).toUpperCase();
    },
    openAssert(row) {
      this.$refs.AssetlModalDialog.open(row.amount, row.denom);
    },
    cointransaction(row) {
      this.$refs.SendModelDialog.open(row.amount, row.denom);
    }
  },
  computed: {
    coinList: function() {
      return this.$store.getters.getcoinList;
    }
  }

};
</script>
<style lang="less" scoped>
.customer-container {
  padding-bottom: 100px;
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
