<template>
  <div class="customer-container">
      <Mycard v-if="info!=null&&showType" :cardtitle="info.proposal_content.value.title" class="mt20">
      <div slot="card-content">
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">State:</span>

            <Tag v-if="info.proposal_status==='Passed'" color="success">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='Rejected'" color="error">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='VotingPeriod'" color="warning">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='DepositPeriod'" color="primary">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='Removed'" color="default">{{info.proposal_status}}</Tag>
          </Col>
        </Row>

        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">Submitted:</span>{{info.submit_time|formatDate}}
          </Col>
          <Col span="12">
            <span class="waptitle">Voting Start Date:</span>{{info.voting_start_time|formatDate}}
          </Col>

        </Row>
        <Row class="rowitem">

          <Col span="12">
            <span class="waptitle">Voting End Date:</span>{{info.voting_start_time|formatDate}}
          </Col>
          <Col span="12">
            <span class="waptitle">Total Vote Count:</span>{{info.voting_end_time|formatDate}}
          </Col>
        </Row>
        <Row class="rowitem">

          <Col span="24">
          <div style="text-align: center;">
             <Button @click="openVote" type="primary">vote</Button>
          </div>
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="6">
            <span class="waptitle">Yes:</span>{{info.final_tally_result['yes']}}
          </Col>
          <Col span="6">
            <span class="waptitle">No:</span>{{info.final_tally_result['no']}}
          </Col>
          <Col span="6">
            <span class="waptitle">No with Veto:</span>{{info.final_tally_result['no_with_veto']}}
          </Col>
          <Col span="6">
            <span class="waptitle">Abstain:</span>{{info.final_tally_result['abstain']}}
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">Description</span>
          </Col>
          <Col
            span="24"
          >
          {{info.proposal_content.value.description}}

          </Col>
        </Row>

      </div>
    </Mycard>
    <Mycard   v-if="info&&showType==false" :cardtitle="info.proposal_content.value.title" class="mt20">
      <div slot="card-content">
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">State:</span>
            <Tag v-if="info.proposal_status==='Passed'" color="success">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='Rejected'" color="error">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='VotingPeriod'" color="warning">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='DepositPeriod'" color="primary">{{info.proposal_status}}</Tag>
            <Tag v-if="info.proposal_status==='Removed'" color="default">{{info.proposal_status}}</Tag>
          </Col>
        </Row>

        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">Submitted:</span>{{info.submit_time|formatDate}}
          </Col>
          <Col span="12">
            <span class="waptitle">Voting Start Date:</span>{{info.voting_start_time|formatDate}}
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">Deposit Count:</span>{{amount(info.total_deposit)}}
          </Col>
          <Col span="12">
            <Button @click="openDeposit" type="primary">Deposit</Button>
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">Description</span>
          </Col>
          <Col
            span="24"
          >
           {{info.proposal_content.value.description}}
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
      showType: false
    };
  },
  mounted() {
    this.getinfo();
  },
  methods: {
    openDeposit() {
      this.$refs.DepositModel.open('lambda1xweyhe30hxpjmwysx7shkrvhqukhmsmsdyvazp');
    },
    openVote() {
      this.$refs.VoteModel.open('lambda1xweyhe30hxpjmwysx7shkrvhqukhmsmsdyvazp');
    },
    async getinfo() {
      let proposal_id = this.$route.params.proposal_id;
      let res = await ipc.callMain('proposalInfo', {
        id: proposal_id
      });
      if (res.state) {
        this.$data.info = res.data.data;
        if (['VotingPeriod'].indexOf(this.$data.info.proposal_status) > -1) {
          this.$data.showType = true;
        } else {
          this.$data.showType = false;
        }
      }
      console.log(res);
    },
    amount(listamount) {
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
