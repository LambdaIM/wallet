<template>
<div class="customer-container">
 <div class="tableContainer">
     <div v-for="item in List" class="itemhoder" :key="item.proposal_id">

     <Card  >

          <Row slot="title">


              <Col span="20"><h4>#{{item.proposal_id}}  {{item.proposal_content.value.title}}</h4></Col>
              <Col span="4">
                <Tag v-if="item.proposal_status==='Passed'" color="success">{{item.proposal_status}}</Tag>
                <Tag v-if="item.proposal_status==='Rejected'" color="error">{{item.proposal_status}}</Tag>
                <Tag v-if="item.proposal_status==='VotingPeriod'" color="warning">{{item.proposal_status}}</Tag>
                <Tag v-if="item.proposal_status==='DepositPeriod'" color="primary">{{item.proposal_status}}</Tag>
                <Tag v-if="item.proposal_status==='Removed'" color="default">{{item.proposal_status}}</Tag>
              </Col>
        </Row>

        <p @click="goitem(item)"  class="clickitem">

            {{item.proposal_content.value.description.substring(0,300)}}...


        </p>
        </Card>

   </div>
        <br/><br/><br/><br/><br/><br/>
 </div>
</div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      List: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    goitem(item) {
      this.$router.push(`/proposalinfo/${item.proposal_id}`);
    },
    async getList() {
      let res = await ipc.callMain('proposalList', {});
      if (res.state) {
        this.$data.List = res.data.data.reverse();
      }
      console.log(res);
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
  .itemhoder{
      margin: 10px;
  }
  .clickitem{
      cursor: pointer;
      padding: 10px;
  }
}

</style>
