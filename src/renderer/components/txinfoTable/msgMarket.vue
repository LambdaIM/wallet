<template>
<div>
    <div v-if="txtype=='MsgCreateSellOrder'">
       <ul>
         <li><span class="lable">操作人: </span><AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      ></li>
         <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></li>
         <li><span class="lable">空间大小: </span>{{msg.value.sellSize}} GB</li>
         <li><span class="lable">单价:</span>{{msg.value.price|Lambformat}}</li>
         <li><span class="lable">市场名称:</span>{{msg.value.marketName}}</li>
         <li><span class="lable">赔率:</span>{{parseFloat(msg.value.rate)}}</li>
         <li><span class="lable">最小购买空间:</span>{{msg.value.minBuySize}} GB</li>
         <li><span class="lable">最小购买时间:</span>{{msg.value.minBuyDuration|formatMonth}}月 </li>
         <li><span class="lable">最大购买时间:</span>{{msg.value.maxBuyDuration|formatMonth}}月 </li>
       </ul>

    </div>
    <div v-if="txtype=='MsgCancelSellOrder'">
      <ul>
        <li><span class="lable">操作人:</span>  <AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >    </li>
        <li><span class="lable">类别:</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>    </li>
        <li><span class="lable">卖单id:</span> {{msg.value.orderId}}    </li>
      </ul>

    </div>
    <div v-if="txtype=='MsgWithDrawMarket'">
      <ul>
        <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      > </li>
        <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
        <li><span class="lable">金额:</span>{{getvalueformtags()|uAmountDenom}} </li>
        <li><span class="lable">市场名称:</span>{{msg.value.marketName}} </li>
      </ul>


    </div>
        <div v-if="txtype=='MsgMinerWithDraw'">
          <ul>
            <li><span class="lable">操作人:</span> <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      > </li>
            <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
            <li><span class="lable">金额:</span>{{getvalueformtags2()|uAmountDenom}} </li>
          </ul>


    </div>
    <div v-if="txtype=='MsgOrderRenewal'">
      <ul>
        <li><span class="lable">操作人:</span>  <AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      > </li>
        <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
        <li><span class="lable">订单ID:</span>{{msg.value.orderId}}</li>
        <li><span class="lable">时长:</span>{{msg.value.duration|formatMonth}}{{$t('Dialog.AutoBuy.month')}} </li>
      </ul>


    </div>

    <div v-if="txtype=='MsgDelegateMarket'">
      <ul>
        <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >  </li>
        <li><span class="lable">类别:</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
        <li><span class="lable">市场名称:</span> {{msg.value.marketName}} </li>
        <li><span class="lable">质押金额:</span> {{msg.value.amount|formatAmountdenom}} </li>
      </ul>


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
    ul{
      list-style: none;
      border-bottom: 1px solid #e4e0e0;
      li{
        margin-bottom: 5px;
      }
  }
  .lable{
    width: 100px;
    display: inline-block;
  }
</style>
