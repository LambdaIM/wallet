<template>
  <div class="customer-container">

      <div class="tableContainer">

          <Tabs value="name1">
                <TabPane label="购买空间" name="name1">
          <Row>
        <Col span="22"><h3>自动匹配-一键购买  </h3></Col>


    </Row>
                  <div style="text-align: center;">
          <Dropdown @on-click="selectmarketClick">
        <a href="javascript:void(0)">
            {{selectmarket.name}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList" >{{item.name}}</DropdownItem>


        </DropdownMenu>
    </Dropdown>&nbsp;


      数量 <Input v-model="autoSpaceSize"  style="width: auto" />GB&nbsp;
      时间 <Input v-model="autoSpaceDuration"  style="width: auto" />Day&nbsp;
         <Button @click="openautoBuyingspace" type="primary">一键购买空间</Button>

    </div>
    <br/>

        <div>{{selectmarket.name}}存储市场指标    挂单手续费：{{selectmarket.feeRate|Percentformat}}，成单手续费：{{selectmarket.commissionRate|Percentformat}} 订单量：111，最短购买时间：1天 最长购买时间1年，空间最小1gb 空间最大 10gb </div>


     <Divider />

        <Row>
        <Col span="22"><h3>自选交易-更多选择，自由交易  </h3></Col>
        <Col span="2"><Button @click="openSellingspace"  size="small">出售空间</Button></Col>

    </Row>
     <br/>
                    <Table  :columns="OrderListcolumns" :data="OrderList">
                        <template slot-scope="{ row, index }" slot="action">
                         <Button  @click="openBuyingspace(row)"  type="primary" size="small"> 购买空间 </Button>
                        </template>
                        <template slot-scope="{ row, index }" slot="price">
                         {{row.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="minDuration">
                         {{row.minDuration/(1000*1000*1000*60*60*24)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="rate">
                         {{parseInt(row.rate)}}
                        </template>



                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page  @on-change="orderListPage" :total="100" show-elevator />
                    </div>
                    <br/><br/><br/>
                </TabPane>
                <!-- <TabPane label="出售" name="name1">
                    <Table :columns="columns1" :data="data1"></Table>
                </TabPane> -->
                <TabPane label="我出售的空间" name="name4">
                 <Table :columns="SellOrdercolumns" :data="SellOrderslist">
                   <template slot-scope="{ row, index }" slot="price">
                         {{row.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="minDuration">
                         {{row.minDuration/(1000*1000*1000*60*60*24)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="rate">
                         {{parseInt(row.rate)}}
                        </template>
                 </Table>
                 <br/>
                    <div style="text-align: center;">
                     <Page  @on-change="SellOrderListPage"  :total="100" show-elevator />
                    </div>
                 </TabPane>
                <TabPane label="订单列表" name="name3">
                    <Table :columns="UserOrderscolumns" :data="UserOrderslist">
                      <template slot-scope="{ row, index }" slot="action">
                        <Button  @click="orderinfo"  type="primary" size="small"> 订单详情 </Button>
                      </template>
                        <template slot-scope="{ row, index }" slot="price">
                         {{row.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="userPay">
                         {{amountFormat(row.userPay)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="buyAddress">
                         {{typeFormat(row.buyAddress)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="minerPay">
                         {{amountFormat(row.minerPay)}}
                        </template>



                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page @on-change="UserOrdersListPage" :total="100" show-elevator />
                    </div>
                </TabPane>

            </Tabs>



      </div>
      <BuyingspaceModal ref="Buyingspace" />
      <SellingspaceModal ref="Sellingspace" />
      <autoBuyingspaceModal ref="autoBuyingspace" />


  </div>
</template>

<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';
import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';
import autoBuyingspaceModal from '@/views/Dialog/autoBuyingspaceModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      autoprice: 1,
      marketList: [],
      marketExplain: '',
      selectmarket: '',
      marketinfo: '',
      autoSpaceSize: '',
      autoSpaceDuration: '',
      OrderList: [],
      OrderListcolumns: [{
        title: '矿工地址',
        key: 'address'
      },
      {
        title: '空间总量(GB)',
        key: 'sellSize'
      },
      {
        title: '剩余空间总量(GB)',
        key: 'unUseSize'
      },
      {
        title: '单价LAMB/GB/day',
        key: 'price',
        slot: 'price'
      },
      {
        title: '最小空间(GB)',
        key: 'minBuySize'
      },
      {
        title: '最小时间(天)',
        key: 'minDuration',
        slot: 'minDuration'
      },
      {
        title: '交易',
        key: 'action',
        slot: 'action'
      }, {
        title: '赔率',
        key: 'rate',
        slot: 'rate'
      }
      ],

      SellOrdercolumns: [
        {
          title: '空间总量',
          key: 'sellSize'
        },
        {
          title: '剩余空间总量',
          key: 'unUseSize'
        },
        {
          title: '单价LAMB/GB/day',
          key: 'price',
          slot: 'price'
        },
        {
          title: '最小空间',
          key: 'minBuySize'
        },
        {
          title: '最小时间',
          key: 'minDuration',
          slot: 'minDuration'
        },
        {
          title: '赔率',
          key: 'rate',
          slot: 'rate'
        }, {
          title: '存储设备',
          key: 'machineName'
        }, {
          title: '市场',
          key: 'marketAddress'
        }
      ],
      SellOrderslist: [],
      UserOrderscolumns: [{
        title: '类型',
        key: 'buyAddress',
        slot: 'buyAddress'
      },
      {
        title: '订单ID',
        key: 'orderId'
      },

      {
        title: '数量',
        key: 'size'
      },
      {
        title: '单价(LAMB/GB/DAY)',
        key: 'price',
        slot: 'price'
      },

      {
        title: '开始时间',
        key: 'createTime'
      },
      {
        title: '结束时间',
        key: 'endTime'
      },
      {
        title: '用户支付金额',
        key: 'userPay',
        slot: 'userPay'
      },
      {
        title: '矿工押金',
        key: 'minerPay',
        slot: 'minerPay'
      },
      {
        title: '订单详情',
        key: 'action',
        slot: 'action'
      }
      ],
      UserOrderslist: []



    };
  },
  components: {
    MyTable,
    Mycard,
    BuyingspaceModal,
    SellingspaceModal,
    autoBuyingspaceModal
  },
  mounted() {
    this.getmarketlist();

    this.getSellOrderslist();
    this.getUserOrderslist();
  },
  methods: {
    UserOrdersListPage(page) {
      console.log(page);
      this.getUserOrderslist(page);
    },
    SellOrderListPage(page) {
      console.log(page);
      this.getSellOrderslist(page);
    },
    orderListPage(page) {
      console.log(page);
      this.getOrderList(page);
    },
    async getmarketlist() {
      console.log('getmarketlist');
      let res = await ipc.callMain('marketlist', {});
      if (res.state) {
        this.$data.marketList = res.data.data;
        this.$data.selectmarket = this.$data.marketList[0];
        this.getOrderList();
      }
    },
    async   getmarketinfo(name) {
      let res = await ipc.callMain('marketinfo', {
        name
      });
      if (res.state) {
        this.$data.marketinfo = res.data.data;
      }
    },
    async  getOrderList(page) {
      console.log('- -');
      let res = await ipc.callMain('marketOrderList', {
        marketName: this.$data.selectmarket.name,
        orderType: 'vip',
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.OrderList = res.data.data;
      }
    },
    async  getSellOrderslist(page) {
      let res = await ipc.callMain('marketSellOrderslist', {
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.SellOrderslist = res.data.data;
      }
    },
    async getUserOrderslist(page) {
      let res = await ipc.callMain('marketUserOrderslist', {
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.UserOrderslist = res.data.data;
      }
    },
    openBuyingspace(row) {
      this.$refs.Buyingspace.open(row, this.$data.selectmarket);
    },
    openSellingspace() {
      this.$refs.Sellingspace.open(this.$data.selectmarket);
    },
    openautoBuyingspace() {
      this.$refs.autoBuyingspace.open({
        name: this.$data.selectmarket.name,
        marketAddress: this.$data.selectmarket.marketAddress
      }, this.$data.autoSpaceSize, this.$data.autoSpaceDuration);
    },
    orderinfo() {
      this.$router.push(`/orderinfo/1`);
    },
    selectmarketClick(e) {
      console.log(e);
      this.getmarketinfo(e.name);
      this.getOrderList(e.name);
    },
    amountFormat(item) {
      return this.bigNumTypeFormat(item.amount, item.denom);
    },
    typeFormat(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return '买单';
      } else {
        return '卖单';
      }
    }

  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
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
