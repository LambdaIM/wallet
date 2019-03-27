<template>
  <div class="customer-container">
    <MyTable title="Customer(Order)" class="tableContainer">
      <Table :columns="columns" :data="data" slot="content"></Table>
    </MyTable>
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
    margin-top: 40px;
  }
}
</style>
