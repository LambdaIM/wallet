
<template>
  <div class="customer-container">
      <div class="tableContainer">
        <div>
              <Button v-if="$role('conlist.Createmarket')" @click="openmarket" type="primary">{{$t('assetpage.Createanauthorizedmarket')}}</Button>
              <Button v-if="$role('conlist.Createassets')" @click="openassert" type="primary">{{$t('assetpage.Createassets')}}</Button>


        </div>
        <br/>
          <Tabs value="name1">
            <TabPane :label="$t('assetpage.assets')" name="name1">
                      <Table   :columns="columnsToken" :data="coinList">


            <template slot-scope="{ row, index }" slot="amount">
              <!-- {{row}} -->

                {{bigNumTypeFormat(row.amount,row.asset.denom)}}

            </template>

            <template slot-scope="{ row, index }" slot="denom">
              <a v-if="row.asset.denom!='ulamb'&&row.asset.denom!='utbb'"  @click="openLinkassert(row.asset.denom)" >
                {{denomFormart(row.asset.denom)}}
              </a>
              <span v-else>
                {{denomFormart(row.asset.denom)}}
              </span>
            </template>

            <template slot-scope="{ row, index }" slot="assetamount">
              {{bigNumTypeFormat(row.asset.amount,row.asset.denom)}}
            </template>


            <template slot-scope="{ row, index }" slot="mint_type">
              {{typeName(row.mint_type)}}
            </template>

            <template  slot-scope="{ row, index }" slot="total_supply">
              <span v-if="row.total_supply">
              {{bigNumTypeFormat(row.total_supply.amount,row.total_supply.denom)}}
              </span>
            </template>
            <template  slot-scope="{ row, index }" slot="inflation">
              <span v-if="row.inflation">
              {{bigNumTypeFormat(row.inflation,row.asset.denom)}}
              </span>
            </template>



            <template slot-scope="{ row, index }" slot="power">
                    {{findminingPower(row.assetName)}}
            </template>

            <template slot-scope="{ row, index }" slot="adjust_rate">
              <span v-if="row.adjust_rate">
                    {{parseFloat(row.adjust_rate)}}
              </span>
            </template>



            <template slot-scope="{ row, index }" slot="action">
              <Button class="smallbtn" @click="cointransaction(row)" type="primary" size="small">{{$t('home.Token.Transfer')}}</Button>

              <Button class="smallbtn" v-if="row.asset.denom=='ulamb'" @click="openAssert(row)" size="small">{{$t('home.Token.Exchange')}}</Button>

<!--
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
                </Dropdown> -->


            </template>



          </Table>
            </TabPane>
            <TabPane :label="$t('assetpage.authorizedMarket')" name="name2">
                 <Table  :columns="marketcolumns" :data="marketdata">
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
              <a @click="openLinkmarket(row.assetName)"> {{row.marketName}} </a>
            </template>


            <template slot-scope="{ row, index }" slot="pledgeAsset">
              {{findminingpledgeAsset(row.assetName)}}
            </template>

            <template slot-scope="{ row, index }" slot="power">
                    {{findminingPower(row.assetName)}}
            </template>

            <template slot-scope="{ row, index }" slot="Miningrevenue">
                    {{assertMinerReward(row.assetName)}}
            </template>



                         <template slot-scope="{ row, index }" slot="pledge">

                  <Button v-if="$role('conlist.pledge')" class="smallbtn" @click="openAuthorizedpledge(row)" size="small">{{$t('assetpage.btn.Pledge')}}</Button>

                  <Button v-if="$role('conlist.redeem')" class="smallbtn" @click="openAuthorizedredeem(row)" size="small">{{$t('assetpage.btn.redemption')}}</Button>

                  <!-- <Button v-if="$role('conlist.Withdrawal')" class="smallbtn" size="small">提取收益</Button> -->
                  <Button v-if="$role('conlist.authorization')" class="smallbtn" @click="openAuthorizedmining(row)" size="small">{{$t('assetpage.btn.Authorize')}}</Button>
                  <Button type="error" v-if="$role('conlist.authorization')" @click="openDissolutionmarket(row)" class="smallbtn"  size="small">{{$t('assetpage.btn.Dissolvethemarket')}}</Button>

                  <Button v-if="$role('conlist.DeactivateMiner')" class="smallbtn" @click="openMinerDeactivateDialog(row)"  size="small">{{$t('assetpage.DeactivateMiner')}}</Button>
                  <Button v-if="$role('conlist.ActivateMiner')" class="smallbtn" @click="openMinerActivateDialog(row)"  size="small">{{$t('assetpage.ActivateMiner')}} </Button>

            </template>

                 </Table>
            </TabPane>
            <TabPane :label="$t('assetpage.assetsinredemption')" name="name4">
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

            </TabPane>

            <TabPane :label="$t('assetpage.miningdescription')" name="name3">

              <ul style="margin-left: 10px;">
                <li>{{$t('assetpage.Mininginstructions.tip1')}}</li>
                <li>{{$t('assetpage.Mininginstructions.tip2')}}</li>
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

      <MinerActivateDialog ref="ActivateDialogModal" />
      <MinerDeactivateDialog ref="DeactivateDialogModal" />



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

