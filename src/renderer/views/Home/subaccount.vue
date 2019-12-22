<template>
  <div class="customer-container">

      <div class="tableContainer">
      <div style="    margin-bottom: 10px;">
           <Row>
               <Button @click="openCreateModel" type="primary">{{$t('subaccount.Createminersubaccount')}}</Button>&nbsp;&nbsp;
               <Button @click="importAccount" type="primary">{{$t('subaccount.Import')}}</Button>&nbsp;&nbsp;


            </Row>
      </div>
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
                <Button size="small"  @click="exportAccount(row)"  type="primary">{{$t('subaccount.export')}}</Button>
                <Button size="small"  @click="cointransaction(row)"  type="primary">{{$t('subaccount.transaction')}}</Button>
            </template>
            <template slot-scope="{ row, index }" slot="account">
                {{row.lambdavalue|Lambformat  }}
            </template>



        </Table>



      </div>
      <sonAccountModelDialog ref="sonAccountModel"></sonAccountModelDialog>
      <sonAccountExportModelDialog ref="sonAccountExportModel"   ></sonAccountExportModelDialog>
      <SendModelDialog ref="SendModelDialog" />
      <sonAccountImportModelDialog ref="sonAccountImportModel" />


  </div>
</template>

<script>
import TxTable from '@/components/txTable/index.vue';

import eventhub from '../../common/js/event.js';

import sonAccountModelDialog from '@/views/Dialog/sonAccountModel.vue';
import sonAccountExportModelDialog from '@/views/Dialog/sonAccountExportModel.vue';
import SendModelDialog from '@/views/Dialog/sendModel.vue';

import sonAccountImportModelDialog from '@/views/Dialog/sonAccountImportModel.vue';


const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      columns: [
        {
          title: this.$t('subaccount.address'),
          key: 'address'
        },
        {
          title: this.$t('subaccount.remarks'),
          key: 'name'
        },
        {
          title: this.$t('subaccount.amount'),
          key: 'account',
          slot: 'account'
        },
        {
          title: this.$t('subaccount.operation'),
          key: 'privateKey',
          slot: 'action'
        }
      ],
      data: [],
      pageNumber: 1,
      loading: false
    };
  },
  mounted() {
    this.accountList();
    var _this = this;
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      // 更新余额
      _this.accountList();
    });
    eventhub.$on('exportSonConfirm', data => {
      console.log('exportSonConfirm', data);
      // 导出成功
    });
    eventhub.$on('createSonAccountConfirm', data => {
      console.log('createSonAccountConfirm');
      // 创建呢成功
      _this.accountList();
    });
    this.$data.Interval = setInterval(() => {
      _this.accountList();
    }, 1000 * 15);
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    openCreateModel() {
      this.$refs.sonAccountModel.open();
    },
    async accountList() {
      try {
        console.log('accountList');
        // sonAccountList

        let res = await ipc.callMain('sonAccountList', {});
        console.log(res);
        if (!res.state) return;
        // console.log(res);
        res.data.forEach(element => {
          element.lambdavalue = '';
          if (element.account && element.account.coins != null) {
            element.account.coins.forEach(item => {
              if (item.denom == 'ulamb') {
                element.lambdavalue = item.amount;
              }
            });
          }
        });
        this.$data.data = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async exportAccount(row) {
      console.log(this.$refs);
      this.$refs.sonAccountExportModel.open(row);
    },
    cointransaction(row) {
      this.$refs.SendModelDialog.open(undefined, 'ulamb', row.address);
    },
    importAccount() {
      this.$refs.sonAccountImportModel.open();
    }
  },
  components: {
    TxTable,
    sonAccountModelDialog,
    sonAccountExportModelDialog,
    SendModelDialog,
    sonAccountImportModelDialog
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
