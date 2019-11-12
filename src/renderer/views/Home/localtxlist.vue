
<template>
  <div class="customer-container">
      <div class="tableContainer">
         <Table :columns="localTxcolumns" :data="localTxList">

            <template slot-scope="{ row, index }" slot="state">

                  <Tag v-if="row.state===0"  color="primary">{{localTypeState(row.state)}}</Tag>
                  <Tag v-if="row.state===1"  color="success">{{localTypeState(row.state)}}</Tag>
                  <Tag v-if="row.state===-2"  color="error">{{localTypeState(row.state)}}</Tag>
                  <Tag v-if="row.state===-1" color="warning">{{localTypeState(row.state)}}</Tag>
                  <Tag v-if="row.state===-3" color="warning">{{localTypeState(row.state)}}</Tag>
            </template>
            <template slot-scope="{ row, index }" slot="txinfo">
                <Button type="primary" @click="txinfo(row)"  size="small">{{$t('home.localtable.more')}}</Button>
            </template>
            <template slot-scope="{ row, index }" slot="createTime">
                {{row.createTime|formatToTime}}
            </template>
            <template slot-scope="{ row, index }" slot="txtype">
                {{localtype(row.transactiondata)}}
            </template>
            <template slot-scope="{ row, index }" slot="amount">
                {{localamount(row.transactiondata)}}
            </template>
            <template slot-scope="{ row, index }" slot="to">
                {{localto(row.transactiondata)}}
            </template>



          </Table>

      </div>


  </div>
</template>
<script>

import { DAEMON_CONFIG } from '../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

const { shell } = require('electron');


export default {
  data() {
    return {
      localTxList: [],
      localTxcolumns: [
        {
          title: this.$t('home.localtable.txhash'),
          key: 'txhash'
        },
        {
          title: this.$t('home.localtable.state'),
          key: 'state',
          slot: 'state'
        },
        {
          title: this.$t('home.localtable.txtype'),
          key: 'state',
          slot: 'txtype'
        }, {
          title: this.$t('home.localtable.amount'),
          key: 'state',
          slot: 'amount'
        }, {
          title: this.$t('home.localtable.to'),
          key: 'state',
          slot: 'to'
        },
        {
          key: 'createTime',
          slot: 'createTime',
          title: this.$t('home.localtable.time')
        },
        {
          key: 'message',
          title: this.$t('home.localtable.error')
        },
        {
          title: this.$t('home.localtable.more'),
          key: 'createTime',
          slot: 'txinfo'
        }


      ]
    };
  },
  mounted() {
    this.getlocaltxlist();
  },
  methods: {
    async getlocaltxlist() {
      let res = await ipc.callMain('localtxlist', {});
      // console.log(res);
      if (!res.state) return;
      // console.log(res);
      this.$data.localTxList = res.data;
    },
    localTypeState(item) {
      return this.$t(`home.localtable.types.${item}`);
    },
    localtype(item) {
      if (item) {
        return this.$t(`txType.${item.type}`);
      }
    },
    localto(item) {
      if (item) {
        if (item.type == 'MsgVote' || item.type == 'MsgDeposit') {
          return this.$t(`proposalsPage.ProposalID`) + ':' + item.proposalId;
        }
        return item.toAddress || item.validatorAddress;
      }
    },
    localamount(item) {
      var result = '';
      if (item.type == 'MsgVote') {
        return this.$t(`proposalsPage.${item.option}`);
      }

      if (item && (item.amount || item.amounts)) {
        if (item.amounts instanceof Array) {
          var list = item.amounts.map(one => {
            return this.bigNumTypeFormat(one.amount, one.denom);
          });
          result = list.join(',');
        } else if (item.amounts != undefined) {
          result = this.bigNumTypeFormat(item.amounts.amount, item.amounts.denom);
        } else {
          result = this.bigNumTypeFormat(item.amount, item.denom);
        }
        return result;
      }
    },
    txinfo(item) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/txDetail/${item.txhash}`;
      shell.openExternal(url);
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
