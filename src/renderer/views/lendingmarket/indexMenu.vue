<template>
    <div class="customer-container">
        <div class="tableContainer">
            <h3>{{name}}  {{$t('poolmarketinfo.menuinfo.title')}}</h3>
            <Menu mode="horizontal"  :active-name="activeItem">
                <MenuItem to="/lendingmarket" name="poolinfo">
                    <Icon type="ios-paper" />
                    {{$t('poolmarketinfo.menuinfo.menu1')}}
                </MenuItem>
                <MenuItem to="/lendingmarket/Deposittoken" name="Deposittoken">
                    <Icon type="ios-paper" />
                    {{$t('poolmarketinfo.menuinfo.menu2')}}
                </MenuItem>
                <MenuItem to="/lendingmarket/Depositpower" name="Depositpower">
                    <Icon type="ios-paper" />
                    {{$t('poolmarketinfo.menuinfo.menu3')}}
                </MenuItem>
                <MenuItem to="/lendingmarket/orderlist" name="orderlist">
                    <Icon type="ios-paper" />
                    {{$t('poolmarketinfo.menuinfo.menu4')}}
                </MenuItem>
            </Menu>
        </div>
        <router-view></router-view>


    </div>
</template>
<script>


const { ipcRenderer: ipc } = require('electron-better-ipc');



export default {
  data() {
    return {
      markets: [],
      activeItem: this.$route.name,
      name: ''

    };
  },
  async mounted() {
    this.loanmarkets();
    var _this = this;
    setInterval(() => {
      _this.loanmarkets();
    }, 1000 * 15);
  },
  methods: {
    async loanmarkets() {
      try {
        let res = await ipc.callMain('loanmarkets', {});
        if (res.state) {
          this.$data.markets = res.data.data || [];
          console.log(this.$data.markets);
          if (this.$data.markets[0]) {
            this.$store.dispatch('setloanmarket', this.$data.markets[0]);
            this.$data.name = this.$data.markets[0].name;
          } else {
            throw new Error('no loanmarket');
          }
        }
      } catch (ex) {
        console.log(ex);
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
