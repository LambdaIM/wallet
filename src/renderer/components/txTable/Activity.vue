<template>
  <div id="a">
    <Col
      :md="md"
      :lg="lg"
      :xs="xs"
      v-for="(txItem, txIndex) in activityData"
      :key="txIndex"
      className="cardTable__content-activity"
    >

      <AddressLink :addressLength="addressLength" :to="txItem.from">{{ txItem.from }}</AddressLink
      >&nbsp;

      <Tag color="primary">{{$t(`txType.${txItem.action}`)}}</Tag> <span class="value">{{ txItem.amount | formatAmount }}</span>
      <span v-if="txItem.to">
       {{getToWord(txItem)}}
      <AddressLink :addressLength="addressLength" :to="txItem.to">{{ txItem.to }}</AddressLink>
      </span>
      <Tag v-if="txItem.valid" color="success">Success</Tag>
      <Tag v-if="!txItem.valid" color="error">Failed</Tag>
      <p v-if="!txItem.valid && showError == true" class="error">
        Because of : <Tag color="error"> {{ txItem.Log }}</Tag>
      </p>
    </Col>
  </div>
</template>

<script>
export default {
  components: {
    AddressLink: () => import('./AddressLink.vue')
  },
  props: {
    activityData: {
      type: Array
    },
    addressLength: {
      type: Number,
      default: 15
    },
    md: {
      type: Number
    },
    lg: {
      type: Number,
      default: 13
    },
    xs: {
      type: Number,
      default: 24
    },
    showError: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getToWord(txItem) {
      if (txItem.action == 'MsgWithdrawDelegationReward') {
        return this.$t('txTable.Withdraw');
      } else {
        return this.$t('txTable.to');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cardTable__content-activity {
  margin-bottom: 15px;
  .value {
    // font-weight: 600;
    color: #ff9800;
  }
  .error {
    margin-top: 10px !important;
  }
}
</style>
