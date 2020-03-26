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
      {{msg.value.proposal_id}}
    </div>

    <div v-if="txtype=='MsgVote'">
        <AddressLink :addressLength="15" :to="msg.value.voter">{{msg.value.voter }}</AddressLink
      >&nbsp;
      <Tag color="primary">{{$t(`txType.${txtype}`)}}</Tag>


      {{$t(`proposalsPage.${msg.value.option}`)}}

      {{$t('txTable.to')}}
      {{$t('head.proposals')}}:
      {{msg.value.proposal_id}}
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