import MinerActivateDialog from '@/views/Dialog/MinerActivate.vue';
import MinerDeactivateDialog from '@/views/Dialog/MinerDeactivate.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');

export default {
  data() {
    return {

      columnsToken: [
        {
          title: this.$t('assetpage.assetlist.fullname'),
          key: 'name'
        },
        {
          title: this.$t('home.Token.name'),
          key: 'denom',
          slot: 'denom'
        },
        {
          title: this.$t('assetpage.assetlist.balance'),
          key: 'amount',
          slot: 'amount'
        },
        {
          title: this.$t('home.Token.operation'),
          key: 'action',
          slot: 'action'
        },
        {
          title: this.$t('assetpage.assetlist.Initialcirculation'),
          key: 'assetamount',
          slot: 'assetamount'
        },
        {
          title: this.$t('assetpage.assetlist.Issuingtype'),
          key: 'mint_type',
          slot: 'mint_type'
        },
        {
          title: this.$t('assetpage.assetlist.Totalissuance'),
          key: 'total_supply',
          slot: 'total_supply'
        },
        {
          title: this.$t('assetpage.assetlist.Issuanceperblock'),
          key: 'inflation',
          slot: 'inflation'
        }
        // {
        //   title: '减产系数',
        //   key: 'adjust_rate',
        //   slot: 'adjust_rate'
        // },
        // {
        //   title: '最大减产次数',
        //   key: 'max_adjust_count'
        // },
        // {
        //   title: '初次增发块高',
        //   key: 'genesis_height'
        // }



      ],
      allassert: [],
      marketcolumns: [
        {
          title: this.$t('assetpage.marketlist.Marketname'),
          key: 'marketName',
          slot: 'marketName'
        },
        {
          title: this.$t('assetpage.marketlist.AssetName'),
          key: 'assetName',
          slot: 'denom'
        },

        {
          title: this.$t('assetpage.marketlist.Exchangeratio'),
          key: 'exchangeRatio'
        },
        {
          title: this.$t('assetpage.marketlist.Pledgeddeposit'),
          key: 'pledgeAsset',
          slot: 'pledgeAsset'
        },
        {
          title: this.$t('assetpage.marketlist.Miningspace'),
          key: 'miningSize',
          slot: 'miningSize'
        },
        {
          title: this.$t('assetpage.marketlist.Hashsubmitted'),
          key: 'power',
          slot: 'power'
        },
        {
          title: this.$t('assetpage.marketlist.Miningrevenue'),
          key: 'Miningrevenue',
          slot: 'Miningrevenue'
        },
        {
          title: this.$t('assetpage.marketlist.operating'),
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
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  async mounted() {
    this.getAssertAll();
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getAssertAll();
      this.getmarketAll();
      this.getincomelist();
      this.getpledgelist();
      this.getMinerRewards();
      this.getredeemlist();
    });
    this.Interval = setInterval(() => {
      this.getAssertAll();
      this.getmarketAll();
      this.getincomelist();
      this.getpledgelist();
      this.getMinerRewards();
      this.getredeemlist();
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
    AuthorizedDissolutionmarketDialog,
    MinerActivateDialog,
    MinerDeactivateDialog
  },
  methods: {
    denomFormart(denom) {
      return denom.substr(1);
    },
    openAssert(row) {
      this.$refs.AssetlModalDialog.open(row.amount, row.denom);
    },
    cointransaction(row) {
      this.$refs.SendModelDialog.open(row.amount || '0', row.asset.denom);
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
          this.$data.pledgelist = res.data.data || [];
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
        if (res.state && res.data.data.error == undefined) {
          this.$data.redeemdata = res.data.data || [];
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
    openMinerDeactivateDialog(data) {
      this.$refs.DeactivateDialogModal.open(data);
    },
    openMinerActivateDialog(data) {
      this.$refs.ActivateDialogModal.open(data);
    },
    openLinkassert(name) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/assetDetail/${name}`;
      shell.openExternal(url);
    },
    openLinkmarket(name) {
      var explorer = DAEMON_CONFIG.explore();
      let url = `${explorer}#/assetMarket/${name}`;
      shell.openExternal(url);
    },
    findpledge(name) {
      var result = '';
      var _this = this;
      if (this.$data.pledgelist == null || this.$data.pledgelist.assetSet == null || this.$data.pledgelist.error != undefined) {
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
      if (this.$data.pledgelist == null || this.$data.pledgelist.assetSet == null || this.$data.pledgelist.error != undefined) {
        return;
      }
      this.$data.pledgelist.assetSet.forEach(item => {
        if (item.assetName == name) {
          result = parseFloat(item.miningSize).toFixed(0);
        }
      });
      return result;
    },
    findminingPower(name) {
      var result = '';
      var _this = this;
      if (this.$data.pledgelist == null || this.$data.pledgelist.assetSet == null || this.$data.pledgelist.error != undefined) {
        return;
      }
      this.$data.pledgelist.assetSet.forEach(item => {
        if (item.assetName == name) {
          result = parseFloat(item.power).toFixed(3);
        }
      });
      return result;
    },
    findminingpledgeAsset(name) {
      var result = '';
      var _this = this;
      if (this.$data.pledgelist == null || this.$data.pledgelist.assetSet == null || this.$data.pledgelist.error != undefined) {
        return;
      }
      this.$data.pledgelist.assetSet.forEach(item => {
        if (item.assetName == name) {
          result = _this.toBigNumTonum(item.pledgeAsset, 3);
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
    },
    typeName(item) {
      if (item == 1) {
        return this.$t('assetpage.Non-issueable');
      } else if (item == 2) {
        return this.$t('assetpage.One-timeadditionalissuance');
      } else if (item == 3) {
        return this.$t('assetpage.Additionalmining');
      }
    },
    assertMinerReward(assertname) {
      var result = '';
      var _this = this;
      if (this.$data.MinerRewards) {
        this.$data.MinerRewards.forEach(item => {
          if (item.denom == assertname) {
            result = _this.bigNumTypeFormat(item.amount, assertname);
          }
        });
      }

      return result;
    }


  },
  computed: {
    coinList: function() {
      if (this.$data.allassert.length < 1) {
        return [];
      }
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



      var _this = this;
      mycoinList.forEach(item => {
        var haveitem = _.find(_this.$data.allassert, function(assert) {
          if (assert.asset.denom == item.denom) {
            return true;
          } else {
            return false;
          }
        });

        if (haveitem == undefined || haveitem.length == 0) {
          otherList.push({
            amount: item.amount,
            name: item.denom,
            asset: {
              denom: item.denom
            }
          });
        } else {
          haveitem.amount = item.amount;
        }
      });


      var listneedtosort = _this.$data.allassert.concat(otherList);
      // var listneedtosort = otherList;

      listneedtosort.forEach(item => {
        if (item.asset.denom == 'ulamb') {
          item.sort = 1;
        } else if (item.asset.denom == 'utbb') {
          item.sort = 0;
        } else if (item.amount == undefined) {
          item.sort = -2;
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
  width: 100%

}

.smallbtn2{
  margin-bottom: 10px;
  margin-right: 10px;
  margin-top: 10px;


}

</style>
