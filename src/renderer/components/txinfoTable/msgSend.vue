<template>
    <div>

      <AddressLink :addressLength="15" :to="msg.value.from_address">{{msg.value.from_address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
     <span v-for="item in msg.value.amount"  class="value">{{item | formatAmountdenom }}</span>
     {{$t('txTable.to')}}
     <AddressLink :addressLength="15" :to="msg.value.to_address">{{ msg.value.to_address }}</AddressLink>
     <UL>
       <li>ssss1</li>
       <li>ssss2</li>
       <li>ssss3</li>
       <li>ssss4</li>
     </UL>



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
  ul{
      list-style: none;
  }
</style>
