<template>
  <div class="customer-container">

      <div class="tableContainer">
      <div style="    margin-bottom: 10px;">
           <Row>
               <Button @click="openCreateModel" type="primary">创建矿工子账户</Button>&nbsp;&nbsp;
               <Button  type="primary">导入</Button>&nbsp;&nbsp;
               <Button  type="primary">新建</Button>&nbsp;&nbsp;

            </Row>
      </div>
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
                <Button  @click="exportAccount(row)"  type="primary">导出</Button>
            </template>



        </Table>



      </div>
      <sonAccountModelDialog ref="sonAccountModel"></sonAccountModelDialog>
      <sonAccountExportModelDialog ref="sonAccountExportModel"   ></sonAccountExportModelDialog>


  </div>
</template>

<script>
import TxTable from '@/components/txTable/index.vue';

import eventhub from '../../common/js/event.js';

import sonAccountModelDialog from '@/views/Dialog/sonAccountModel.vue';
import sonAccountExportModelDialog from '@/views/Dialog/sonAccountExportModel.vue';


const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  data() {
    return {
      columns: [
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '备注',
          key: 'name'
        },
        {
          title: '操作',
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
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      // 更新余额
    });
    eventhub.$on('exportSonConfirm', data => {
      console.log('exportSonConfirm', data);
      // 导出成功
    });
    eventhub.$on('createSonAccountConfirm', data => {
      console.log('createSonAccountConfirm');
      // 创建呢成功
      this.accountList();
    });
  },
  methods: {
    openCreateModel() {
      this.$refs.sonAccountModel.open();
    },
    async accountList() {
      // sonAccountList
      let res = await ipc.callMain('sonAccountList', {});
      // console.log(res);
      if (!res.state) return;
      // console.log(res);
      this.$data.data = res.data;
    },
    async exportAccount(row) {
      console.log(this.$refs);
      this.$refs.sonAccountExportModel.open(row);

      // let res = await ipc.callMain('exportSonAccount', {
      //   row
      // });
      // // console.log(res);
      // if (!res.state) return;
    }
  },
  beforeDestroy() {

  },
  components: {
    TxTable,
    sonAccountModelDialog,
    sonAccountExportModelDialog
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
