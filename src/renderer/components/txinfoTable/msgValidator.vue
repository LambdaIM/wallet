<template>
<div>
    <div v-if="txtype=='MsgCreateValidator'">
      <AddressLink :addressLength="15" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink>&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{msg.value.description.moniker}}
      {{$t('txkey.pledge')}}
      <span class="value">{{msg.value.value| formatAmountdenom }}</span>
    </div>
    <div v-if="txtype=='MsgEditValidator'">
      <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address }}</AddressLink>&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>

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
</style>
