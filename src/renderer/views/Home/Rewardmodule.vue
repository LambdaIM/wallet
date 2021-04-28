<template>
    <div>
        <span v-if="$role('home.guide')" style="    font-size: 15px;">
          {{$t('testcoin.miningaward')}}：<span style="color: #67a7db;">{{MinerRewards|Lambformat}}</span>
        </span>
        <span v-else>
          &nbsp;
        </span>
        <span style="    font-size: 15px;">{{$t('poolmarkettx.LiquidityminingAward')}}：{{LiquidityReward|Lambformat}}</span>


    </div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');
const BigNumber = require('bignumber.js');

export default {
  data() {
    return {
      MinerRewards: 0,
      pooltokenRewards: 0,
      powerReward: 0
    };
  },
  mounted() {
    this.getMinerRewards();
    this.getsupplierreward();
    this.getpowerReward();
  },
  methods: {
    async getMinerRewards() {
      console.log('getMinerRewards');
      try {
        let res = await ipc.callMain('MinerRewards', {});

        console.log(res);

        if (res.state) {
          var list = res.data['miner_rewards'] || [];
          var result = '';
          list.forEach(item => {
            if (item.denom == 'ulamb') {
              result = item.amount;
            }
          });

          this.$data.MinerRewards = result;
          this.$store.dispatch('setMinerReward', result);
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    async getsupplierreward() {
      // loanmarketsupplierreward
      try {
        // var loanmarket = this.$store.getters.getselectloanmarket;
        let res = await ipc.callMain('loanmarketsupplierreward', {
          islatest_reward: true
        });

        if (res.state) {
          var supplies = res.data.data.supplies || [];
          var result = this.bigNum('0');

          supplies.forEach(item => {
            result = result.plus(item.reward.amount);
          });
          this.$data.pooltokenRewards = result;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getpowerReward() {
      let res = await ipc.callMain('loanloanee', {});
      if (res.state) {
        console.log(res.data.data);
        var result = this.bigNum('0');
        try {
          var dataList = res.data.data.loaneeRewards || [];
          dataList.forEach(item => {
            result = result.plus(item.withDrawable.amount);
          });
          this.$data.powerReward = result;
        } catch (error) {
          console.log(error);
        }
      }
    }

  },
  computed: {
    LiquidityReward: function() {
      console.log('----');
      let num;
      if (this.$data.powerReward == 0) {
        num = new BigNumber('0');
      } else {
        num = this.$data.powerReward;
      }

      var data = num.plus(this.$data.pooltokenRewards);
      return data.toString();
    }
  }
};
</script>
