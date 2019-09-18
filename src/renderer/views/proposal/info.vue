<template>
  <div class="customer-container">
      <Mycard cardtitle="标题" class="mt20">
      <div slot="card-content">
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">State:</span>
            <Tag color="primary">VOTING PERIOD</Tag>
          </Col>
        </Row>

        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">Submitted:</span>*****
          </Col>
          <Col span="12">
            <span class="waptitle">Voting Start Date:</span>*********
          </Col>

        </Row>
        <Row class="rowitem">

          <Col span="12">
            <span class="waptitle">Voting End Date:</span>*********
          </Col>
          <Col span="12">
            <span class="waptitle">Total Vote Count:</span>*****
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
            <span class="waptitle">Yes:</span>*****
          </Col>
          <Col span="6">
            <span class="waptitle">No:</span>*****
          </Col>
          <Col span="6">
            <span class="waptitle">No with Veto:</span>*****
          </Col>
          <Col span="6">
            <span class="waptitle">Abstain:</span>*****
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">Description</span>
          </Col>
          <Col
            span="24"
          >This proposal is intended to supersede Cosmos Hub 3 Upgrade Proposal B: https://hubble.figment.network/cosmos/chains/cosmoshub-2/governance/proposals/14 This proposal is intended to signal acceptance/rejection of the precise software release that will contain the changes to be included in the Cosmos Hub 3 upgrade. A high overview of these changes was successfully approved by the voters signalling via Cosmos Hub 3 Upgrade Proposal A: https://hubble.figment.network/cosmos/chains/cosmoshub-2/governance/proposals/13 We are proposing to use this code https://github.com/cosmos/gaia/releases/tag/v2.0.0 to upgrade the Cosmos Hub. We are proposing to export the ledger’s state at Block Height 1823000, which we expect to occur on Sunday, September 15, 2019 at or around 2:00 pm UTC. We are proposing to launch Cosmos Hub 3 at 60 minutes after Block Height 1823000. The validator is responsible for setting the correct genesis time. Instructions for migration: https://github.com/cosmos/gaia/wiki/Cosmos-Hub-2-Upgrade Full proposal: https://ipfs.io/ipfs/QmZYGSVN4FqL6R8kGB8mzBmgHwE5geaf3JYAxBSaer2moa</Col>
        </Row>

      </div>
    </Mycard>
    <Mycard cardtitle="标题" class="mt20">
      <div slot="card-content">
        <Row class="rowitem">
          <Col span="24">
            <span class="waptitle">State:</span>
            <Tag color="primary">DEPOSIT PERIOD</Tag>
          </Col>
        </Row>

        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">Submitted:</span>*****
          </Col>
          <Col span="12">
            <span class="waptitle">Voting Start Date:</span>*********
          </Col>
        </Row>
        <Row class="rowitem">
          <Col span="12">
            <span class="waptitle">Deposit Count:</span>************
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
          >This proposal is intended to supersede Cosmos Hub 3 Upgrade Proposal B: https://hubble.figment.network/cosmos/chains/cosmoshub-2/governance/proposals/14 This proposal is intended to signal acceptance/rejection of the precise software release that will contain the changes to be included in the Cosmos Hub 3 upgrade. A high overview of these changes was successfully approved by the voters signalling via Cosmos Hub 3 Upgrade Proposal A: https://hubble.figment.network/cosmos/chains/cosmoshub-2/governance/proposals/13 We are proposing to use this code https://github.com/cosmos/gaia/releases/tag/v2.0.0 to upgrade the Cosmos Hub. We are proposing to export the ledger’s state at Block Height 1823000, which we expect to occur on Sunday, September 15, 2019 at or around 2:00 pm UTC. We are proposing to launch Cosmos Hub 3 at 60 minutes after Block Height 1823000. The validator is responsible for setting the correct genesis time. Instructions for migration: https://github.com/cosmos/gaia/wiki/Cosmos-Hub-2-Upgrade Full proposal: https://ipfs.io/ipfs/QmZYGSVN4FqL6R8kGB8mzBmgHwE5geaf3JYAxBSaer2moa</Col>
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

export default {
  components: {
    Mycard,
    DepositModelDialog,
    VoteModelDialog
  },
  data() {
    return {
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  methods: {
    openDeposit() {
      this.$refs.DepositModel.open('lambda1xweyhe30hxpjmwysx7shkrvhqukhmsmsdyvazp');
    },
    openVote() {
      this.$refs.VoteModel.open('lambda1xweyhe30hxpjmwysx7shkrvhqukhmsmsdyvazp');
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
