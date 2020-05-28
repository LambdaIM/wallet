<template>
<div>

    <div v-if="txtype=='MsgSubmitProposal'">

      <ul>
        <li><span class="lable">操作人:</span> <AddressLink :addressLength="150" :to="msg.value.proposer">{{msg.value.proposer }}</AddressLink
        <li><span class="lable">类别:</span> <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
        <li><span class="lable">提案名称:</span> {{msg.value.content.value.title}} </li>
        <li><span class="lable">{{$t(`proposalsPage.Deposit`)}}:</span> <span v-for="item in msg.value.initial_deposit"  class="value">{{item | formatAmountdenom }}</span>  </li>

      </ul>


    </div>
    <div v-if="txtype=='MsgDeposit'">
      <ul>
        <li><span class="lable">操作人:</span> <AddressLink :addressLength="150" :to="msg.value.depositor">{{msg.value.depositor }}</AddressLink
      ></li>
        <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag> </li>
        <li><span class="lable">金额:</span> <span v-for="item in msg.value.amount"  class="value">{{item | formatAmountdenom }}</span></li>
        <li><span class="lable">提案:</span> <ProposalLink :id="msg.value.proposal_id" :name="title" /></li>
      </ul>


    </div>

    <div v-if="txtype=='MsgVote'">
      <ul>
        <li><span class="lable">操作人:</span> <AddressLink :addressLength="150" :to="msg.value.voter">{{msg.value.voter }}</AddressLink
      > </li>
        <li><span class="lable">类别:</span><Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>  </li>
        <li><span class="lable">提案:</span><ProposalLink :id="msg.value.proposal_id" :name="title" /></li>
        <li><span class="lable">投票选项:</span>{{$t(`proposalsPage.${msg.value.option}`)}}  </li>
      </ul>

    </div>



</div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  components: {
    AddressLink: () => import('./AddressLink.vue'),
    ProposalLink: () => import('./ProposalLink.vue')
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
      title: ''
    };
  },
  async mounted() {
    if (this.msg.value.proposal_id) {
      var title = await this.getname(this.msg.value.proposal_id);
      this.$data.title = title;
    }
  },
  methods: {
    async getname(id) {
      // getsyncValidator
      var name = '';
      let res = await ipc.callMain('getsyncproposalTitle', {
        id: id
      });
      if (res.state) {
        name = res.data.result;
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
