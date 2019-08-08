<template>
  <div class="customer-container">
  <div class="tableContainer">
       <Tabs >
        <TabPane label="我的代表" >
          <!-- <Table :columns="columns" :data="data" ></Table> -->
        </TabPane>
        <TabPane label="验证节点列表" >
          <Table :columns="columns" :data="validatorsList" >

          <template slot-scope="{ row, index }" slot="payment">
            {{row.commission.rate}}
          </template>
          <template slot-scope="{ row, index }" slot="description">
            {{row.description.moniker}}
          </template>
          <template slot-scope="{ row, index }" slot="vote">
            {{row.tokens/pool.bonded_tokens}}
          </template>
          <template slot-scope="{ row, index }" slot="operator_address">
            <router-link
            :to="link(row.operator_address)"
            class="item"
          >{{row.operator_address}}</router-link>
          </template>
          
          </Table>
        </TabPane>
        <TabPane label="说明" >说明</TabPane>
    </Tabs>
  </div>
    
  </div>
</template>

<script>
import MyTable from "@/components/common/useful/Mytable.vue";
const ipc = require("electron-better-ipc");

export default {
  data() {
    return {
      columns: [
        {
          title: "昵称",
          key: "description",
          slot:'description'
        
          
        },
        {
          title: "地址",
          key: "operator_address",
          slot:'operator_address'
        },
        {
          title: "佣金",
          key: "payment",
          slot:'payment'
        },
        {
          title: "投票权重",
          key: "vote",
          slot:'vote'
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            // console.log(params);
            if (params.row.status == "2") {
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
      ],
      validatorsList:[],
      pool:null
    };
  },
  mounted() {
    console.log('- -**************')
    this.getListData();
  },
  methods: {
   link(operator_address){
     console.log(operator_address);
    return "/stakinginfo/"+operator_address ;
   },
   async getListData(){
     console.log('getListData')
      try {
        let res = await ipc.callMain("validatorsList", {});
        let poolres= await ipc.callMain("pool", {});
        // console.log(res);
        console.log(res)
        console.log(poolres)
        if (res.state) {
          this.$data.validatorsList=res.data;
        }
        if(poolres.state){
          this.$data.pool=poolres.data
        }


      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd')
    }
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
