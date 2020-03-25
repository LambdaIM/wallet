<template>
<div>

    <AddressLink :addressLength="15" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      <span v-if="txtype=='MsgWithdrawDelegationReward'">
        <!-- <span  class="value">{{msg.value.amount | formatAmountdenom }}</span> -->
        {{$t('txTable.Withdraw')}}
        <AddressLink :addressLength="15" :to="msg.value.validator_address">{{msg.value.validator_address }}</AddressLink
        >(节点名称)
        <span class="value">
        {{getvalueformtags(msg.value.validator_address)|uAmountDenom}}
        </span>
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
    },
    tags: {
      type: Array,
      default() {
        return [];
      }

    }
  },
  methods: {
    getvalueformtags(address) {
      var result = '';
      var key = 'rewards';
      var tempresult;
      this.tags.forEach((item, index) => {
        if (item.key == key) {
          tempresult = item.value;
        }
        if (item.key == 'source-validator' && item.value == address) {
          result = tempresult;
        }
      });
      return result;
    }
  }

};
</script>
