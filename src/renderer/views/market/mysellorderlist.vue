
<template>
  <div class="customer-container">
      <div class="tableContainer">
             <Row>
        <Col span="16">
        &nbsp;
        </Col>
        <Col span="8">
        <Dropdown @on-click="selectmarketClick">
        <a href="javascript:void(0)">
            {{selectmarket.name}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu  v-if="marketList" slot="list">
            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList" >{{item.name}}</DropdownItem>


        </DropdownMenu>
    </Dropdown>
        <Button @click="openSellingspace" type="primary"  size="small">{{$t('marketpage.sellspacebtn')}}</Button>
        </Col>
      </Row>
                <div>{{$t('marketpage.last100data')}} </div>
                <br/>
                 <Table v-if="SellOrderslist" :columns="SellOrdercolumns" :data="SellOrderslist">
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
                     <Page  @on-change="SellOrderListPage"  :total="allCount" simple />
                    </div>
                    <br />
      <br />
      <br />
      <br />
      </div>
      <SellingspaceModal ref="Sellingspace" />

  </div>
</template>
<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');
var packagejson = require('../../../../package.json');

export default {
  data() {
    return {
      SellOrdercolumns: [
        {
          title: this.$t('marketpage.myselltable.amountspace'),
          key: 'sellSize'
        },
        {
          title: this.$t('marketpage.myselltable.remainingspace'),
          key: 'unUseSize'
        },
        {
          title: this.$t('marketpage.myselltable.unitprice'),
          key: 'price',
          slot: 'price'

        },
        {
          title: this.$t('marketpage.myselltable.minimumspace'),
          key: 'minBuySize'
        },
        {
          title: this.$t('marketpage.myselltable.minimumduration'),
          key: 'minDuration',
          slot: 'minDuration'
        },
        {
          title: this.$t('marketpage.myselltable.Odds'),
          key: 'rate',
          slot: 'rate'
        }, {
          title: this.$t('marketpage.myselltable.Storagedevice'),
          key: 'machineName'
        }, {
          title: this.$t('marketpage.myselltable.Marketaddress'),
          key: 'marketAddress'
        }, {
          title: this.$t('marketpage.Status'),
          key: 'status',
          slot: 'status'

        }
      ],
      SellOrderslist: [],
      selectmarket: '',
      marketList: [],
      allCount: 1,
      pageCount: {}

    };
  },
  mounted() {
    this.getSellOrderslist(1);
    this.getmarketlist();
  },
  components: {
    SellingspaceModal

  },
  methods: {
    async  getSellOrderslist(page) {
      let res = await ipc.callMain('marketSellOrderslist', {
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.SellOrderslist = res.data.data || [];
        if (this.$data.pageCount[page] == undefined) {
          this.$data.pageCount[page] = 1;
          this.$data.allCount += this.$data.SellOrderslist.length;
        }
      }
    },
    SellOrderListPage(page) {
      console.log(page);
      this.getSellOrderslist(page);
    },
    openSellingspace() {
      this.$refs.Sellingspace.open(this.$data.selectmarket);
    },
    async getmarketlist() {
      console.log('getmarketlist');
      let res = await ipc.callMain('marketlist', {});
      if (res.state) {
        this.$data.marketList = res.data.data;
        this.$data.selectmarket = this.$data.marketList[0];
      }
    },
    selectmarketClick(name) {
      console.log(name);
      var _this = this;
      this.$data.marketList.forEach(item => {
        if (name == item.name) {
          _this.$data.selectmarket = item;
        }
      });
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
