<template>
  <div id="a">
    <Col
      :md="md"
      :lg="lg"
      :xs="xs"
      v-for="(txItem, txIndex) in activityDataList"
      :key="txIndex"
      className="cardTable__content-activity"
    >

      <AddressLink :addressLength="addressLength" :to="txItem.from">{{ txItem.from }}</AddressLink
      >&nbsp;

      <Tag color="primary">{{$t(`txType.${txItem.action}`)}}</Tag>
      <span v-if="isProposal(txItem)">
        <span class="value">{{ txItem.amount | formatAmount }}</span>
        <span v-if="txItem.to">
        {{getToWord(txItem)}}
      </span>

      </span>
      <AddressLink :addressLength="addressLength" :to="txItem.to">{{ txItem.to }}</AddressLink>
      <Tag v-if="txItem.valid" color="success">Success</Tag>
      <Tag v-if="!txItem.valid" color="error">Failed</Tag>
      <p v-if="!txItem.valid && showError == true" class="error">
        {{$t('Dialog.com.Reason')}} : <Tag color="error"> {{ txItem.log }}</Tag>
      </p>
    </Col>
   <Col :md="md"
       :lg="lg"
        :xs="xs" >
    <div style="text-align: right;    padding-right: 20px">
        <Icon size="24" v-if="more==false" @click="showmore" type="md-more" />
        <span v-else>&nbsp;</span>
    </div>
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
  data() {
    return {
      more: !(this.$props.activityData.length > 2)
    };
  },
  methods: {
    getToWord(txItem) {
      if (txItem.action == 'MsgWithdrawDelegationReward' || txItem.action == 'MsgWithdrawValidatorCommission') {
        return this.$t('txTable.Withdraw');
      } else {
        return this.$t('txTable.to');
      }
    },
    isProposal(txItem) {
      return txItem.action !== 'MsgSubmitProposal';
    },
    showmore() {
      this.$data.more = true;
    }
  },
  computed: {
    activityDataList() {
      // .from   .to
      if (this.$props.activityData.length == 1) {
        return this.$props.activityData;
      }
      var me = this.$store.getters.getaddress;
      var meList = []; var otherList = [];
      this.$props.activityData.forEach(item => {
        if ((item.to == me || item.from == me) && meList.length < 2) {
          meList.push(item);
        } else {
          otherList.push(item);
        }
      });

      if (this.more) {
        return meList.concat(otherList);
      } else {
        return meList;
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
