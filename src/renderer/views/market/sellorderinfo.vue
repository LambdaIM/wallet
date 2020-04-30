<template>
<div class="container" style="margin-top: 10px;">
<Mycard :cardtitle="$t('orderinfo.orderdetails')" >
<div v-if="sellorderinfo" class="card-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('syncorderpage.orderID') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.orderId}}
          </Col>
          <Col span="3" class-name="content-wrapper">

            <Button type="primary" to="/market/syncdata">{{ $t('Dialog.com.back') }}</Button>

          </Col>
        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('Dialog.AutoBuy.Marketaddress')}}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{marketAddress}}
          </Col>

        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('Dialog.AutoBuy.Marketname')}}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{marketname}}
          </Col>

        </Row>

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.Status') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            <span style="color:green" v-if="sellorderinfo.status=='0'">{{$t('marketpage.Active')}}</span>
            <span style="color:red" v-if="sellorderinfo.status=='1'">{{$t('marketpage.Finish')}}</span>
          </Col>
        </Row>
                <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.Odds') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{parseFloat(sellorderinfo.rate)}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.Mineraddress') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.address}}
          </Col>
          <Col span="3" class-name="content-wrapper">

            <Button
                type="primary"
                size="small"
                @click="openBuyingspace(sellorderinfo)"
              >{{$t('marketpage.selltable.Purchasespace')}}</Button>
          </Col>

        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.amountspace') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.sellSize}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.remainingspace') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.unUseSize}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.unitprice') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.amount[0].amount | Lambformat}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.minimumspace') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.minBuySize}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{ $t('marketpage.selltable.minimumduration') }}:</span>
          </Col>
          <Col span="17" class-name="content-wrapper">
            {{sellorderinfo.minDuration|formatMonth}}
          </Col>
        </Row>

        <BuyingspaceModal ref="Buyingspace" />


</div>
</Mycard>
</div>

</template>

<script>
import Mycard from '@/components/common/useful/Mycard.vue';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');


export default {
  components: {
    BuyingspaceModal,
    Mycard
  },
  data() {
    return {
      marketList: [],
      marketname: '',
      marketAddress: '',
      sellorderinfo: {
        'orderId': '627ABAC4C4718CFA3CBD756C6C390524D122B5A3',
        'address': 'lambdamineroper123sh3r55u0pykvu8y4gl0trfle550c4wd4z0gw',
        'price': 6000000,
        'rate': '1.000000000000000000',
        'amount': [{
          'denom': 'ulamb',
          'amount': '12000000'
        }],
        'sellSize': 2,
        'unUseSize': 2,
        'status': '0',
        'createTime': '2020-04-28T11:01:27.483376441Z',
        'cancelTimeDuration': '3600000000000',
        'marketAddress': 'lambdamarketoper1thj5fv8d0dsh3aealhpxm9mvgxjfh87srk3887',
        'minBuySize': '1',
        'minDuration': '2592000000000000',
        'maxDuration': '155520000000000000',
        'reserve1': '',
        'network': 'lambda-bdd',
        '_id': '4gTiqTHGsN3xs5U4'
      }
    };
  },
  async mounted() {
    await this.getmarketlist();
    this.getsellorderinfo();
  },
  methods: {
    openBuyingspace(row) {
      this.$refs.Buyingspace.open(row, {
        name: this.$data.marketname,
        marketAddress: this.$data.marketAddress
      });
    },
    async getmarketlist() {
      console.log('getmarketlist');
      try {
        let res = await ipc.callMain('marketlist', {});
        if (res.state) {
          this.$data.marketList = res.data.data;
          this.$data.selectmarket = this.finddefaultmarket();
          this.$data.marketname = this.$data.selectmarket.name;
          this.$data.marketAddress = this.$data.selectmarket.marketAddress;
        }
      } catch (error) {
        this.$Message.error(this.$t('foot.linkerror'));
      }
    },
    finddefaultmarket() {
      var list = this.$data.marketList;
      var defaultaddress = this.$store.getters.getselectMarket;
      var result = list[0];
      list.forEach(item => {
        if (item.marketAddress == defaultaddress) {
          result = item;
        }
      });

      return result;
    },
    async  getsellorderinfo() {
      let res = await ipc.callMain('sellorderinfo', {
        name
      });
      if (res.state) {
        this.$data._sellorderinfo = res.data.data;
      }
    }
  }

};
</script>


<style lang="less" scoped>
.container {
  position: relative;

  .card-content {
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
  }
}
</style>
