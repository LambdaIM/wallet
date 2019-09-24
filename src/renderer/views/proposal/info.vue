<template>
  <div class="customer-container">
      <Mycard v-if="info!=null&&showType" :cardtitle="info.content.value.title" class="mt20">
      <div slot="card-content">
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Status')}}:</span>

            <Tag v-if="info.proposal_status==='Passed'" color="success">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='Rejected'" color="error">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='VotingPeriod'" color="warning">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='DepositPeriod'" color="primary">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='Removed'" color="default">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
          </Col>
          <Col  span="12">
          <span @click="goexplor(proposal_id)">
            <span class="waptitle">{{$t('proposalsPage.ProposalID')}}:</span>
            <a>{{proposal_id}} <Icon type="ios-redo" /> </a>
          </span>


          </Col>
        </Row>


        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.SubmitTime')}}:</span>{{info.submit_time|formatDate}}
          </Col>
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.VotingStartTime')}}:</span>{{info.voting_start_time|formatDate}}
          </Col>

        </Row>
        <Row class="rowitem">

          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.EndVotingTime')}}:</span>{{info.voting_end_time|formatDate}}
          </Col>
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.TotalVoteCount')}}:</span>{{allVote(info.final_tally_result)}}
          </Col>
        </Row>
        <Row class="rowitem">

          <Col span="24">
          <div style="text-align: center;">
             <Button  v-if="info.proposal_status==='VotingPeriod'" @click="openVote" type="primary">{{$t('proposalsPage.Vote')}}</Button>
          </div>
          </Col>
        </Row>
        <Row v-if="info.proposal_status!=='VotingPeriod'" class="rowitem">
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.Yes')}}:</span>{{info.final_tally_result['yes']}}({{percentage(info.final_tally_result['yes'],info.final_tally_result)}})
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.No')}}:</span>{{info.final_tally_result['no']}}({{percentage(info.final_tally_result['no'],info.final_tally_result)}})
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.NoWithVeto')}}:</span>{{info.final_tally_result['no_with_veto']}}({{percentage(info.final_tally_result['no_with_veto'],info.final_tally_result)}})
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.Abstain')}}:</span>{{info.final_tally_result['abstain']}}({{percentage(info.final_tally_result['abstain'],info.final_tally_result)}})
          </Col>
          <Col span="12">
            <span class="waptitle"> {{$t('proposalsPage.onlinevotingpower')}} :</span>{{percentageall(info.final_tally_result,poolres) }}
          </Col>
        </Row>
        <Row v-else class="rowitem">
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.Yes')}}:</span>{{proposalTally['yes']}}({{percentage(proposalTally['yes'],proposalTally) }})
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.No')}}:</span>{{proposalTally['no']}}({{percentage(proposalTally['no'],proposalTally) }})
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.NoWithVeto')}}:</span>{{proposalTally['no_with_veto']}}({{percentage(proposalTally['no_with_veto'],proposalTally) }})
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.Abstain')}}:</span>{{proposalTally['abstain']}}({{percentage(proposalTally['abstain'],proposalTally) }})
          </Col>
          <Col span="12">
            <span class="waptitle"> {{$t('proposalsPage.onlinevotingpower')}} :</span>{{percentageall(proposalTally,poolres) }}
          </Col>
        </Row>


        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Mydeposit')}}:</span>{{amount(myDeposit)}}
          </Col>
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Myvote')}}:</span>
            {{myvote!=''?$t(`proposalsPage.${myvote}`):'--'}}

          </Col>

        </Row>
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.type')}}</span>:{{$t(`proposalsPage.${proposaltype}`) }}
          </Col>
          <Col span="12" v-if="proposaltype==='CommunityPoolSpendProposal'">
            <span class="waptitle">{{$t('proposalsPage.amount')}}</span>:{{amount(info.content.value.amount)}}
          </Col>
          <Col span="12" v-if="proposaltype==='CommunityPoolSpendProposal'">
            <span class="waptitle">{{$t('proposalsPage.recipient')}}</span>:{{info.content.value.recipient}}
          </Col>
          <Col span="12" v-if="proposaltype==='BurnCoinsProposal'">
            <span class="waptitle">{{$t('proposalsPage.burn_amount')}}</span>:{{amount(info.content.value.burn_amount)}}
          </Col>
          <Col span="24" v-if="proposaltype==='ParameterChangeProposal'">
            <span class="waptitle">{{$t('proposalsPage.parameterlist')}} </span>:

             <Table :columns="ParameterChange" :data="info.content.value.changes"></Table>
          </Col>



          </Col>
        </Row>
        <Row class="rowitem">

          <Col span="24">
            <span class="waptitle">{{$t('proposalsPage.Description')}}</span>
          </Col>
          <Col
            span="24"
          >
          <div style=" word-break:break-all;">
            {{info.content.value.description}}
            </div>

          </Col>
        </Row>

      </div>
    </Mycard>
    <Mycard   v-if="info!=null&&showType==false" :cardtitle="info.content.value.title" class="mt20">
      <div slot="card-content">
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Status')}}:</span>
            <Tag v-if="info.proposal_status==='Passed'" color="success">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='Rejected'" color="error">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='VotingPeriod'" color="warning">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='DepositPeriod'" color="primary">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
            <Tag v-if="info.proposal_status==='Removed'" color="default">{{$t(`proposalsPage.typename.${info.proposal_status}`)}}</Tag>
          </Col>
          <Col span="12">
            <span @click="goexplor(proposal_id)">
            <span class="waptitle">{{$t('proposalsPage.ProposalID')}}:</span>
            <a>{{proposal_id}} <Icon type="ios-redo" /> </a>
          </span>


          </Col>
        </Row>

        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.SubmitTime')}}:</span>{{info.submit_time|formatDate}}
          </Col>
          <Col v-if="info.proposal_status!=='DepositPeriod'"  span="12">
            <span class="waptitle">{{$t('proposalsPage.VotingStartTime')}}:</span>{{info.voting_start_time|formatDate}}
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.DepositCount')}}:</span>{{amount(info.total_deposit)}}
          </Col>
          <Col span="12">
            <Button v-if="info.proposal_status==='DepositPeriod'" @click="openDeposit" type="primary">{{$t('proposalsPage.Deposit')}}</Button>
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Needdeposit')}}:</span>{{amount(DepositParameters.min_deposit)}}
          </Col>
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Thelongestdepositperiod')}}:</span>{{DepositParameters.max_deposit_period/(1000*1000*1000*60*60*24)}}{{$t('staking.Explain.unit')}}
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.Mydeposit')}}:</span>{{amount(myDeposit)}}
          </Col>

        </Row>

        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.type')}}</span>:{{$t(`proposalsPage.${proposaltype}`) }}
          </Col>
          <Col span="12" v-if="proposaltype==='CommunityPoolSpendProposal'">
            <span class="waptitle">{{$t('proposalsPage.amount')}}</span>:{{amount(info.content.value.amount)}}
          </Col>
          <Col span="12" v-if="proposaltype==='CommunityPoolSpendProposal'">
            <span class="waptitle">{{$t('proposalsPage.recipient')}}</span>:{{info.content.value.recipient}}
          </Col>
          <Col span="12" v-if="proposaltype==='BurnCoinsProposal'">
            <span class="waptitle">{{$t('proposalsPage.burn_amount')}}</span>:{{amount(info.content.value.burn_amount)}}
          </Col>
          <Col span="24" v-if="proposaltype==='ParameterChangeProposal'">
            <span class="waptitle">{{$t('proposalsPage.parameterlist')}} </span>:

             <Table :columns="ParameterChange" :data="info.content.value.changes"></Table>
          </Col>



          </Col>
        </Row>
        <Row class="rowitem">

          <Col span="24">
            <span class="waptitle">{{$t('proposalsPage.Description')}}</span>
          </Col>
          <Col
            span="24"
          >
          <div style=" word-break:break-all;">
            {{info.content.value.description}}
            </div>

          </Col>
        </Row>
        </Row>
      </div>
    </Mycard>
    <DepositModelDialog ref="DepositModel" />
    <VoteModelDialog ref="VoteModel" />
  </div>
