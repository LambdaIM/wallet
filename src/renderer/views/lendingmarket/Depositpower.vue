<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
        <div class="btnholder">
            <Button @click="openLoaneeWithDraw" class="btn" type="primary">{{$t('poolmarketinfo.powerinfo.Withdrawalincome')}}</Button>
          </div>
        <Table :columns="columns1" :data="minerdata">
          <template slot-scope="{ row, index }" slot="power">
              {{showpower(row.power)}}
          </template>
          <template slot-scope="{ row, index }" slot="reward">
              {{bigNumTypeFormat(row.reward.amount,row.reward.denom)}}
          </template>

        </Table>


        </div>
    </div>
    <LoaneeWithDraw ref="loaneeWithDraw" />
</div>
</template>
<script>
import LoaneeWithDraw from '@/views/Dialog/loan/LoaneeWithDraw.vue';

import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      columns1: [
        {
          title: this.$t('poolmarketinfo.powerinfo.mypower'),
          key: 'power',
          slot: 'power'
        },
        {
          title: this.$t('poolmarketinfo.powerinfo.Undrawnincome'),
          key: 'reward',
          slot: 'reward'
        }
      ],
      minerdata: [

      ]
    };
  },
  components: {
    LoaneeWithDraw
  },
  mounted() {
    this.getminerdata();
    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getminerdata();
    });
  },
  methods: {
    showpower(data) {
      if (data == undefined) {
        return '--';
      }
      return ((data.power * 8) / 1000).toFixed(3) + 'TB';
    },
    openLoaneeWithDraw() {
      var loanmarket = this.$store.getters.getselectloanmarket;
      this.$refs.loaneeWithDraw.open(loanmarket);
    },
    async getminerdata() {
      // loanloanee
      console.log('getminerdata');
      try {
        var reward, power;
        var list = [];
        let res = await ipc.callMain('loanloanee', {});
        if (res.state) {
          console.log(res.data.data);
          try {
            reward = res.data.data.loaneeRewards[0].withDrawable;
          } catch (error) {
            console.log(error);
          }
        }
        let res2 = await ipc.callMain('pdpStoragepower', {});
        if (res2.state) {
          console.log(res2.data.data);
          try {
            power = res2.data.data.powers[0];
          } catch (error) {

          }
        }
        list.push({
          power: power,
          reward: reward
        });

        this.$data.minerdata = list;
      } catch (error) {

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

  .btn{
    margin-right: 20px;
  }
  .btnholder{
    margin-bottom: 10px;
  }


}
</style>
