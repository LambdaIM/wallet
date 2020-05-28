<template>
<div>

    <div v-if="txtype=='MsgSubmitProposal'">
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>
      {{msg.value.content.value.title}}
      {{$t(`proposalsPage.Deposit`)}}
      <span v-for="item in msg.value.initial_deposit"  class="value">{{item | formatAmountdenom }}</span>
    </div>
    <div v-if="txtype=='MsgDeposit'">
        <AddressLink :addressLength="15" :to="msg.value.depositor">{{msg.value.depositor }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>


      <span v-for="item in msg.value.amount"  class="value">{{item | formatAmountdenom }}</span>
      {{$t('txTable.to')}}
      {{$t('head.proposals')}}:
      <ProposalLink :id="msg.value.proposal_id" :name="title" />
    </div>

    <div v-if="txtype=='MsgVote'">
        <AddressLink :addressLength="15" :to="msg.value.voter">{{msg.value.voter }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>


      {{$t(`proposalsPage.${msg.value.option}`)}}

      {{$t('txTable.to')}}
      {{$t('head.proposals')}}:
      <ProposalLink :id="msg.value.proposal_id" :name="title" />
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
</style>
