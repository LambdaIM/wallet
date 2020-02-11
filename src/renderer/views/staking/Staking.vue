<template>
  <div class="customer-container">
  <div class="tableContainer">
    <div v-if="isNaN(tbbday)!=true" class="Earningstips" >{{$t('stakinginfo.Pledge1tbbmining')}}，{{$t('stakinginfo.dayacquisition',[tbbday])}}，{{$t('stakinginfo.monthacquisition',[tbbmonth])}}，{{$t('stakinginfo.yearsacquisition',[tbbyear])}}</div>

       <Tabs >
        <TabPane :label="$t('staking.Mypledge')" >

          <Table v-if="mydelegationsList!=null"  size="large" :columns="columnsme" :data="mydelegationsList" >
              <template slot-scope="{ row, index }" slot="payment">
                      {{row.commission.rate|Percentformat}}
                    </template>
                    <template slot-scope="{ row, index }" slot="description">
                      {{row.description.moniker}}
                    </template>
                    <template slot-scope="{ row, index }" slot="vote">
                      {{row.tokens/pool.bonded_tokens|Percentformat}}
                    </template>
                    <template slot-scope="{ row, index }" slot="operator_address">
                      <router-link
                      :to="link(row.operator_address)"
                      class="item"
                    >{{row.operator_address}}</router-link>
                    </template>
                    <template slot-scope="{ row, index }" slot="shares">
                      {{myMypledge(row)}}
                    </template>
                    <template slot-scope="{ row, index }" slot="reward">
                      {{row.reward|Lambformat}}
                    </template>


          </Table>
          <Table v-else :loading="mydelegationsList==null">
          </Table>
        </TabPane>
        <TabPane  :label="$t('staking.Validatorlist')" >
          <Input v-model="searchkey"   search enter-button :placeholder="$t('staking.entername')" />
          <Table  v-if="validatorsList!=null"  size="large" :columns="columns" :data="searchlist" >

          <template slot-scope="{ row, index }" slot="payment">
            {{row.commission.rate|Percentformat}}
          </template>
          <template slot-scope="{ row, index }" slot="description">
            {{row.description.moniker}}
          </template>
          <template slot-scope="{ row, index }" slot="vote">
            {{row.tokens/pool.bonded_tokens|Percentformat}}
          </template>
          <template slot-scope="{ row, index }" slot="operator_address">
            <router-link
            :to="link(row.operator_address)"
            class="item"
          >{{row.operator_address}}</router-link>
          </template>

          </Table>
          <Table :loading="validatorsList==null"   v-else>
          </Table>
        </TabPane>
        <TabPane :label="$t('staking.Unpledge')" >

            <Table v-if="myUndelegationsList!=null"   size="large" :columns="uncolumns" :data="myUndelegationsList" >
              <template slot-scope="{ row, index }" slot="completion_time">
                {{row.completion_time|formatDate}}
              </template>
              <template slot-scope="{ row, index }" slot="initial_balance">
                {{row.initial_balance|Stoformat}}
              </template>


            </Table>
            <Table :loading="myUndelegationsList==null" v-else>
            </Table>

        </TabPane>
        <TabPane :label="$t('staking.ExplainTab')" >
          <ul v-if="dataParameters!=undefined" class="ulpanel">
            <li>{{$t('staking.Explain.unbonding_time')}}:{{(dataParameters.unbonding_time/(1000*1000*1000*60*60*24)).toFixed(2)}}{{$t('staking.Explain.unit')}}</li>
            <li>{{$t('staking.Explain.max_validators')}}:{{dataParameters.max_validators}}</li>
            <li v-if="dataParameters.bond_denom!=undefined">{{$t('staking.Explain.bond_denom')}}:{{dataParameters.bond_denom.substring(1)}}</li>
          </ul>


        </TabPane>
    </Tabs>
  </div>
  <br><br><br><br><br><br>

  </div>
</template>

<script>
import MyTable from '@/components/common/useful/Mytable.vue';



