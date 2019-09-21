<template>
<div class="customer-container">
 <div class="tableContainer">
     <div v-for="item in List" class="itemhoder" :key="item.id" @click="goitem(item)">

     <Card  >

          <Row slot="title">


              <Col span="20"><h4 style=" word-break:break-all;">#{{item.id}}  {{item.content.value.title}}</h4></Col>
              <Col span="4">
                <Tag v-if="item.proposal_status==='Passed'" color="success">{{$t(`proposalsPage.typename.${item.proposal_status}`)}}</Tag>
                <Tag v-if="item.proposal_status==='Rejected'" color="error">{{$t(`proposalsPage.typename.${item.proposal_status}`)}}</Tag>
                <Tag v-if="item.proposal_status==='VotingPeriod'" color="warning">{{$t(`proposalsPage.typename.${item.proposal_status}`)}}</Tag>
                <Tag v-if="item.proposal_status==='DepositPeriod'" color="primary">{{$t(`proposalsPage.typename.${item.proposal_status}`)}}</Tag>
                <Tag v-if="item.proposal_status==='Removed'" color="default">{{$t(`proposalsPage.typename.${item.proposal_status}`)}}</Tag>
              </Col>
        </Row>

        <p style=" word-break:break-all;"   class="clickitem">

            {{item.content.value.description.substring(0,300)}}...



        </p>
        <p>
            {{item.content.type.split('/')[1]}}
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
      this.$router.push(`/proposalinfo/${item.id}`);
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
