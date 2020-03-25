<template>
    <div>
        <AddressLink :addressLength="15" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      <span v-if="txtype=='MsgDelegate'">
        <span  class="value">{{msg.value.amount | formatAmountdenom }}</span>
        {{$t('txTable.to')}}
        <AddressLink :addressLength="15" :to="msg.value.validator_address">{{msg.value.validator_address }}</AddressLink
        >(节点名称)
      </span>
      <span v-if="txtype=='MsgBeginRedelegate'">
        <span  class="value">{{msg.value.amount | formatAmountdenom }}</span>
        {{$t('txTable.Withdraw')}}
        <AddressLink :addressLength="15" :to="msg.value.validator_src_address">{{msg.value.validator_src_address }}</AddressLink
        >(节点名称)
        {{$t('txTable.to')}}
        <AddressLink :addressLength="15" :to="msg.value.validator_dst_address">{{msg.value.validator_dst_address }}</AddressLink
        >(节点名称)
      </span>
      <span v-if="txtype=='MsgUndelegate'">
        <span  class="value">{{msg.value.amount | formatAmountdenom }}</span>
        {{$t('txTable.Withdraw')}}
        <AddressLink :addressLength="15" :to="msg.value.validator_address">{{msg.value.validator_address }}</AddressLink
        >(节点名称)

      </span>

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