const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      columns: [
        {
          title: this.$t('staking.pledgeTable.Nickname'),
          key: 'description',
          slot: 'description'


        },
        {
          title: this.$t('staking.pledgeTable.PledgeAddress'),
          key: 'operator_address',
          slot: 'operator_address'
        },
        {
          title: this.$t('staking.pledgeTable.Commission'),
          key: 'payment',
          slot: 'payment'
        },
        {
          title: this.$t('staking.pledgeTable.VotingPower'),
          key: 'vote',
          slot: 'vote'
        },
        {
          title: this.$t('staking.pledgeTable.State'),
          key: 'status',
          render: (h, params) => {
            // console.log(params);
            if (params.row.status == '2') {
              this.stateType = 'md-checkmark';
            } else {
              this.stateType = 'md-close';
            }
            return h('Icon', {
              props: {
                type: `${this.stateType}`,
                size: 32
              }
            });
          }
        }
      ],
      columnsme: [
        {
          title: this.$t('staking.pledgeTable.Nickname'),
          key: 'description',
          slot: 'description'


        },
        {
          title: this.$t('staking.pledgeTable.Mypledge'),
          key: 'shares',
          slot: 'shares'

        },
        {
          title: this.$t('staking.pledgeTable.Myreward'),
          key: 'reward'

        },
        {
          title: this.$t('staking.pledgeTable.PledgeAddress'),
          key: 'operator_address',
          slot: 'operator_address'
        },
        {
          title: this.$t('staking.pledgeTable.Commission'),
          key: 'payment',
          slot: 'payment'
        },
        {
          title: this.$t('staking.pledgeTable.VotingPower'),
          key: 'vote',
          slot: 'vote'
        },
        {
          title: this.$t('staking.pledgeTable.State'),
          key: 'status',
          render: (h, params) => {
            // console.log(params);
            if (params.row.status == '2') {
              this.stateType = 'md-checkmark';
            } else {
              this.stateType = 'md-close';
            }
            return h('Icon', {
              props: {
                type: `${this.stateType}`,
                size: 32
              }
            });
          }
        }
      ],
      validatorsList: null,
      pool: null,
      mydelegationsList: null,
      myUndelegationsList: null,
      uncolumns: [{
        title: this.$t('staking.UnpledgeTable.PledgeAddress'),
        key: 'validator_address'
      },
      {
        title: this.$t('staking.UnpledgeTable.UntyingAddress'),
        key: 'delegator_address'
      },
      {
        title: this.$t('staking.UnpledgeTable.Blockheight'),
        key: 'creation_height'

      }, {
        title: this.$t('staking.UnpledgeTable.Amount'),
        key: 'initial_balance',
        slot: 'initial_balance'

      }, {
        title: this.$t('staking.UnpledgeTable.Completiontime'),
        key: 'completion_time',
        slot: 'completion_time'

      }


      ],
      dataParameters: {},
      searchkey: '',
      tbbreturnlamb: 0
    };
  },
  async mounted() {
    var r1 = await this.getListData();
    var r2 = await this.getmyListData();
    this.getmyUnListData();
    this.stakingParameters();
    this.TBBYield();
  },
  methods: {
    myMypledge(row) {
      return this.CalculationMypledge(row.shares, row.delegator_shares, row.tokens);
    },
    link(operator_address) {
      return '/stakinginfo/' + operator_address;
    },
    async getListData() {
      console.log('getListData');
      try {
        let res = await ipc.callMain('validatorsList', {});
        let poolres = await ipc.callMain('pool', {});
        // console.log(res);
        console.log(res);
        console.log(poolres);
        if (res.state) {
          this.$data.validatorsList = res.data;
        }
        if (poolres.state) {
          this.$data.pool = poolres.data;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    async getmyListData() {
      console.log('getListData');
      try {
        let res = await ipc.callMain('mydelegations', {
          operator_address: this.address
        });
        // let poolres= await ipc.callMain("pool", {});
        // console.log(res);
        console.log(res);
        // console.log(poolres)
        if (res.state) {
          this.$data.mydelegationsList = res.data || [];
          this.validatorsListForMe();
        }
        // if(poolres.state){
        //   this.$data.pool=poolres.data
        // }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    validatorsListForMe() {
      var list = [];
      this.$data.mydelegationsList.forEach(myitem => {
        this.$data.validatorsList.forEach(item => {
          if (item.operator_address == myitem.validator_address) {
            myitem = Object.assign({}, myitem, item);
            myitem.reward = '--';
            list.push(myitem);
          }
        });
      });
      this.$data.mydelegationsList = list;
      console.log(this.$data.mydelegationsList);
      this.getMyRewardsList();
    },
    getMyRewardsList() {
      this.$data.mydelegationsList.forEach(async item => {
        try {
          let res = await ipc.callMain('delegatorRewardsFromValidator', {
            operator_address: this.address,
            validatorAddr: item.validator_address
          });
          if (res.state) {
            console.log(res.data);
            item.reward = this.coinListFormart(res.data);
            // item.reward='---11111';
          }
        } catch (error) {
          console.log(error);
        }
      });
      console.log('==============');
      console.log(this.$data.mydelegationsList);
    },
    coinListFormart(list) {
      var result = [];
      list.forEach(item => {
        result.push(this.bigNumTypeFormat(item.amount, item.denom));
      });
      return result.join(',');
    },
    async getmyUnListData() {
      console.log('myUndelegations');
      try {
        let res = await ipc.callMain('myUndelegations', {
          operator_address: this.address
        });
        // let poolres= await ipc.callMain("pool", {});
        // console.log(res);
        console.log(res);
        // console.log(poolres)
        if (res.state && res.data instanceof Array) {
          var list = [];
          res.data.forEach(item => {
            item.entries.forEach(entrie => {
              var result = Object.assign({}, entrie, {
                validator_address: item.validator_address,
                delegator_address: item.delegator_address
              });
              list = list.concat(result);
            });
          });
          this.$data.myUndelegationsList = list;
        } else {
          this.$data.myUndelegationsList = [];
        }
        console.log('this.$data.myUndelegationsList');
        console.log(this.$data.myUndelegationsList);
      } catch (ex) {
        console.log(ex);
      }
    },
    async stakingParameters() {
      try {
        let res = await ipc.callMain('stakingParameters', {});
        if (res.state) {
          console.log('--');
          console.log(res);
          this.$data.dataParameters = res.data;
        }
      } catch (error) {

      }
    },
    async TBBYield() {
      try {
        console.log('TBBYield');
        let mintingres = await ipc.callMain('mintingAnnualprovisions', {});
        let poolres = await ipc.callMain('pool', {});
        let stakingres = await ipc.callMain('stakingParameters', {});

        if (mintingres.state && poolres.state && stakingres.state) {
          // https://github.com/LambdaIM/wallet/issues/181
          let { community_tax, base_proposer_reward, bonus_proposer_reward, pdp_reward } = mintingres.data.distribution;
          let { consensus_validator_fixed_commission_rate } = stakingres.data;
          community_tax = parseFloat(community_tax);
          base_proposer_reward = parseFloat(base_proposer_reward);
          bonus_proposer_reward = parseFloat(bonus_proposer_reward);
          pdp_reward = parseFloat(pdp_reward);
          consensus_validator_fixed_commission_rate = parseFloat(consensus_validator_fixed_commission_rate);

          var ProfitProportion = (1 - community_tax - base_proposer_reward - bonus_proposer_reward - pdp_reward) *
           (1 - consensus_validator_fixed_commission_rate);

          var NewlyLamb = mintingres.data.minting.replace(/\"/g, '');
          var { bonded_tokens } = poolres.data;
          var result = this.bigNum(1e6).div(bonded_tokens).times(NewlyLamb).times(ProfitProportion);
          console.log(result);
          this.$data.tbbreturnlamb = result;
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {
    MyTable
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getbalance;
    },
    searchlist() {
      if (this.$data.searchkey == '') {
        return this.$data.validatorsList;
      } else {
        var _this = this;
        var resultlist = [];
        this.$data.validatorsList.forEach(item => {
          if (item.description.moniker.toLowerCase().indexOf(_this.$data.searchkey.toLowerCase()) > -1) {
            resultlist.push(item);
          }
        });

        return resultlist;
      }
    },
    tbbday() {
      console.log(this.$data.tbbreturnlamb);
      // tbbreturnlamb/365|BlanceValueint
      return this.bigNum(this.$data.tbbreturnlamb).div(365).div(1e6).toFixed(2);
    },
    tbbmonth() {
      return this.bigNum(this.$data.tbbreturnlamb).div(12).div(1e6).toFixed(2);
    },
    tbbyear() {
      return this.bigNum(this.$data.tbbreturnlamb).div(1e6).toFixed(2);
    }



  }
};
</script>

<style lang="less" scoped>
.customer-container {
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 40px;
  }
}
.ulpanel{
  margin-left: 30px;
  li{
    font-size: 14px;
    line-height: 28px;
  }
}

.Earningstips{
font-size: 16px;

}


</style>
