<template>
    <div>
        <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{msg.value.sellSize}} GB {{$t('orderinfo.unitprice')}} {{msg.value.price|Lambformat}}
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
<style lang="less">
  .value {
    // font-weight: 600;
    color: #ff9800;
  }
</style>
