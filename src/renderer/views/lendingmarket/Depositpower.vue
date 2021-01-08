<template>
<div>
    <div class="customer-container">

      <div class="tableContainer">
        <Table :columns="columns1" :data="data1"></Table>
         <div class="btnholder">
            <Button class="btn" type="primary" >挖矿声明</Button>
            <Button class="btn" type="primary">取消挖矿</Button>
            <Button class="btn" type="primary">提取收益</Button>

          </div>

        </div>
    </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      columns1: [
        {
          title: '我的算力',
          key: 'Depositpower'
        },
        {
          title: '未提取的收益',
          key: 'Undrawnincome'
        },
        {
          title: '年华收益率',
          key: 'Rateofreturn'
        }
      ],
      data1: [
        {
          Depositpower: '1000tb',
          Undrawnincome: '10lamb',
          Rateofreturn: '10%'
        }
      ]
    };
  }

};
</script>
<style lang="less" scoped>
.customer-container {
  .container {
    margin-top: 40px;
  }
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 40px;
  }

  .btn{
    margin-right: 20px;
  }
  .btnholder{
    margin-top: 10px;
  }


}
</style>
