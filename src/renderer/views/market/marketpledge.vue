<template>
  <div class="customer-container">
    <div class="tableContainer">
      <Row v-if="selectmarket" class-name="card-item mt20">
        <Col span="14">
          {{$t('head.market')}}
          <Dropdown @on-click="selectmarketClick">
            <a href="javascript:void(0)">
              {{selectmarket.name}}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu v-if="marketList" slot="list">
              <DropdownItem
                :name="item.name"
                :key="item.marketAddress"
                v-for="item in marketList"
              >{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          &nbsp;
          {{$t('marketpage.Pending-order-fee')}}：{{selectmarket.feeRate|Percentformat}}
          {{$t('marketpage.Single-fee')}}：{{selectmarket.commissionRate|Percentformat}}
        </Col>


      </Row>
      <Row>
          <Col span="8" class-name="title-wrapper">
          <Button @click="openDelegateMarket" type="primary">市场质押</Button>

          <div
            v-if="delegationinfo"
          >质押金额 {{delegationinfo.delegateAmount|Lambformat}} 质押收益{{Pledgeincome(delegationinfo)|Lambformat}}</div>
        </Col>

      </Row>
      <Row>
             <br/>
        市场中的每笔收入会按照市场质押比例来进行分配。<br/>

收益分配规则：<br/>

市场创建人收取市场收益10%<br/>
市场质押人按照质押比例分配剩余的90%（市场创建人也在分配集合中）<br/>
      </Row>
    </div>
    <DelegateMarketModal ref="DelegateMarket" />

  </div>
</template>
<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import DelegateMarketModal from '@/views/Dialog/DelegateMarketModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');



export default {
  components: {
    DelegateMarketModal
  },
  data() {
    return {
      delegationinfo: {},
      selectmarket: null,
      marketList: [],
      delegationinfo: null
    };
  },
  mounted() {
    this.getmarketlist();
  },
  methods: {
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
        marketName: this.$data.selectmarket.name

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

      //   this.getmarketinfo(name);
      //   this.getOrderList();
      this.getmarketdelegationinfo();

      this.$store.dispatch('setselectMarket', this.$data.selectmarket.marketAddress);
    },
    openDelegateMarket() {
      this.$refs.DelegateMarket.open(this.$data.selectmarket.name);
    }
  }
};
</script>

<style lang="less" scoped>
.customer-container {
  .container {
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
.tableContainer {
  width: 94%;
  margin: 0 auto;
  margin-top: 10px;
}
</style>

