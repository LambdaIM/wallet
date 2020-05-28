<template>
    <div v-if="msgitem!=null">
        <AddressLink :addressLength="15" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      <span v-if="txtype=='MsgDelegate'">
        <span  class="value">{{msg.value.amount | formatAmountdenom }}</span>
        {{$t('txTable.to')}}

        <AddressLink  :addressLength="15" :name='msgitem.validator_name' :to="msg.value.validator_address"></AddressLink>

      </span>
      <span v-if="txtype=='MsgBeginRedelegate'">
        <span  class="value">{{msg.value.amount | formatAmountdenom }}</span>
        {{$t('txTable.Withdraw')}}
        <AddressLink :addressLength="15" :name="msgitem.src_validator_name" :to="msg.value.validator_src_address"></AddressLink>
        {{$t('txTable.to')}}
        <AddressLink :addressLength="15" :name="msgitem.dst_validator_name" :to="msg.value.validator_dst_address"></AddressLink>
      </span>
      <span v-if="txtype=='MsgUndelegate'">
        <span  class="value">{{msg.value.amount | formatAmountdenom }}</span>
        {{$t('txTable.Withdraw')}}
        <AddressLink :addressLength="15" :name='msgitem.validator_name' :to="msg.value.validator_address"></AddressLink>

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
    }
  },
  data() {
    return {
      msgitem: null
    };
  },
  async mounted() {
    console.log('********************');


    if (this.msg.value.validator_address) {
      this.msg.validator_name = await this.getname(this.msg.value.validator_address);
    }
    if (this.msg.value.validator_src_address) {
      this.msg.src_validator_name = await this.getname(this.msg.value.validator_src_address);
    }
    if (this.msg.value.validator_dst_address) {
      this.msg.dst_validator_name = await this.getname(this.msg.value.validator_dst_address);
    }
    this.$data.msgitem = this.msg;
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
