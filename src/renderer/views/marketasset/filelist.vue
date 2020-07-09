<template>
<div>
    <div class="customer-container">

        <div class="tableContainer">
              <Table :columns="columns" :data="list">
                <template slot-scope="{ row, index }" slot="operation">
                  <Button @click="openS3(row)">通过s3查看</Button>
                </template>
              </Table>
        </div>
        <s3 ref="s3Modal" :orderid="orderid"></s3>
    </div>
</div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';

const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  components: {
    s3: () => import('../../components/s3/S3.vue')
  },
  data() {
    return {
      list: [],
      columns: [
        {
          title: 'orderID',
          key: 'orderID'
        }, {
          title: 'File',
          key: 'File'
        },
        {
          title: 'sender',
          key: 'sender'
        },
        {
          title: '操作',
          key: 'operation',
          slot: 'operation'
        }
      ],
      orderid: ''
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    async  getlist() {
      // assetAll
      console.log('getlist');
      try {
        let res = await ipc.callMain('AuthorizefileRceiver', {
          page: 1
        });
        if (res.state && res.data.data.error == undefined) {
          // .tx.value.msg[0].value
          var data = res.data.data || [];
          var result = [];
          data.forEach(element => {
            result.push(element.tx.value.msg[0].value);
          });
          this.$data.list = result;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    openS3(row) {
      this.$data.orderid = row.orderID;

      this.$refs.s3Modal.openDialog();
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
    // width: 94%;
    margin: 0 auto;
    margin-top: 40px;
  }
}
</style>
