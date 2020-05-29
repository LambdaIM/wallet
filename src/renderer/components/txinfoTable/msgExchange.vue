<template>
    <div>

      <span v-if="txtype=='MsgAssetPledge'">
        <ul>
          <li><span class="lable">操作人</span> <AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      > </li>
      <li><span class="lable">类型</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
          <li><span class="lable">兑换金额</span> <span   class="value">{{msg.value.token | formatAmountdenom }}</span>
        ->
        <span   class="value">{{msg.value.asset | formatAmountdenom }}</span> </li>

        </ul>

      </span>
      <span v-if="txtype=='MsgAssetDrop'">
        <ul>
          <li><span class="lable">操作人</span> <AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      > </li>
      <li><span class="lable">类型</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
      <li><span class="lable">兑换金额</span> <span   class="value">{{msg.value.asset | formatAmountdenom }}</span>
        ->
        <span   class="value">{{msg.value.token | formatAmountdenom }}</span> </li>
        </ul>


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
