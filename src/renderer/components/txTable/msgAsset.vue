<template>
    <div>
        <div v-if="txtype=='MsgCreateAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{msg.value.token | formatAmountdenom }}</span>->
                <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>

                {{namefunc(msg.value.mint_type)}}
         </div>
         <div v-if="txtype=='MsgMintAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>

                <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>

         </div>
         <div v-if="txtype=='MsgLockAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>

                <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>
                {{$t('Dialog.com.locktime')}}   {{(msg.value.lock_duration / (1000 * 1000 * 1000 * 60 * 60 * 24)).toFixed(3) }}
             {{$t('staking.Explain.unit')}};

         </div>
         <div v-if="txtype=='MsgUnLockAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>

                <span  class="value">{{getAmount() | formatAmountdenom }}</span>


         </div>
         <div v-if="txtype=='MsgDestroyAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>



         </div>
         <div v-if="txtype=='MsgRuinAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{msg.value.symbol}}</span>



         </div>
          <div v-if="txtype=='MsgCreateDigitalAssetMarket'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value"></span>
                {{msg.value.marketName}}
                使用资产
                {{denomFormat(msg.value.assetName)}}



         </div>
         <div v-if="txtype=='MsgDismissDigitalAssetMarket'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value"></span>
                使用资产为
                {{denomFormat(msg.value.assetName)}}



         </div>

          <div v-if="txtype=='MsgAuthorizeMiningPubKey'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{msg.value.pubKey.value}}</span>



         </div>
         <div v-if="txtype=='MsgDigitalAssetPledge'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{msg.value.size}}GB</span>


         </div>
          <div v-if="txtype=='MsgDigitalAssetRefund'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{denomFormat(msg.value.assetName)}}</span>


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
    },
    namefunc(typeitem) {
      if (typeitem == 1) {
        return '不可增发';
      } else if (typeitem == 2) {
        return '一次性增发';
      } else {
        return '挖矿增发';
      }
    },
    denomFormat(denom) {
      return denom.substr(1);
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
