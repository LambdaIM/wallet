<template>
    <div>
        <div v-if="txtype=='MsgCreateAsset'">
            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >&nbsp;
                <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
                <span  class="value">{{msg.value.token | formatAmountdenom }}</span>->
                <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>
                {{msg.value.mintable ? $t('Dialog.com.mintabletrue') : $t('Dialog.com.mintablefalse')}}
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
