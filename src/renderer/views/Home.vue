<template>
  <div class="container">

    <p class="balance">
      {{$t('home.Balance')}}: {{balance|Lambformat}}
      <!-- {{$t('home.pledge')}}: {{DelegationValue|Stoformat}} -->
      {{$t('home.Reward')}} :{{DistributionReward|Lambformat}}
      <span v-if="distributionBalance > 0">
      {{$t('home.Validatorprofit')}} :{{distributionBalance|Lambformat}}
      </span>

    </p>

    <div style="width:94%;    margin: 0 auto;">
      <Tabs >
        <TabPane :label="$t('home.Latest_Transaction')" >
          <TxTable :txData="data" :loading="loading" />
          <!-- <Table size="large" :loading="loading" :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="from">
              <Poptip word-wrap trigger="hover" width="200" :content="row.from">
                <span class="etc">{{row.from}}</span>
              </Poptip>
            </template>
            <template slot-scope="{ row, index }" slot="to">
              <Poptip v-if="row.to!='--'" word-wrap trigger="hover" width="200" :content="row.to">
                <span class="etc">{{row.to}}</span>
              </Poptip>
              <span v-else>{{row.to}}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                @click="toDetail(row,index)"
              >{{ $t("home.View_Detail") }}</Button>

            </template>
            <template slot-scope="{ row, index }" slot="txType">
              {{$t(`txType.${row.txType}`)}}
            </template>



          </Table> -->
        </TabPane>
        <TabPane :label="$t('home.token')">
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
        <TabPane :label="$t('home.Latest_Transaction_local')">
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
        </TabPane>
        <span slot="extra">
          <Button @click="openSend()">
            {{$t('home.Transfer')}}
            <Icon type="md-swap"></Icon>
          </Button>


          <Dropdown @on-click="openwithdrawalModal" style="margin-left:20px">
              <Button  >
                  {{$t('home.Withdraw')}}
                  <Icon type="md-arrow-down" />
                </Button>
              <DropdownMenu slot="list">
                  <DropdownItem  name="Withdraw">{{$t('home.Withdraw')}}</DropdownItem>
                  <DropdownItem  name="Distribution">{{$t('home.Withdrawprofit')}}</DropdownItem>


              </DropdownMenu>
          </Dropdown>
&nbsp; &nbsp;

        </span>
      </Tabs>
    </div>

    <div class="tc">
      <!-- <Page :total="sum" show-elevator @on-change="changePage"></Page> -->
    </div>
    <div>
      <!-- <Button to="/api">API 测试</Button> -->
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>

    <SendModelDialog ref="SendModelDialog" />
    <WithdrawalModalDialog ref="WithdrawalModalDialog" />
    <AssetlModalDialog ref="AssetlModalDialog" />
    <DistributionModal ref="DistributionModal" />
  </div>
</template>



<script>

import MyTable from '@/components/common/useful/Mytable.vue';
import { DAEMON_CONFIG } from '../../config.js';

import eventhub from '../common/js/event.js';

import SendModelDialog from '@/views/Dialog/sendModel.vue';
import WithdrawalModalDialog from '@/views/Dialog/withdrawalModal.vue';
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
import TxTable from '@/components/txTable/index.vue';
import txFormat from '@/common/js/txFormat.js';
import DistributionModal from '@/views/Dialog/distributionModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

const { shell } = require('electron');

