<template>
  <div>
    <Modal
      loading
      v-model="withdrawalModal"
      :title="$t('Dialog.withdrawalModal.title')"
      :styles="{top: '200px'}"
      @on-cancel="sendcancel"
    >
      <p v-if="selectmarket">
        {{$t('head.market')}}
          <Dropdown @on-click="selectmarketClick">
                <a href="javascript:void(0)">
                    {{selectmarket.name}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu  v-if="marketList" slot="list">
                    <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList" >{{item.name}}</DropdownItem>


                </DropdownMenu>
            </Dropdown>

      </p>
      <p v-if="delegationinfo">
       质押收益{{Pledgeincome(delegationinfo)|Lambformat}}
      </p>
      <div slot="footer">
        <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
      </div>
    </Modal>

    <ConfirmModal ref="ConfirmModal" />
  </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      withdrawalModal: false,
      confirmModal: false,
      gaseFee: 0,
      marketList: [],
      selectmarket: null,
      delegationinfo: null
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open() {
      console.log('- -');
      this.$data.withdrawalModal = true;
      this.$data.confirmModal = false;
      this.getmarketlist();
    },
    prewithdrawalLAMB() {
      console.log('- -');
      this.LAMBvalue = this.DistributionReward;
      let value = this.toBigNumStr(this.LAMBvalue);

      // if (value <= 0 || value > this.$data.DistributionReward ) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title: this.$t('home.action.check_balance_amount_transfer')
      //   });
      //   return;
      // }

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.$data.withdrawalModal = false;
      this.transfer(value, 'marketTransferWithDrawMarket');
    },
    async transfer(amount, txType) {
      let to = this.$data.selectmarket.name;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      try {
        let res = await ipc.callMain(txType, {
          marketName: to
        });
        // console.log(res);
        if (res.state) {
          console.log(res.data);
          this.sendcancel();
          this.$refs.ConfirmModal.open('marketTransferWithDrawMarket', res.data);
        }
      } catch (ex) {
        this.$Notice.warning({
          title: 'error',
          desc: ex.errormsg
        });
        console.log(ex);
      }
    },
    sendcancel() {
      this.withdrawalModal = false;
      // this.confirmModal=true;
    },
    async getmarketlist() {
      console.log('getmarketlist');
      try {
        let res = await ipc.callMain('marketlist', {});
        if (res.state) {
          this.$data.marketList = res.data.data;
          this.$data.selectmarket = this.finddefaultmarket(this.$data.marketList);

          this.getmarketdelegationinfo();
        }
      } catch (error) {
        this.$Message.error(this.$t('foot.linkerror'));
      }
    },
    finddefaultmarket(list) {
      var defaultaddress = this.$store.getters.getselectMarket;
      var result = list[0];
      list.forEach(item => {
        if (item.marketAddress == defaultaddress) {
          result = item;
        }
      });

      return result;
    },
    async getmarketdelegationinfo() {
      console.log('getmarketdelegationinfo');
      let res = await ipc.callMain('marketdelegationinfo', {
        marketName: this.$data.selectmarket.name,
        aaa: 'zzz'
      });
      if (res.state && res.data.data.error == undefined) {
        this.$data.delegationinfo = res.data.data;
      } else {
        this.$data.delegationinfo = null;
      }
    },
    Pledgeincome(data) {
      var list = []; var result = 0;
      if (data.inCome.commissionInCome instanceof Array) {
        list = list.concat(data.inCome.commissionInCome);
      }

      if (data.inCome.feeInCome instanceof Array) {
        list = list.concat(data.inCome.feeInCome);
      }

      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        var amount = Number(element.amount);
        result += amount;
      }

      return result;
    },
    selectmarketClick(name) {
      console.log(name);
      var _this = this;
      this.$data.marketList.forEach(item => {
        if (name == item.name) {
          _this.$data.selectmarket = item;
        }
      });

      this.getmarketdelegationinfo();

      this.$store.dispatch('setselectMarket', this.$data.selectmarket.marketAddress);
    }

  },
  computed: {
    DistributionReward() {
      return this.bigNumType(this.$store.getters.getDistributionReward);
    },
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getblance;
    }
  }
};
</script>
<style lang="less" scoped>
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>

