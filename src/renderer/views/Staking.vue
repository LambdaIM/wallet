<template>
  <div class="customer-container">
  <div class="tableContainer">
       <Tabs >
        <TabPane label="我的代表" >
          <Table :columns="columns" :data="data" ></Table>
        </TabPane>
        <TabPane label="验证节点列表" >验证节点列表</TabPane>
        <TabPane label="说明" >说明</TabPane>
    </Tabs>
  </div>
    
  </div>
</template>

<script>
import MyTable from "@/components/common/useful/Mytable.vue";
export default {
  data() {
    return {
      columns: [
        {
          title: "GB",
          key: "gb"
        },
        {
          title: "Price",
          key: "price"
        },
        {
          title: "Period",
          key: "period"
        },
        {
          title: "Payment",
          key: "payment"
        },
        {
          title: "Charged ",
          key: "charged"
        },
        {
          title: "Status",
          key: "status",
          render: (h, params) => {
            // console.log(params);
            if (params.row.status == "1") {
              this.stateType = "md-checkmark";
            } else {
              this.stateType = "md-close";
            }
            return h("Icon", {
              props: {
                type: `${this.stateType}`,
                size: 32
              }
            });
          }
        }
      ],
      data: [
        {
          gb: "5 GB",
          price: "50 LAMB",
          period: "30 Days",
          payment: "50 LAMB",
          charged: "50 LAMB",
          status: 1
        },
        {
          gb: "10 GB",
          price: "50 LAMB",
          period: "30 Days",
          payment: "50 LAMB",
          charged: "50 LAMB",
          status: 0
        },
        {
          gb: "5 GB",
          price: "50 LAMB",
          period: "30 Days",
          payment: "50 LAMB",
          charged: "50 LAMB",
          status: 1
        }
      ]
    };
  },
  components: {
    MyTable
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
}
</style>