</template>
<script>
import Mycard from '@/components/common/useful/Mycard.vue';
import DepositModelDialog from '@/views/Dialog/DepositModel.vue';
import VoteModelDialog from '@/views/Dialog/VoteModel.vue';
import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');

export default {
  components: {
    Mycard,
    DepositModelDialog,
    VoteModelDialog
  },
  data() {
    return {
      info: null,
      showType: false,
      proposal_id: null,
      DepositParameters: {},
      myDeposit: [],
      myvote: '',
      proposalTally: {},
      proposaltype: '',
      ParameterChange: [
        {
          title: this.$t('proposalsPage.subspace'),
          key: 'subspace'
        },
        {
          title: this.$t('proposalsPage.key'),
          key: 'key'
        },
        {
          title: this.$t('proposalsPage.value'),
          key: 'value'
        }

      ],
      poolres: null
    };
  },
  mounted() {
    this.getinfo();
    this.govDepositParameters();
    this.proposalmyDeposit();
    this.proposalmyVote();
    this.proposalTallyIng();
    this.poolTallyIng();
    eventhub.$on('TransactionSuccess', async data => {
      console.log('TransactionSuccess');
      this.getinfo();
      this.proposalmyDeposit();
      this.proposalmyVote();
      this.proposalTallyIng();
      this.poolTallyIng();
    });
  },
  methods: {
    goexplor(id) {
      var explorer = DAEMON_CONFIG.explore;
      let url = `${explorer}#proposalDetail/{id}`;
      shell.openExternal(url);
    },
    allVote(item) {
      console.log('allVote');
      var result = 0;
      for (var key in item) {
        // this.bigNum(item[key]).
        result = result + parseInt(item[key]);
      }
      return result;

      // this.bigNum()
    },
    openDeposit() {
      this.$refs.DepositModel.open(this.$data.proposal_id, this.$data.info.content.value.title);
    },
    openVote() {
      this.$refs.VoteModel.open(this.$data.proposal_id, this.$data.info.content.value.title);
    },
    async getinfo() {
      this.$data.proposal_id = this.$route.params.proposal_id;
      let res = await ipc.callMain('proposalInfo', {
        id: this.$data.proposal_id
      });
      if (res.state) {
        this.$data.info = res.data.data;
        this.$data.proposaltype = res.data.data.content.type.split('/')[1];
        if (['VotingPeriod', 'Rejected', 'Passed'].indexOf(this.$data.info.proposal_status) > -1) {
          this.$data.showType = true;
        } else {
          this.$data.showType = false;
        }
      }
      console.log(res);
    },
    async govDepositParameters() {
      let res = await ipc.callMain('govDepositParameters', {

      });
      if (res.state) {
        this.$data.DepositParameters = res.data.data;
      }
    },
    async proposalmyDeposit() {
      let res = await ipc.callMain('proposalDeposit', {
        id: this.$data.proposal_id
      });
      if (res.state) {
        this.$data.myDeposit = res.data.data.amount;
      }
    },
    async proposalmyVote() {
      let res = await ipc.callMain('proposalVote', {
        id: this.$data.proposal_id
      });
      if (res.state && res.data.data.error == undefined) {
        this.$data.myvote = res.data.data.option;
      }
    },
    async proposalTallyIng() {
      let res = await ipc.callMain('proposalTally', {
        id: this.$data.proposal_id
      });
      if (res.state) {
        this.$data.proposalTally = res.data.data;
      }
    },
    async poolTallyIng() {
      let res = await ipc.callMain('pool', {
      });
      if (res.state) {
        this.$data.poolres = res.data.bonded_tokens;
      }
    },
    amount(listamount) {
      if (listamount == null) {
        return '--';
      }
      var list = listamount.map(one => {
        return this.bigNumTypeFormat(one.amount, one.denom);
      });
      return list.join(',');
    },
    oneamount(one) {
      if (one == null) {
        return '--';
      }
      return this.bigNumTypeFormat(one.amount, one.denom);
    },
    percentage(value, item) {
      if (value == undefined || item['yes'] == undefined) {
        return;
      }
      var p1 = this.bigNum(value);
      var p2 = this.bigNum(0);
      for (var key in item) {
        p2 = p2.plus(item[key]);
      }
      if (p2.toNumber() === 0) {
        return '0%';
      }
      return p1.div(p2).times(100) + '%';
    },
    percentageall(item, all) {
      if (all == null || item['yes'] == undefined) {
        return;
      }
      var p2 = this.bigNum(0);
      for (var key in item) {
        p2 = p2.plus(item[key]);
      }

      return p2.div(all).times(100) + '%';
    }

  }
};
</script>
<style lang="less" scoped>
.customer-container {
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 40px;
  }
  .itemhoder {
    margin: 10px;
  }
  .rowitem {
    margin: 15px;
  }
  .waptitle {
    font-weight: bolder;
  }
}
</style>
