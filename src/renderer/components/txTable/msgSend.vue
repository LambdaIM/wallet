<template>
    <div>
<!-- {{msg}}
<div>

</div> -->
      <AddressLink :addressLength="15" :to="msg.value.from_address">{{msg.value.from_address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
     <span v-for="item in msg.value.amount"  class="value">{{item | formatAmountdenom }}</span>
     {{$t('txTable.to')}}
     <AddressLink :addressLength="15" :to="msg.value.to_address">{{ msg.value.to_address }}</AddressLink>
      <!-- <Tag color="primary">{{$t(`txType.${txItem.}`)}}</Tag>
      <span v-if="isProposal(txItem)">
        <span class="value">{{ txItem.amount | formatAmount }}</span>
        <span v-if="txItem.to">
        {{getToWord(txItem)}}
      </span>

      </span>
      <AddressLink :addressLength="addressLength" :to="txItem.to">{{ txItem.to }}</AddressLink> -->
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
    }
  }

};
</script>
<style lang="less" scoped>

</style>
