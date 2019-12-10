<template>
  <div class="customer-container">

      <div class="tableContainer">
      <div style="    margin-bottom: 10px;">
           <Row>
               <Button @click="openCreateModel" type="primary">初始化矿工账户</Button>&nbsp;&nbsp;
               <Button  type="primary">导入</Button>&nbsp;&nbsp;
               <Button  type="primary">新建</Button>&nbsp;&nbsp;

            </Row>
      </div>
        <Table :columns="columns" :data="data">



        </Table>



      </div>
      <sonAccountModelDialog ref="sonAccountModel"></sonAccountModelDialog>


  </div>
</template>

<script>
import TxTable from '@/components/txTable/index.vue';
import txFormat from '@/common/js/txFormat.js';
import eventhub from '../../common/js/event.js';

import sonAccountModelDialog from '@/views/Dialog/sonAccountModel.vue';

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
          title: '编号',
          key: 'id'
        },
        {
          title: '操作',
          key: 'id'
        }
      ],
      data: [],
      pageNumber: 1,
      loading: false
    };
  },
  mounted() {

  },
  methods: {
    openCreateModel() {
      this.$refs.sonAccountModel.open();
    }
  },
  beforeDestroy() {

  },
  components: {
    TxTable,
    sonAccountModelDialog
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
