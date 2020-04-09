<template>
<div>
    <div v-if="txtype=='MsgCreateSellOrder'">
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{msg.value.sellSize}} GB {{$t('orderinfo.unitprice')}} {{msg.value.price|Lambformat}}
    </div>
    <div v-if="txtype=='MsgCancelSellOrder'">
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{msg.value.orderId}}
    </div>
    <div v-if="txtype=='MsgWithDrawMarket'">
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{getvalueformtags()|uAmountDenom}}

    </div>
        <div v-if="txtype=='MsgMinerWithDraw'">
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{getvalueformtags2()|uAmountDenom}}

    </div>
    <div v-if="txtype=='MsgOrderRenewal'">
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{msg.value.duration|formatMonth}}{{$t('Dialog.AutoBuy.month')}}

    </div>



</div>
</template>

<script>
export default {
  components: {
    AddressLink: () => import('./AddressLink.vue')
  },
  props: {
    msg: {
      type: Object,
      default() {
        return {};
      }
    },
    txtype: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default() {
        return [];
      }

    }
  },
  methods: {
    getvalueformtags() {
      var result = '';
      var key = 'inCome';
      var tempresult;
      this.tags.forEach((item, index) => {
        if (item.key == key) {
          tempresult = item.value;
          result = tempresult;
        }
      });
      return result;
    },
    getvalueformtags2() {
      var result = '';
      var key = 'withdrawMiner';
      var tempresult;
      this.tags.forEach((item, index) => {
        if (item.key == key) {
          tempresult = item.value;
          result = tempresult;
        }
      });
      return result;
    }
  }


};
</script>
<style lang="less">
  .value {
    // font-weight: 600;
    color: #ff9800;
  }
</style>
