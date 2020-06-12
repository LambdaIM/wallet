
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <div>
              <Button v-if="$role('conlist.Createmarket')" @click="openmarket" type="primary">创建授权市场</Button>
              <Button v-if="$role('conlist.Createassets')" @click="openassert" type="primary"> 创建资产 </Button>


        </div>
        <br/>
          <Tabs value="name1">
            <TabPane label="资产" name="name1">
                      <Table :columns="columnsToken" :data="coinList">


            <template slot-scope="{ row, index }" slot="amount">

                {{bigNumTypeFormat(row.amount,row.denom)}}

            </template>
            <template slot-scope="{ row, index }" slot="denom">
              <a @click="openLinkassert(row.denom)" >
              {{denomFormart(row.denom)}}
              </a>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button class="smallbtn" @click="cointransaction(row)" type="primary" size="small">{{$t('home.Token.Transfer')}}</Button>

              <Button class="smallbtn" v-if="row.denom=='ulamb'" @click="openAssert(row)" size="small">{{$t('home.Token.Exchange')}}</Button>


               <Dropdown v-if="row.denom !='ulamb'&&row.denom !='utbb'  "   class="smallbtn2">
                    <a  href="javascript:void(0)">
                        更多
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem>增发资产</DropdownItem>
                        <DropdownItem>锁定资产</DropdownItem>
                        <DropdownItem>解锁资产</DropdownItem>
                        <DropdownItem divided>销毁资产</DropdownItem>
                        <DropdownItem divided>毁灭资产</DropdownItem>
                    </DropdownMenu>
                </Dropdown>


            </template>



          </Table>
            </TabPane>
            <TabPane label="授权市场" name="name2">
                 <Table :columns="marketcolumns" :data="marketdata">
                    <!-- <template slot-scope="{ row, index }" slot="amount">
              {{bigNumTypeFormat(row.amount,row.denom)}}
            </template> -->
            <template slot-scope="{ row, index }" slot="denom">
              {{denomFormart(row.assetName)}}
            </template>

            <template slot-scope="{ row, index }" slot="pledgeAsset">
              {{findpledge(row.assetName)}}
            </template>

            <template slot-scope="{ row, index }" slot="miningSize">
              {{findminingSize(row.assetName)}}
            </template>


            <template slot-scope="{ row, index }" slot="marketName">
              <a @click="openLinkmarket(row.marketName)"> {{row.marketName}} </a>
            </template>


            <template slot-scope="{ row, index }" slot="marketName">
              <a @click="openLinkmarket(row.marketName)"> {{row.marketName}} </a>
            </template>

            <template slot-scope="{ row, index }" slot="power">
                    {{findminingPower(row.assetName)}}
            </template>



                         <template slot-scope="{ row, index }" slot="pledge">

                  <Button v-if="$role('conlist.pledge')" class="smallbtn" @click="openAuthorizedpledge(row)" size="small">质押</Button>

                  <Button v-if="$role('conlist.redeem')" class="smallbtn" @click="openAuthorizedredeem(row)" size="small">赎回</Button>

                  <!-- <Button v-if="$role('conlist.Withdrawal')" class="smallbtn" size="small">提取收益</Button> -->
                  <Button v-if="$role('conlist.authorization')" class="smallbtn" @click="openAuthorizedmining(row)" size="small">授权</Button>
                  <Button type="error" v-if="$role('conlist.authorization')" @click="openDissolutionmarket(row)" class="smallbtn"  size="small">解散市场</Button>

            </template>

                 </Table>
            </TabPane>
            <TabPane label="赎回记录" name="name4">
                <Table :columns="redeemcolumns" :data="redeemdata">
                  <template slot-scope="{ row, index }" slot="completionTime">
                    {{row.completionTime|blockFormatDate}}
                  </template>
                </Table>

            </TabPane>

            <TabPane label="挖矿说明" name="name3">

              <ul style="margin-left: 10px;">
                <li>1、在挖矿向导中创建矿工</li>
                <li>2、在资产中使用授权市场支持的资产在市场中质押</li>
              </ul>

            </TabPane>


        </Tabs>



      </div>
      <SendModelDialog ref="SendModelDialog" />
      <AssetlModalDialog ref="AssetlModalDialog" />
      <CreatemarketModalDialog ref="CreatemarketModal"/>
      <CreateAssetModalDialog ref="CreateAssetModal" />

      <AuthorizedminingDialog ref="AuthorizedminingModal" />
      <AuthorizedpledgeDialog ref="AuthorizedpledgeModal"  />

      <AuthorizedredeemDialog ref="AuthorizedredeemModal"/>

      <AuthorizedDissolutionmarketDialog ref="DissolutionmarketModal"/>



  </div>
</template>
<script>
import SendModelDialog from '@/views/Dialog/sendModel.vue';
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
import _ from 'underscore';
import eventhub from '../../common/js/event.js';


import CreatemarketModalDialog from '@/views/Dialog/CreatemarketModal.vue';
import CreateAssetModalDialog from '@/views/Dialog/CreateAssetModal.vue';
import AuthorizedminingDialog from '@/views/Dialog/Authorizedmining.vue';


import AuthorizedpledgeDialog from '@/views/Dialog/Authorizedpledge.vue';
import AuthorizedredeemDialog from '@/views/Dialog/Authorizedredeem.vue';
import { DAEMON_CONFIG } from '../../../config.js';

