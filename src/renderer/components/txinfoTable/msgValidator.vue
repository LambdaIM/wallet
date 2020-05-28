<template>
<div>
    <div v-if="txtype=='MsgCreateValidator'">
      <ul>
        <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink></li>
        <li><span class="lable">类型:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></li>
        <li><span class="lable">验证节点名称:</span>{{msg.value.description.moniker}}</li>
        <li><span class="lable">质押金额:</span><span class="value">{{msg.value.value| formatAmountdenom }}</span></li>
      </ul>

    </div>
    <div v-if="txtype=='MsgEditValidator'">
      <ul>
        <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink> </li>
        <li><span class="lable">类型:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></li>
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
    getAmount() {
      return {
        amount: this.getvalueformtags('amount'),
        denom: this.getvalueformtags('symbol')
      };
    },
    getvalueformtags(key) {
      var result = '';

      var tempresult;
      this.tags.forEach((item, index) => {
        if (item.key == key) {
          result = item.value;
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
