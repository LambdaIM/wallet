
<template>
  <div class="customer-container">
      <div class="tableContainer">
           <Row>
        <Col span="22"><h3>{{$t('marketpage.autotitle')}}</h3></Col>


    </Row>
                  <div style="text-align: center;">
          <Dropdown @on-click="selectmarketClick">
        <a href="javascript:void(0)">
            {{selectmarket.name}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu  v-if="marketList" slot="list">
            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList" >{{item.name}}</DropdownItem>


        </DropdownMenu>
    </Dropdown>&nbsp;


      {{$t('marketpage.space')}} <Input v-model="autoSpaceSize"  style="width: auto" />GB&nbsp;
      {{$t('marketpage.duration')}}<Input v-model="autoSpaceDuration"  style="width: auto" />{{$t('marketpage.month')}}&nbsp;
         <Button @click="openautoBuyingspace" type="primary">{{$t('marketpage.One-click-space')}}</Button>

    </div>

      <div style="text-align: center;"> {{$t('marketpage.Pending-order-fee')}}：{{selectmarket.feeRate|Percentformat}}
          {{$t('marketpage.Single-fee')}}：{{selectmarket.commissionRate|Percentformat}} ，
          {{$t('marketpage.unitprice')}}：{{marketinfo.order_normal_price|Lambformat}}，
          {{$t('marketpage.Minimumtime')}}： {{marketinfo.order_min_buy_duration|formatMonth}}{{$t('marketpage.month')}}
          {{$t('marketpage.Maximumtime')}}：{{marketinfo.order_max_buy_duration|formatMonth}}{{$t('marketpage.month')}}，
          {{$t('marketpage.Minimumspace')}}：{{marketinfo.order_min_buy_size}}GB  </div>


     <Divider />
     <Row>
        <Col span="7"><h3>{{$t('marketpage.Optionaltitle')}}  </h3></Col>
        <Col span="17" style="text-align: right;">
           <syncbar :marketName="selectmarket.name"/>
        </Col>
      </Row>
      <br/>
     <div>{{$t('marketpage.last100data')}}</div>
     <br/>
                         <Table @on-sort-change="OrderListSort" v-if="OrderList"  :columns="OrderListcolumns" :data="OrderList">
                        <template slot-scope="{ row, index }" slot="action">
                         <Button v-if="row.status=='0'"  @click="openBuyingspace(row)"  type="primary" size="small"> {{$t('marketpage.selltable.Purchasespace')}} </Button>
                        </template>
                        <template slot-scope="{ row, index }" slot="price">
                         {{row.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="minDuration">
                         {{row.minDuration|formatMonth}}
                        </template>
                        <template slot-scope="{ row, index }" slot="rate">
                         {{parseInt(row.rate)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="status">
                         <span style="color:green" v-if="row.status=='0'">
                           {{$t('marketpage.Active')}}
                        </span>
                        <span style="color:red" v-if="row.status=='1'">
                           {{$t('marketpage.Finish')}}
                        </span>

                        </template>



                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page   @on-change="orderListPage" :total="allCount" simple/>
                    </div>
                    <br/><br/><br/>



     </div>
     <autoBuyingspaceModal ref="autoBuyingspace" />
     <BuyingspaceModal ref="Buyingspace" />
  </div>
</template>
<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import autoBuyingspaceModal from '@/views/Dialog/autoBuyingspaceModal.vue';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';
import eventhub from '../../common/js/event.js';
import syncbar from './syncbar.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');
var packagejson = require('../../../../package.json');



export default {
  data() {
    return {
      selectmarket: '',
      marketList: [],
      marketinfo: '',
      OrderList: [],
      OrderListcolumns: [{
        title: this.$t('marketpage.selltable.Mineraddress'),
        key: 'address'
      },
      {
        title: this.$t('marketpage.myselltable.Storagedevice'),
        key: 'machineName'
      },
      {
        title: this.$t('marketpage.selltable.amountspace'),
        key: 'sellSize',
        sortable: 'custom'
      },
      {
        title: this.$t('marketpage.selltable.remainingspace'),
        key: 'unUseSize',
        sortable: 'custom'
      },
      {
        title: this.$t('marketpage.selltable.unitprice'),
        key: 'price',
        slot: 'price',
        sortable: 'custom'
      },
      {
        title: this.$t('marketpage.selltable.minimumspace'),
        key: 'minBuySize'
      },
      {
        title: this.$t('marketpage.selltable.minimumduration'),
        key: 'minDuration',
        slot: 'minDuration'
      },
      {
        title: this.$t('marketpage.selltable.operating'),
        key: 'action',
        slot: 'action'
      }, {
        title: this.$t('marketpage.selltable.Odds'),
        key: 'rate',
        slot: 'rate',
        sortable: 'custom'
      }, {
        title: this.$t('marketpage.Status'),
        key: 'status',
        slot: 'status'

      }
      ],
      orderSortinfo: {},
      islocal: false,
      islocalfilter: {},
      autoSpaceSize: '',
      autoSpaceDuration: '',
      allCount: 1,
      pageCount: {}


    };
  },
  mounted() {
    this.getmarketlist();
    this.getmarketinfo('');

    eventhub.$on('marketsellordersync', data => {
      console.log('marketsellordersync');
      this.$data.islocal = data;
      this.getOrderList(1);
    });

    eventhub.$on('marketconditionfilter', data => {
      console.log('marketconditionfilter');
      this.$data.islocalfilter = data;
      this.getOrderList(1);
    });
  },
  components: {
    autoBuyingspaceModal,
    BuyingspaceModal,
    syncbar
  },
  methods: {
    async getmarketlist() {
      console.log('getmarketlist');
      let res = await ipc.callMain('marketlist', {});
      if (res.state) {
        this.$data.marketList = res.data.data;
        this.$data.selectmarket = this.$data.marketList[0];
        this.getOrderList(1);
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
        orderType: 'premium', // premium all
        page: page || 1,
        limit: 10,
        marketAddress: this.$data.selectmarket.marketAddress,
        islocal: this.$data.islocal,
        orderSortinfo: this.$data.orderSortinfo,
        islocalfilter: this.$data.islocalfilter
      });
      console.log('- -');
      if (res.state) {
        this.$data.OrderList = res.data.data || [];
        if (this.$data.pageCount[page] == undefined) {
          this.$data.pageCount[page] = 1;
          this.$data.allCount += this.$data.OrderList.length;
        }
      }
    },
    orderListPage(page) {
      console.log(page);
      this.getOrderList(page);
    },
    OrderListSort(columninfo) {
      if (this.$data.islocal == false) {
        this.$Message.info(this.$t('marketpage.Localsorting3'));
        return;
      }
      console.log(columninfo);
      var key = columninfo.key;
      var order = columninfo.order;
      this.$data.orderSortinfo = {
        key,
        order
      };

      this.getOrderList(1);
    },
    selectmarketClick(name) {
      console.log(name);
      var _this = this;
      this.$data.marketList.forEach(item => {
        if (name == item.name) {
          _this.$data.selectmarket = item;
        }
      });
      this.getmarketinfo(name);
      this.getOrderList();
    },
    openautoBuyingspace() {
      let spaceSize = parseInt(this.$data.autoSpaceSize);
      let spaceDuration = parseInt(this.$data.autoSpaceDuration);

      if (isNaN(spaceSize) || spaceSize <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.AutoBuy.action.needspacesize')
        });
        return;
      }
      if (isNaN(spaceDuration) || spaceDuration <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.AutoBuy.action.needstime')
        });
        return;
      }

      this.$refs.autoBuyingspace.open({
        name: this.$data.selectmarket.name,
        marketAddress: this.$data.selectmarket.marketAddress,
        unitprice: this.$data.marketinfo.order_normal_price
      }, spaceSize, spaceDuration);
    },
    openBuyingspace(row) {
      this.$refs.Buyingspace.open(row, this.$data.selectmarket);
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
