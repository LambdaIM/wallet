<template>
    <div>
        <div v-if="txtype=='MsgCreateAsset'">
          <ul>
            <li><span class="lable">操作人</span><AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                > </li>
            <li><span class="lable">类别</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
            <li><span class="lable">金额</span> <span  class="value">{{msg.value.token | formatAmountdenom }}</span>->
                <span  class="value">{{msg.value.asset | formatAmountdenom }}</span></li>

            <li><span class="lable">是否可增发</span> {{msg.value.mintable ? $t('Dialog.com.mintabletrue') : $t('Dialog.com.mintablefalse')}}</li>
          </ul>

         </div>
         <div v-if="txtype=='MsgMintAsset'">
           <ul>
             <li><span class="lable">操作人</span> <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >   </li>
             <li><span class="lable">类别</span>  <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>  </li>
             <li><span class="lable">金额</span> <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>   </li>
           </ul>


         </div>
         <div v-if="txtype=='MsgLockAsset'">
           <ul>
             <li> <span class="lable">操作人</span> <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                >  </li>
             <li> <span class="lable">类别</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>  </li>
             <li> <span class="lable">金额</span> <span  class="value">{{msg.value.asset | formatAmountdenom }}</span>  </li>
             <li> <span class="lable">锁仓时间</span>  {{(msg.value.lock_duration / (1000 * 1000 * 1000 * 60 * 60 * 24)).toFixed(3) }}
             {{$t('staking.Explain.unit')}} </li>
           </ul>


         </div>
         <div v-if="txtype=='MsgUnLockAsset'">
            <ul>
              <li><span class="lable">操作人</span> <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink
                > </li>
              <li><span class="lable">类别</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>   </li>
              <li><span class="lable"> 金额 </span> <span  class="value">{{getAmount() | formatAmountdenom }}</span> </li>
            </ul>



         </div>
         <div v-if="txtype=='MsgDestroyAsset'">
           <ul>
             <li><span class="lable"> 操作人 </span> <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink>   </li>
             <li><span class="lable"> 类别 </span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>   </li>
             <li><span class="lable"> 金额 </span><span  class="value">{{msg.value.asset | formatAmountdenom }}</span> </li>
           </ul>

         </div>
         <div v-if="txtype=='MsgRuinAsset'">
           <ul>
             <li><span class="lable"> 操作人 </span><AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink>   </li>
             <li><span class="lable"> 类型 </span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>  </li>
             <li><span class="lable"> symbol </span><span  class="value">{{msg.value.symbol}}</span> </li>
           </ul>

            <AddressLink :addressLength="15" :to="msg.value.address">{{msg.value.address}}</AddressLink>&nbsp;
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
