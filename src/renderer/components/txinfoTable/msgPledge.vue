<template>
    <div v-if="msgitem!=null">


      <span v-if="txtype=='MsgDelegate'">
        <ul>
          <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></li>
          <li><span class="lable">发送人:</span> <AddressLink :addressLength="150" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink> </li>
          <li><span class="lable">验证节点:</span>  <AddressLink  :addressLength="150" :name='msgitem.validator_name' :to="msg.value.validator_address"></AddressLink>  </li>
          <li><span class="lable">金额:</span><span  class="value">{{msg.value.amount | formatAmountdenom }}</span></li>

        </ul>


      </span>
      <span v-if="txtype=='MsgBeginRedelegate'">
        <ul>
          <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></li>
          <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink
      > </li>
          <li><span class="lable">旧节点:</span><AddressLink :addressLength="150" :name="msgitem.src_validator_name" :to="msg.value.validator_src_address"></AddressLink> </li>
          <li><span class="lable">新节点:</span><AddressLink :addressLength="150" :name="msgitem.dst_validator_name" :to="msg.value.validator_dst_address"></AddressLink> </li>
          <li><span class="lable">金额:</span><span  class="value">{{msg.value.amount | formatAmountdenom }}</span></li>
        </ul>

      </span>
      <span v-if="txtype=='MsgUndelegate'">
        <ul>
          <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag></li>
          <li><span class="lable">操作人:</span><AddressLink :addressLength="150" :to="msg.value.delegator_address">{{msg.value.delegator_address }}</AddressLink
      > </li>
          <li><span class="lable">验证节点:</span><AddressLink :addressLength="150" :name='msgitem.validator_name' :to="msg.value.validator_address"></AddressLink>  </li>
          <li><span class="lable">金额:</span><span  class="value">{{msg.value.amount | formatAmountdenom }}</span> </li>

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
    }
  },
  data() {
    return {
      msgitem: null
    };
  },
  async mounted() {
    console.log('********************');

    try {
      if (this.msg.value.validator_address) {
        this.msg.validator_name = await this.getname(this.msg.value.validator_address);
      }
      if (this.msg.value.validator_src_address) {
        this.msg.src_validator_name = await this.getname(this.msg.value.validator_src_address);
      }
      if (this.msg.value.validator_dst_address) {
        this.msg.dst_validator_name = await this.getname(this.msg.value.validator_dst_address);
      }
    } catch (error) {

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
