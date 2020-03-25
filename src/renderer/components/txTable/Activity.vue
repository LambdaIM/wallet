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
    <msgSend :msg="txItem" :txtype="getType(txItem.type)"  v-if="isType(txItem.type,send)"   />
    <msgExchange :msg="txItem" :txtype="getType(txItem.type)"  v-if="isType(txItem.type,assert)"   />
    <msgPledge v-if="isType(txItem.type,pledge)" :msg="txItem" :txtype="getType(txItem.type)"     />
    <msgReward v-if="isType(txItem.type,Reward)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />


      <p v-if="getlogs(txIndex)!=null" class="error">
        {{$t('Dialog.com.Reason')}} : <Tag color="error"> {{ getlogs(logs,txIndex).log }}</Tag>
      </p>
    </Col>
   <Col :md="md"
       :lg="lg"
        :xs="xs" >
    <div style="text-align: right;    padding-right: 20px">
        <!-- <Icon size="24" v-if="more==false" @click="showmore" type="md-more" /> -->
        <Button type="primary" v-if="more==false" @click="showmore"  shape="circle" icon="ios-more"></Button>
        <span v-else>&nbsp;</span>
    </div>
    </Col>
  </div>
</template>

<script>
import msgSend from './msgSend.vue';
import msgExchange from './msgExchange.vue';
import msgPledge from './msgPledge.vue';
import msgReward from './msgReward.vue';

export default {
  components: {
    AddressLink: () => import('./AddressLink.vue'),
    msgSend,
    msgPledge,
    msgExchange,
    msgReward
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
    },
    logs: {
      type: Array,
      default() {
        return [];
      }
    },
    tags: {
      type: Array,
      default() {
        return [];
      }

    }
  },
  data() {
    return {
      more: !(this.$props.activityData.length > 2),
      assert: ['MsgAssetPledge', 'MsgAssetDrop'],
      send: ['MsgSend'],
      pledge: ['MsgDelegate', 'MsgUndelegate', 'MsgBeginRedelegate'],
      Reward: ['MsgWithdrawDelegationReward']
    };
  },
  methods: {
    getToWord(txItem) {
      if (txItem.action == 'MsgWithdrawDelegationReward' || txItem.action == 'MsgWithdrawValidatorCommission' || txItem.action == 'MsgUndelegate') {
        return this.$t('txTable.Withdraw');
      } else {
        return this.$t('txTable.to');
      }
    },
    isProposal(txItem) {
      return txItem.action !== 'MsgSubmitProposal' &&
      txItem.action !== 'MsgUnjail' &&
      txItem.action !== 'MsgCreateValidator' &&
      txItem.action !== 'MsgCreateMarket' &&
      txItem.action !== 'MsgEditMarket' &&
      txItem.action !== 'MsgWithDrawMarket' &&
      txItem.action !== 'MsgCreateMachine' &&
      txItem.action !== 'MsgEditMachine' &&
      txItem.action !== 'MsgCreateMiner' &&
      txItem.action !== 'MsgMinerWithDraw' &&
      txItem.action !== 'MsgCreateSellOrder' &&
      txItem.action !== 'MsgCancelSellOrder' &&
      txItem.action !== 'MsgCreateBuyOrder' &&
      txItem.action !== 'MsgEditMiner' &&
      txItem.action !== 'MsgMaintain' &&
      txItem.action !== 'MsgUnMaintain' &&
      txItem.action !== 'MsgUnjailMiner' &&
      txItem.action !== 'MsgEditValidator' &&
      txItem.action !== 'MsgModifyWithdrawAddress' &&
      txItem.action !== 'MsgOrderRenewal'


      ;
    },
    showmore() {
      this.$data.more = true;
    },
    getType(typename) {
      return typename.split('/')[1];
    },
    isType(typename, list) {
      console.log('getType');
      var name = typename.split('/')[1];

      if (list != undefined && list.indexOf(name) > -1) {
        return true;
      } else {
        return false;
      }
    },
    getlogs(index) {
      var result = null;
      this.logs.forEach(element => {
        if (element.msg_index == index) {
          result = element;
        }
      });
      if (result == null || result.success == true) {
        return null;
      }

      return result;
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

.successc{
 color: #2D8cF0;
}
.errorc{
  color: #ed4014;
}
</style>