export default {
  data() {
    return {
      stateType: null,

      address: '',
      sendModal: false,
      data: null,
      accountinfo: null,
      Fromvalue: '',
      Tovalue: '',
      LAMBvalue: '',
      confirmModal: false,
      passwordModal: false,
      walletPassword: null,
      txlist: [],
      Interval: null,
      transactiondata: null,
      txType: null,
      sum: null,
      pageNumber: 1,
      loading: true,


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
      ],
      withdrawalModal: false,
      AssetlModal: false,
      AssetLAMBvalue: '',
      AssetSTOvalue: '',
      assetConfirmModal: false,
      exchangesStatus: 'true',
      distributionBalance: null,
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
  components: {
    MyTable,
    SendModelDialog,
    WithdrawalModalDialog,
    AssetlModalDialog,
    TxTable,
    DistributionModal
  },
  computed: {
    amount: value => {
      console.log(value);
    },
    balance: function() {
      return this.$store.getters.getblance;
    },
    DistributionReward: function() {
      return this.$store.getters.getDistributionReward;
    },
    coinList: function() {
      return this.$store.getters.getcoinList;
    },
    DelegationValue: function() {
      return this.$store.getters.getDelegation;
    }
  },
  async mounted() {
    this.address = await this.WalletBasicinfo();


    this.transactionList();
    this.validatorDistribution();
    this.getlocaltxlist();

    this.Interval = setInterval(() => {
      this.transactionList();
      this.validatorDistribution();
      this.getlocaltxlist();
    }, 1000 * 15);

    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.transactionList();
      this.validatorDistribution();
      this.getlocaltxlist();
    });

    // eventhub.$on('TxType', data => {
    //   console.log('TxType', data);
    //   this.$data.txType = data;

    //   this.transactionList();
    // });

    // var num = this.bigNum(0);
    // console.log(num);
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
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
      // console.log(value);
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/txDetail/${item.txhash}`;
      shell.openExternal(url);
    },
    openwithdrawalModal(name) {
      if (name == 'Withdraw') {
        this.$refs.WithdrawalModalDialog.open();
      } else {
        this.$refs.DistributionModal.open();
      }
    },
    denomFormart(denom) {
      //  return  denom..substr(1).toUpperCase()
      return denom.substr(1).toUpperCase();
    },
    toDetail(row, index) {
      console.log(row, index);

      // console.log(id);
      this.$router.push(`/detail/${row.txHash}`);
    },
    openSend() {
      // this.sendModal = true;

      this.$refs.SendModelDialog.open();
    },
    openAssert(row) {
      // this.$data.AssetlModal=true;
      this.$refs.AssetlModalDialog.open(row.amount, row.denom);
    },
    cointransaction(row) {
      this.$refs.SendModelDialog.open(row.amount, row.denom);
    },
    async transactionList(pagenum) {
      console.log('transactionList');


      // this.$data.loading=false;
      try {
        // txType: txPledgeNew
        let param = {
          pageNum: this.$data.pageNumber,
          showNum: 10
        };
        if (this.txType != null || this.txType != '') {
          param.txType = this.txType;
        }

        let res = await ipc.callMain('transactionList', param);
        // console.log(res);
        if (!res.state) return;
        let tempData = res.data.data;
        this.$data.data = null;
        this.data = [];

        if (tempData) {
          console.log(tempData);
          tempData.forEach(item => {
            if (item.error == undefined) {
              this.data.push(txFormat(item, this));
            } else {
              console.log('读取交易记录失败');
            }
          });
        }
        this.data.sort((item1, item2) => {
          return item2.timestampSort - item1.timestampSort;
        });
        this.$data.loading = false;
      } catch (ex) {
        console.log(ex);
        this.data = [];
        this.$data.loading = false;
      }
    },
    async WalletBasicinfo() {
      var result = null;
      try {
        let res = await ipc.callMain('defaultWalletBasicinfo', {});
        console.log(res);
        if (!res.state) return;
        result = res.data.address;
      } catch (ex) {}

      return result;
    },
    async changePage(pageNumber) {
      this.$data.pageNumber = pageNumber;
      this.transactionList();
    },
    openvalidator(value) {
      // console.log(value);
      let url = DAEMON_CONFIG.pledgeurl;
      shell.openExternal(url);
    },
    async validatorDistribution() {
      try {
        this.$store.dispatch('setDistribution', 0);
        let res = await ipc.callMain('DistributionInformation', {});
        console.log(res);
        if (!res.state) return;
        console.log(res);
        if (res.data && res.data.val_commission) {
          res.data.val_commission.forEach(item => {
            if (item.denom === 'ulamb') {
              this.$data.distributionBalance = item.amount;
              this.$store.dispatch('setDistribution', item.amount);
            }
          });
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async getlocaltxlist() {
      let res = await ipc.callMain('localtxlist', {});
      // console.log(res);
      if (!res.state) return;
      // console.log(res);
      this.$data.localTxList = res.data;
    }


  }
};
</script>

<style lang="less" scoped>
.container {
    padding-bottom: 100px;
  .balance {
    width: 96%;
    margin: 0 auto;
    margin-top: 30px;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .account-info-container {
    width: 100%;
    height: 90px;
    .account-info-wrapper {
      width: 96%;
      height: 100%;
      border-bottom: 1px solid transparent;
      border-image: linear-gradient(to right, #339cae, #9167d3);
      border-image-slice: 10;
      margin: 0 auto;
      .account-item {
        height: 100%;
        position: relative;
        .item-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .title {
            font-size: 18px;
            color: #999999;
            text-align: center;
            white-space: nowrap;
          }
          .value {
            margin-top: 10px;
            font-size: 16px;
            text-align: center;
            color: #67a7db;
          }
        }
      }
    }
  }
  .mytable-container {
    padding-bottom: 30px;
    .operation-wrapper {
      height: 40px;
      .operation {
        width: 100%;
        height: 100%;
        position: relative;
        .search-wrapper {
          position: absolute;
          left: 28%;
        }
        .repay-wrapper {
          position: absolute;
          left: 70%;
          top: 25%;
        }
        .borrow-wrapper {
          position: absolute;
          left: 83%;
          top: 25%;
        }
        .send-wrapper {
          position: absolute;
          right: 0;
          top: 25%;
        }
      }
    }
  }
  .table-content-container {
    width: 100%;
    .table-content-wrapper {
      width: 96%;
      margin: 0 auto;
    }
  }
}
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}

</style>
