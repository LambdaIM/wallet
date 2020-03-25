<template>
    <div>
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;

      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      <span v-if="txtype=='MsgAssetPledge'">
        <span   class="value">{{msg.value.token | formatAmountdenom }}</span>
        ->
        <span   class="value">{{msg.value.asset | formatAmountdenom }}</span>
      </span>
      <span v-if="txtype=='MsgAssetDrop'">
        <span   class="value">{{msg.value.asset | formatAmountdenom }}</span>
        ->
        <span   class="value">{{msg.value.token | formatAmountdenom }}</span>

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
