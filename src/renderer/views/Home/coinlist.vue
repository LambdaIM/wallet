
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <div>
              <Button @click="openmarket" type="primary">创建市场</Button>
              <Button @click="openassert" type="primary"> 创建资产 </Button>

              <Button type="primary"> 矿工授权 </Button>
        </div>
        <br/>
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
            <template slot-scope="{ row, index }" slot="pledge">

                  <Button size="small">质押</Button>
                  <Button size="small">反质押</Button>
                  <Button size="small">提取收益</Button>

            </template>



          </Table>

        </TabPane>
      </div>
      <SendModelDialog ref="SendModelDialog" />
      <AssetlModalDialog ref="AssetlModalDialog" />
      <CreatemarketModalDialog ref="CreatemarketModal"/>
      <CreateAssetModalDialog ref="CreateAssetModal" />


  </div>
</template>
<script>
import SendModelDialog from '@/views/Dialog/sendModel.vue';
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
import _ from 'underscore';
import eventhub from '../../common/js/event.js';


import CreatemarketModalDialog from '@/views/Dialog/CreatemarketModal.vue';
import CreateAssetModalDialog from '@/views/Dialog/CreateAssetModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');


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
        },
        {
          title: '关联市场',
          key: 'Related market'

        },
        {
          title: '质押',
          key: 'Pledgeamount'

        },
        {
          title: '挖矿收益',
          key: 'Pledgeamount'

        },
        {
          title: '质押、反质押、提取收益',
          key: 'pledge',
          slot: 'pledge'
        }
      ],
      allassert: []
    };
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  async mounted() {
    this.getAssertAll();
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getAssertAll();
    });
    this.Interval = setInterval(() => {
      this.getAssertAll();
    }, 1000 * 15);
  },
  components: {
    SendModelDialog,
    AssetlModalDialog,
    CreatemarketModalDialog,
    CreateAssetModalDialog
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
    },
    async  getAssertAll() {
      // assetAll
      try {
        let res = await ipc.callMain('assetAll', {});
        if (res.state) {
          this.$data.allassert = res.data || [];
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    openmarket() {
      this.$refs.CreatemarketModal.open();
    },
    openassert() {
      this.$refs.CreateAssetModal.open();
    }


  },
  computed: {
    coinList: function() {
      var mycoinList = this.$store.getters.getcoinList;
      if (mycoinList.length == 0) {
        mycoinList = mycoinList.concat([
          {
            amount: '0',
            denom: 'ulamb'
          },
          {
            amount: '0',
            denom: 'utbb'
          }
        ]);
      }

      var otherList = [];
      console.log(mycoinList);

      if (this.$data.allassert == 0) {
        return this.$store.getters.getcoinList;
      } else {
        this.$data.allassert.forEach(item => {
          // mycoinList
          var haveitem = _.find(mycoinList, {
            denom: item.asset.denom
          });
          if (haveitem == undefined || haveitem.length == 0) {
            otherList.push({
              amount: '0',
              denom: item.asset.denom
            });
          }
        });
      }
      var listneedtosort = mycoinList.concat(otherList);

      listneedtosort.forEach(item => {
        if (item.denom == 'ulamb') {
          item.sort = 1;
        } else if (item.denom == 'utbb') {
          item.sort = 0;
        } else {
          item.sort = -1;
        }
      });

      return listneedtosort.sort(function (n, m) {
        if (m.sort < n.sort) return -1;
        else if (m.sort > n.sort) return 1;
        else return 0;
      });
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
