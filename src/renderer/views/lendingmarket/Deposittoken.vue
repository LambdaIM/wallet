<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
         <Table :columns="columns1" :data="data1"></Table>
         <div class="btnholder">
            <Button class="btn" @click="openDeposit" type="primary" >存入</Button>
            <Button class="btn" @click="openwithdrawalReward" type="primary">提取收益</Button>
            <Button class="btn" @click="opencancelpledge" type="primary">取出</Button>
          </div>
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

export default {
  data() {
    return {
      columns1: [
        {
          title: '存币',
          key: 'Deposittoken'
        },
        {
          title: '未提取的收益',
          key: 'Undrawnincome'
        },
        {
          title: '年华收益率',
          key: 'Rateofreturn'
        }
      ],
      data1: [
        {
          Deposittoken: '1000lamb',
          Undrawnincome: '10lamb',
          Rateofreturn: '10%'
        }
      ]
    };
  },
  components: {
    DepositModel,
    Cancelpledge,
    WithdrawalReward
  },
  methods: {
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
    margin-top: 10px;
  }
}
</style>
