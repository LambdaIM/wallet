<template>
    <div>
      <ul>
        <li><span class="lable">操作人:<AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink
      ></span></li>
        <li><span class="lable">类别:<Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></span></li>
      </ul>

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
