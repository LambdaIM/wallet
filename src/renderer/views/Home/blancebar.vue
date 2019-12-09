
<template>
  <div class="customer-container">
   <div class="account-info-container">
      <Row class-name="account-info-wrapper" type="flex" justify="space-between">
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">{{$t('home.Balance')}}(LAMB)</p>
            <p class="value">{{balance|BlanceValue}} </p>
          </div>
        </Col>
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">{{$t('home.pledge')}}(TBB)</p>
            <p class="value">{{pledgeAmount|BlanceValue }}</p>
          </div>
        </Col>
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">{{$t('home.Reward')}}(LAMB)</p>
            <p class="value">{{DistributionReward|BlanceValue}}</p>
          </div>
        </Col>
        <Col v-if="distributionBalance > 0" span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">{{$t('home.Validatorprofit')}}(LAMB)</p>
            <p class="value">{{distributionBalance|BlanceValue}}</p>
          </div>
        </Col>



      </Row>
    </div>


  </div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      activeItem: this.$route.name,
      distributionBalance: 0,
      mydelegationsList: [],
      validatorsList: [],
      validatorspledgeAmount: 0,
      partnerpledgeAmount: 0
    };
  },
  async mounted() {
    this.validatorDistribution();

    await this.getvalidatorsList();
    await this.getdeleData();

    await this.getpartnerListData();
    await this.getmypartnerDeleData();

    this.$data.Interval = setInterval(async () => {
      this.validatorDistribution();

      await this.getvalidatorsList();
      await this.getdeleData();

      await this.getpartnerListData();
      await this.getmypartnerDeleData();
    }, 1000 * 15);
  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
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
    async getdeleData() {
      console.log('getdeleData');
      try {
        let res = await ipc.callMain('mydelegations', {
          operator_address: this.address
        });

        console.log(res);

        if (res.state) {
          this.$data.mydelegationsList = res.data || [];
          this.validatorsListForMe();
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    async getvalidatorsList() {
      console.log('getListData');
      try {
        let res = await ipc.callMain('validatorsList', {});

        console.log(res);

        if (res.state) {
          this.$data.validatorsList = res.data;
        }
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

      this.getMyTotalpledge(list, 'validatorspledgeAmount');
    },
    myMypledge(row) {
      return this.CalculationMypledge(row.shares, row.delegator_shares, row.tokens, true);
    },
    getMyTotalpledge(list, dataType) {
      var shares = 0; var delegator_shares = 0; var tokens = 0;
      list.forEach(item => {
        shares = this.bigNumAdd(shares, item.shares);
        delegator_shares = this.bigNumAdd(delegator_shares, item.delegator_shares);
        tokens = this.bigNumAdd(tokens, item.tokens);
      });
      var temp = this.myMypledge({
        shares,
        delegator_shares,
        tokens
      });
      if (temp != 'NaN') {
        this.$data[dataType] = temp;
      }
    },
    async getpartnerListData() {
      console.log('partnerList');
      try {
        let res = await ipc.callMain('partnerList', {});
        if (res.state) {
          this.$data.partnerList = res.data;
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    async getmypartnerDeleData() {
      console.log('getListData');
      try {
        let res = await ipc.callMain('mypartnerDelegations', {
          operator_address: this.address
        });
        // let poolres= await ipc.callMain("pool", {});
        // console.log(res);
        console.log(res);
        // console.log(poolres)
        if (res.state) {
          this.$data.mypartnerdelegationsList = res.data || [];
          this.partnerListForMe();
        }
        // if(poolres.state){
        //   this.$data.pool=poolres.data
        // }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    partnerListForMe() {
      var list = [];
      this.$data.mypartnerdelegationsList.forEach(myitem => {
        this.$data.partnerList.forEach(item => {
          if (item.operator_address == myitem.validator_address) {
            myitem = Object.assign({}, myitem, item);
            myitem.reward = '--';
            list.push(myitem);
          }
        });
      });

      this.getMyTotalpledge(list, 'partnerpledgeAmount');
    }
  },
  computed: {
    balance: function() {
      return this.$store.getters.getblance;
    },
    DistributionReward: function() {
      return this.$store.getters.getDistributionReward;
    },
    address: function() {
      return this.$store.getters.getaddress;
    },
    pledgeAmount: function() {
      return this.bigNumAdd(this.$data.validatorspledgeAmount, this.$data.partnerpledgeAmount);
    }
  }

};
</script>
<style lang="less" scoped>
.customer-container {
    .account-info-container {
    width: 100%;
    height: 90px;
    .account-info-wrapper {
      width: 100%;
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
