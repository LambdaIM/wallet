
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
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">质押总量(TBB)</p>
            <p class="value">500000000.000000</p>
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
      distributionBalance: 0
    };
  },
  mounted() {
    this.validatorDistribution();
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
    }
  },
  computed: {
    balance: function() {
      return this.$store.getters.getblance;
    },
    DistributionReward: function() {
      return this.$store.getters.getDistributionReward;
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
