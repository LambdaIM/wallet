<template>
<div class="customer-container">
 <div class="tableContainer">
     <div v-for="item in data" class="itemhoder" :key="item">

     <Card  >

          <Row slot="title">


              <Col span="20"><h4>No border title</h4></Col>
              <Col span="4"><Tag color="primary">primary</Tag> </Col>
        </Row>

        <p @click="goitem"  class="clickitem">

            Content of no border type. Content of no border type. Content of no border type. Content of no border type.


        </p>
        </Card>

   </div>
        <br/><br/><br/><br/><br/><br/>
 </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  methods: {
    goitem() {
      this.$router.push('/proposalinfo');
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
