<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
        <div class="btnholder">
            <Button class="btn" @click="openDeposit" type="primary" >{{$t('poolmarketinfo.depositinfo.Deposit')}}</Button>

            <Button class="btn" @click="opencancelpledge" type="primary">{{$t('poolmarketinfo.depositinfo.withdraw')}}</Button>


            <Button class="btn" @click="openwithdrawalReward" type="primary">{{$t('poolmarketinfo.depositinfo.Withdrawalincome')}}</Button>
          </div>
         <Table :columns="columns1" :data="supplies">
           <template slot-scope="{ row, index }" slot="amount">

              {{bigNumTypeFormat(row.amount.amount,row.amount.denom)}}
            </template>
            <template slot-scope="{ row, index }" slot="reward">
              {{bigNumTypeFormat(row.reward.amount,row.reward.denom)}}
            </template>
         </Table>

        </div>
    </div>
    <DepositModel  ref="depositModel" />
    <Cancelpledge  ref="cancelpledge" />
    <WithdrawalReward ref="withdrawalReward"  />
</div>
</template>
<script>
import DepositModel from '@/views/Dialog/loan/DepositModel.vue';
import Cancelpledge from '@/views/Dialog/loan/Cancelpledge.vue';

import WithdrawalReward from '@/views/Dialog/loan/WithdrawalReward.vue';
import eventhub from '../../common/js/event.js';

const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      columns1: [
        {
          title: this.$t('poolmarketinfo.depositinfo.Myassets'),
          key: 'amount',
          slot: 'amount'
        },
        {
          title: this.$t('poolmarketinfo.depositinfo.Undrawnincome'),
          key: 'reward',
          slot: 'reward'
        }
      ],
      supplies: [

      ]
    };
  },
  components: {
    DepositModel,
    Cancelpledge,
    WithdrawalReward
  },
  mounted() {
    this.getmydata();
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getmydata();
    });
  },
  methods: {
    async getmydata() {
      // loanmarketsupplierreward
      try {
        // var loanmarket = this.$store.getters.getselectloanmarket;

        let res = await ipc.callMain('loanmarketsupplierreward', {
          islatest_reward: true
        });
        if (res.state) {
          console.log(res.data.data);
          this.$data.supplies = res.data.data.supplies;
        }
      } catch (error) {
        console.log(error);
      }
    },
    openDeposit() {
      console.log('openDeposit');
      var loanmarket = this.$store.getters.getselectloanmarket;
      this.$refs.depositModel.open(loanmarket);
    },
    opencancelpledge() {
      var loanmarket = this.$store.getters.getselectloanmarket;
      this.$refs.cancelpledge.open(loanmarket);
    },
    openwithdrawalReward() {
      var loanmarket = this.$store.getters.getselectloanmarket;
      this.$refs.withdrawalReward.open(loanmarket);
    }
  }
  // computed: {
  //   getselectloanmarket:function(){
  //     return this.$store.getters.getselectloanmarket;
  //   }
  // },
  // watch:{
  //   getselectloanmarket:function(){
  //     console.log('defaultMarket')
  //     var loanmarket = this.$store.getters.getselectloanmarket;
  //     if(loanmarket){
  //       this.getmydata();
  //     }

  //   }

  // }

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
  .btn{
    margin-right: 20px;
  }
  .btnholder{
    margin-bottom: 10px;
  }
}
</style>
