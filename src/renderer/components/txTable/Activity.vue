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
    <!-- {{txItem.type}} -->
    <msgSend  v-if="isType(txItem.type,send)"  :msg="txItem" :txtype="getType(txItem.type)"   />
    <msgExchange v-else-if="isType(txItem.type,assert)" :msg="txItem" :txtype="getType(txItem.type)"     />
    <msgPledge v-else-if="isType(txItem.type,pledge)" :msg="txItem" :txtype="getType(txItem.type)"     />
    <msgReward v-else-if="isType(txItem.type,Reward)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />
    <msgProposal v-else-if="isType(txItem.type,Proposal)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />
    <msgAsset v-else-if="isType(txItem.type,Asset)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />
    <msgValidator v-else-if="isType(txItem.type,Validator)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />
    <msgMiner v-else-if="isType(txItem.type,Miner)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />
    <msgMarket v-else-if="isType(txItem.type,Market)" :msg="txItem" :txtype="getType(txItem.type)"  :tags="tags"   />
    <div v-else>
      {{txItem.type}} ，{{$t('txkey.Newtypenotadapted')}}
    </div>


      <p v-if="getlogs(txIndex)!=null" class="error">
        {{$t('Dialog.com.Reason')}} : <Tag color="error"> {{ getlogs(txIndex).log }}</Tag>
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
import msgProposal from './msgProposal.vue';
import msgAsset from './msgAsset.vue';

import msgValidator from './msgValidator.vue';
import msgMiner from './msgMiner.vue';
import msgMarket from './msgMarket.vue';



export default {
  components: {
    AddressLink: () => import('./AddressLink.vue'),
    msgSend,
    msgPledge,
    msgExchange,
    msgReward,
    msgProposal,
    msgAsset,
    msgValidator,
    msgMiner,
    msgMarket
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
      Reward: ['MsgWithdrawDelegationReward', 'MsgWithdrawValidatorCommission', 'MsgMinerWithDrawCount', 'MsgModifyWithdrawAddress'],
      Proposal: ['MsgSubmitProposal', 'MsgDeposit', 'MsgVote'],
      Asset: ['MsgCreateAsset', 'MsgMintAsset', 'MsgLockAsset', 'MsgUnLockAsset', 'MsgDestroyAsset', 'MsgRuinAsset'],
      Validator: ['MsgCreateValidator', 'MsgEditValidator'],
      Miner: ['MsgMaintain', 'MsgUnMaintain', 'MsgCreateMiner', 'MsgEditMiner', 'MsgUnjailMiner'],
      Market: ['MsgCreateSellOrder', 'MsgCreateMarket', 'MsgEditMarket', 'MsgCancelSellOrder',
        'MsgCreateBuyOrder', 'MsgWithDrawMarket', 'MsgMinerWithDraw', 'MsgOrderRenewal', 'MsgDelegateMarket']
    };
  },
  methods: {
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
      console.log('getlogs');
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
      if (meList.length == 0) {
        meList = this.$props.activityData.slice(0, 2);
        otherList = this.$props.activityData.slice(2);
      }

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
