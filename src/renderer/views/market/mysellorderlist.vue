
<template>
  <div class="customer-container">
      <div class="tableContainer">
             <Row>
        <Col span="20">&nbsp;</Col>
        <Col span="4">
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
                     <Page  @on-change="SellOrderListPage"  :total="100" show-elevator />
                    </div>
      </div>

  </div>
</template>
<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
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
      SellOrderslist: []

    };
  },
  mounted() {
    this.getSellOrderslist(1);
  },
  methods: {
    async  getSellOrderslist(page) {
      let res = await ipc.callMain('marketSellOrderslist', {
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.SellOrderslist = res.data.data || [];
      }
    },
    SellOrderListPage(page) {
      console.log(page);
      this.getSellOrderslist(page);
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
