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
          <Col span="12">
            <span class="waptitle">{{$t('proposalsPage.ProposalID')}}:</span>
            {{proposal_id}}


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
        <Row class="rowitem">
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.Yes')}}:</span>{{info.final_tally_result['yes']}}
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.No')}}:</span>{{info.final_tally_result['no']}}
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.NowithVeto')}}:</span>{{info.final_tally_result['no_with_veto']}}
          </Col>
          <Col span="6">
            <span class="waptitle">{{$t('proposalsPage.Abstain')}}:</span>{{info.final_tally_result['abstain']}}
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">{{$t('proposalsPage.Description')}}</span>
          </Col>
          <Col
            span="24"
          >
          {{info.content.type.split('/')[1]}}

          </Col>
          <Col span="24">
            <span class="waptitle">{{$t('proposalsPage.type')}}</span>
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
            <span class="waptitle">{{$t('proposalsPage.ProposalID')}}:</span>
            {{proposal_id}}


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
            <span class="waptitle">最小存款金额:</span>{{amount(DepositParameters.min_deposit)}}
          </Col>
          <Col span="12">
            <span class="waptitle">最大存款时间:</span>{{DepositParameters.max_deposit_period/(1000*1000*1000*60*60*24)}}{{$t('staking.Explain.unit')}}
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">{{$t('proposalsPage.type')}}</span>
          </Col>
          <Col
            span="24"
          >
          {{info.content.type.split('/')[1]}}

          </Col>
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
    <DepositModelDialog ref="DepositModel" />
    <VoteModelDialog ref="VoteModel" />
  </div>
</template>
<script>
import Mycard from '@/components/common/useful/Mycard.vue';
import DepositModelDialog from '@/views/Dialog/DepositModel.vue';
import VoteModelDialog from '@/views/Dialog/VoteModel.vue';
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

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
      DepositParameters: {}
    };
  },
  mounted() {
    this.getinfo();
    this.govDepositParameters();
    eventhub.$on('TransactionSuccess', async data => {
      console.log('TransactionSuccess');
      this.getinfo();
    });
  },
  methods: {
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
    amount(listamount) {
      if (listamount == null) {
        return '--';
      }
      var list = listamount.map(one => {
        return this.bigNumTypeFormat(one.amount, one.denom);
      });
      return list.join(',');
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
