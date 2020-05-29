<template>
<div>


      <span v-if="txtype=='MsgWithdrawDelegationReward'">
        <ul>
          <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink
      > </li>
          <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
          <li><span class="lable">验证节点:</span><AddressLink :name="validator_name" :addressLength="150" :to="msg.value.validator_address">{{msg.value.validator_address }}</AddressLink
        > </li>
          <li><span class="lable">金额:</span><span class="value">
        {{getvalueformtags(msg.value.validator_address)|uAmountDenom}}
        </span> </li>
        </ul>

      </span>
      <span v-if="txtype=='MsgWithdrawValidatorCommission'">
        <ul>
          <li><span class="lable">操作人:</span>  <AddressLink :name="validator_name" :addressLength="150" :to="msg.value.validator_address">{{msg.value.validator_address }}</AddressLink
        >    </li>
          <li><span class="lable">类别:</span>  <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>    </li>
          <li><span class="lable">金额:</span>  <span class="value">
        {{getvalueformtags2(msg.value.validator_address)|uAmountDenom}}
        </span>    </li>
        </ul>

      </span>
      <span v-if="txtype=='MsgMinerWithDrawCount'">
        <ul>
          <li><span class="lable">操作人:</span> <AddressLink :addressLength="150" :to="msg.value.address">{{msg.value.address }}</AddressLink> </li>
          <li><span class="lable">类别:</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
          <li><span class="lable">页码:</span> {{msg.value.page}} </li>
          <li><span class="lable">页面大小:</span> {{msg.value.limit}} </li>
        </ul>


      </span>
      <span v-if="txtype=='MsgModifyWithdrawAddress'">
        <ul>
          <li><span class="lable">操作人:</span><AddressLink :addressLength="15" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink> </li>
          <li><span class="lable">类别:</span><AddressLink :addressLength="15" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink> </li>
          <li><span class="lable">提取收益的地址:</span><AddressLink :addressLength="15" :to="msg.value.withdraw_address">{{msg.value.withdraw_address }}</AddressLink> </li>
        </ul>


      </span>



</div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');

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
  data() {
    return {
      validator_name: ''
    };
  },
  async mounted() {
    if (this.msg.value.validator_address) {
      this.$data.validator_name = await this.getname(this.msg.value.validator_address);
    }
  },
  methods: {
    async getname(operator_addres) {
      // getsyncValidator
      var name = '';
      let res = await ipc.callMain('getsyncValidator', {
        operator_addres: operator_addres
      });
      if (res.state) {
        name = res.data.result.description.moniker;
      }
      console.log('name', name);
      return name;
    },
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
    },
    getvalueformtags2(address) {
      var result = '';
      var key = 'commission';
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
    },
    getvalueformtags3(address) {
      var result = '';
      var key = 'withdrawMiner';
      var tempresult;
      this.tags.forEach((item, index) => {
        if (item.key == key) {
          tempresult = item.value;
          result = tempresult;
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
