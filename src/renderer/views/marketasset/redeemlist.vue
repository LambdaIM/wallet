<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
                <Table  :columns="redeemcolumns" :data="redeemdata">
                  <template slot-scope="{ row, index }" slot="completionTime">
                    {{row.completionTime|blockFormatDate}}
                  </template>
                  <template slot-scope="{ row, index }" slot="cost">
                    {{row.cost|BlanceValue}}
                  </template>

                  <template slot-scope="{ row, index }" slot="assetName">
                    {{denomFormart(row.assetName)}}
                  </template>
                </Table>
        </div>
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
  data() {
    return {
      redeemcolumns: [
        {
          title: this.$t('assetpage.Redemptionlist.AssetName'),
          key: 'assetName',
          slot: 'assetName'
        },
        {
          title: this.$t('assetpage.Redemptionlist.Redemptionamount'),
          key: 'cost',
          slot: 'cost'
        },
        {
          title: this.$t('assetpage.Redemptionlist.Completetime'),
          key: 'completionTime',
          slot: 'completionTime'
        }
      ],
      redeemdata: []
    };
  },
  mounted() {
    this.getredeemlist();
  },
  methods: {
    async  getredeemlist() {
      // assetAll
      console.log('Authorizedredeemlist');
      try {
        let res = await ipc.callMain('Authorizedredeemlist', {});
        if (res.state && res.data.data.error == undefined) {
          this.$data.redeemdata = res.data.data || [];
        }
      } catch (ex) {
        console.log(ex);
      }
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
