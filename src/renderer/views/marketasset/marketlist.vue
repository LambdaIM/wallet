<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
          <div style="text-align: right;">
            <Button v-if="$role('conlist.Createmarket')" @click="openmarket" type="primary">{{$t('assetpage.Createanauthorizedmarket')}}</Button>
          </div>
          <br/>
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

                  <Button  v-if="$role('conlist.Buyingspace')"  class="smallbtn" @click="openPurchaseauthorizedspace(row)"  size="small">{{$t('Purchasespace.buy')}} </Button>

            </template>

                 </Table>
                 <AuthorizedpledgeDialog ref="AuthorizedpledgeModal"  />
                 <CreatemarketModalDialog ref="CreatemarketModal"/>

                 <AuthorizedminingDialog ref="AuthorizedminingModal" />
                 <AuthorizedpledgeDialog ref="AuthorizedpledgeModal"  />
                 <AuthorizedredeemDialog ref="AuthorizedredeemModal"/>
                 <AuthorizedDissolutionmarketDialog ref="DissolutionmarketModal"/>
                 <MinerActivateDialog ref="ActivateDialogModal" />
                 <Purchaseauthorizedspace ref="PurchaseauthorizedspaceModal" />
                 <MinerDeactivateDialog ref="DeactivateDialogModal" />
        </div>
        <br/><br/><br/><br/>
    </div>
</div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';


import CreatemarketModalDialog from '@/views/Dialog/CreatemarketModal.vue';

import AuthorizedpledgeDialog from '@/views/Dialog/Authorizedpledge.vue';
import AuthorizedminingDialog from '@/views/Dialog/Authorizedmining.vue';
import AuthorizedredeemDialog from '@/views/Dialog/Authorizedredeem.vue';

import AuthorizedDissolutionmarketDialog from '@/views/Dialog/AuthorizedDissolutionmarket.vue';
import MinerActivateDialog from '@/views/Dialog/MinerActivate.vue';
import MinerDeactivateDialog from '@/views/Dialog/MinerDeactivate.vue';

import Purchaseauthorizedspace from '@/views/Dialog/Purchaseauthorizedspace.vue';
const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
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
      MinerRewards: null,
      incomelist: [],
      pledgelist: []

    };
  },
  mounted() {
    this.getmarketAll();
    this.getincomelist();
    this.getpledgelist();
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getmarketAll();
      this.getincomelist();
      this.getpledgelist();
    });
    this.Interval = setInterval(() => {
      this.getmarketAll();
      this.getincomelist();
      this.getpledgelist();
    }, 1000 * 15);
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  components: {
    AuthorizedpledgeDialog,
    CreatemarketModalDialog,
    AuthorizedminingDialog,
    AuthorizedredeemDialog,
    AuthorizedDissolutionmarketDialog,
    MinerActivateDialog,
    MinerDeactivateDialog,
    Purchaseauthorizedspace
  },
  methods: {
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
    openmarket() {
      this.$refs.CreatemarketModal.open();
    },
    openPurchaseauthorizedspace(data) {
      this.$refs.PurchaseauthorizedspaceModal.open(data);
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
    denomFormart(denom) {
      return denom.substr(1);
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