import AuthorizedDissolutionmarketDialog from '@/views/Dialog/AuthorizedDissolutionmarket.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');



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
          title: '余额',
          key: 'amount',
          slot: 'amount'
        },
        {
          title: this.$t('home.Token.operation'),
          key: 'action',
          slot: 'action'
        },
        {
          title: '初始化发行量',
          key: 'action'
        },
        {
          title: '增发类型',
          key: 'action'
        },
        {
          title: '每块高增发量',
          key: 'action'
        },
        {
          title: '增发块高周期',
          key: 'action'
        }



      ],
      allassert: [],
      marketcolumns: [
        {
          title: '市场名称',
          key: 'marketName',
          slot: 'marketName'
        },
        {
          title: '资产名称',
          key: 'assetName',
          slot: 'denom'
        },

        {
          title: '兑换比例',
          key: 'exchangeRatio'
        },
        {
          title: '质押金额',
          key: 'pledgeAsset',
          slot: 'pledgeAsset'
        },
        {
          title: '挖矿空间(GB)',
          key: 'miningSize',
          slot: 'miningSize'
        },
        {
          title: '提交的算力',
          key: 'power',
          slot: 'power'
        },
        {
          title: '挖矿收益',
          key: 'address'
        },
        {
          title: '操作',
          key: 'pledge',
          slot: 'pledge'
        }
      ],
      marketdata: [

      ],
      pledgelist: null,
      MinerRewards: null,
      redeemcolumns: [
        {
          title: '资产名称',
          key: 'assetName'
        },
        {
          title: '赎回金额',
          key: 'cost'
        },
        {
          title: '完成时间',
          key: 'completionTime',
          slot: 'completionTime'
        }
      ],
      redeemdata: []
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
    this.getmarketAll();
    this.getincomelist();
    this.getpledgelist();
    this.getMinerRewards();
    this.getredeemlist();
  },
  components: {
    SendModelDialog,
    AssetlModalDialog,
    CreatemarketModalDialog,
    CreateAssetModalDialog,
    AuthorizedminingDialog,
    AuthorizedpledgeDialog,
    AuthorizedredeemDialog,
    AuthorizedDissolutionmarketDialog
  },
  methods: {
    denomFormart(denom) {
      return denom.substr(1);
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
    async  getmarketAll() {
      // assetAll
      try {
        let res = await ipc.callMain('Authorizedmarketlist', {});
        if (res.state) {
          this.$data.marketdata = res.data.data || [];
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async  getincomelist() {
      // assetAll
      try {
        let res = await ipc.callMain('Authorizedincomelist', {});
        if (res.state) {
          this.$data.incomelist = res.data || [];
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async  getpledgelist() {
      console.log('AuthorizedMarketlist');
      try {
        let res = await ipc.callMain('Authorizedpledgelist', {});
        if (res.state) {
          this.$data.redeemdata = res.data.data || [];
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async  getredeemlist() {
      // assetAll
      console.log('Authorizedredeemlist');
      try {
        let res = await ipc.callMain('Authorizedredeemlist', {});
        if (res.state) {
          this.$data.pledgelist = res.data.data || [];
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
    },
    openAuthorizedmining(data) {
      this.$refs.AuthorizedminingModal.open(data);
    },
    openAuthorizedpledge(data) {
      this.$refs.AuthorizedpledgeModal.open(data);
    },
    openAuthorizedredeem(data) {
      this.$refs.AuthorizedredeemModal.open(data);
    },
    openDissolutionmarket(data) {
      this.$refs.DissolutionmarketModal.open(data);
    },
    openLinkassert(name) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/assetDetail/${name}`;
      shell.openExternal(url);
    },
    openLinkmarket(name) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/assetMarket/${name}/authorize/1`;
      shell.openExternal(url);
    },
    findpledge(name) {
      var result = '';
      var _this = this;
      if (this.$data.pledgelist == null || this.$data.pledgelist.error != undefined) {
        return;
      }
      this.$data.pledgelist.assetSet.forEach(item => {
        if (item.assetName == name) {
          result = _this.toBigNumTonum(item.pledgeAsset);
        }
      });
      return result;
    },
    findminingSize(name) {
      var result = '';
      var _this = this;
      if (this.$data.pledgelist == null || this.$data.pledgelist.error != undefined) {
        return;
      }
      this.$data.pledgelist.assetSet.forEach(item => {
        if (item.assetName == name) {
          result = parseFloat(item.miningSize).toFixed(3);
        }
      });
      return result;
    },
    findminingPower(name) {
      var result = '';
      var _this = this;
      if (this.$data.pledgelist == null || this.$data.pledgelist.error != undefined) {
        return;
      }
      this.$data.pledgelist.assetSet.forEach(item => {
        if (item.assetName == name) {
          result = parseFloat(item.power).toFixed(3);
        }
      });
      return result;
    },
    async getMinerRewards() {
      console.log('getMinerRewards');
      try {
        let res = await ipc.callMain('MinerRewards', {});
        if (res.state) {
          var list = res.data['miner_rewards'] || [];
          var result = '';
          // list.forEach(item => {
          //   if (item.denom == 'ulamb') {
          //     result = item.amount;
          //   }
          // });
          this.$data.MinerRewards = list;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
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

.smallbtn{
  margin-bottom: 10px;
  margin-right: 10px;
  margin-top: 10px;
  width: 90%

}

.smallbtn2{
  margin-bottom: 10px;
  margin-right: 10px;
  margin-top: 10px;


}

</style>
