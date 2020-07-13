<template>
<div>
    <div class="customer-container">

        <div class="tableContainer">
             <div>
                <Alert type="warning">接受到的文件，如果再转让给别人，将无法打开</Alert>
             </div>
              <Table :columns="columns" :data="list">
                <template slot-scope="{ row, index }" slot="operation">
                  <Button @click="openS3(row)">{{$t('assetsotherpage.OpenviaS3')}}</Button>
                </template>
              </Table>
              <br/>
               <div style="text-align: center;">
                     <Page   @on-change="orderListPage" :total="allCount" simple/>
                    </div>
                    <br/><br/>
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
          title: this.$t('assetsotherpage.filelist.orderid'),
          key: 'orderID'
        }, {
          title: this.$t('assetsotherpage.filelist.file'),
          key: 'File'
        },
        {
          title: this.$t('assetsotherpage.filelist.send'),
          key: 'sender'
        },
        {
          title: this.$t('assetsotherpage.filelist.operation'),
          key: 'operation',
          slot: 'operation'
        }
      ],
      orderid: '',
      allCount: 1,
      pageCount: {}
    };
  },
  mounted() {
    this.getlist(1);
  },
  methods: {
    async  getlist(page) {
      // assetAll
      console.log('getlist');
      try {
        let res = await ipc.callMain('AuthorizefileRceiver', {
          page: page
        });
        if (res.state && res.data.data.error == undefined) {
          // .tx.value.msg[0].value
          var data = res.data.data || [];
          var result = [];
          data.forEach(element => {
            result.push(element.tx.value.msg[0].value);
          });
          this.$data.list = result;
          if (this.$data.pageCount[page] == undefined) {
            this.$data.pageCount[page] = 1;
            this.$data.allCount += result.length;
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    openS3(row) {
      this.$data.orderid = row.orderID;

      this.$refs.s3Modal.openDialog();
    },
    orderListPage(number) {
      this.getlist(number);
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
