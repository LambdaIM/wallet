<template>
  <div class="customer-container">
  <div class="tableContainer">
       <Tabs >
        <TabPane label="我的代表" >
          <Table :columns="columnsme" :data="mydelegationsList" >
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
        <TabPane label="解绑中" >
            <Table :columns="uncolumns" :data="myUndelegationsList" >
        
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
          title: "质押地址",
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
      columnsme: [
        {
          title: "昵称",
          key: "description",
          slot:'description'
        
          
        },
        {
          title: "我的质押",
          key: "shares",
          
        },
        {
          title: "我的收益",
          key: "reward",
          
        },
        {
          title: "质押地址",
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
      validatorsList:[],
      pool:null,
      mydelegationsList:[],
      myUndelegationsList:[],
      uncolumns:[{
          title: "质押地址",
          key: "validator_address"
        },
        {
          title: "解绑地址",
          key: "delegator_address"
        },
        {
          title: "区块高度",
          key: "creation_height",
          
        },{
          title: "解绑金额(lamb)",
          key: "initial_balance",
          
        },{
          title: "完成时间",
          key: "completion_time",
          
        },
        

      ]
    };
  },
 async mounted() {
    
   var r1= await this.getListData();
   var r2= await this.getmyListData();
   this.getmyUnListData();
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
    },
    async getmyListData(){
     console.log('getListData')
      try {
        let res = await ipc.callMain("mydelegations", {
          operator_address:this.address
        });
        // let poolres= await ipc.callMain("pool", {});
        // console.log(res);
        console.log(res)
        // console.log(poolres)
        if (res.state) {
          this.$data.mydelegationsList=res.data;
          this.validatorsListForMe();
          

        }
        // if(poolres.state){
        //   this.$data.pool=poolres.data
        // }


      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd')
    },
    validatorsListForMe(){
      var list=[]
        this.$data.mydelegationsList.forEach((myitem)=>{
                this.$data.validatorsList.forEach((item)=>{
                      if(item.operator_address==myitem.validator_address){
                        myitem=Object.assign({},myitem,item)
                        myitem.reward='--'
                        list.push(myitem)
                       }
            
                })
            })
        this.$data.mydelegationsList=list;
        console.log(this.$data.mydelegationsList)
        this.getMyRewardsList();
        
    },
    getMyRewardsList(){
       this.$data.mydelegationsList.forEach(async(item)=>{
         try {
           let res = await ipc.callMain("delegatorRewardsFromValidator", {
              operator_address:this.address,
              validatorAddr:item.validator_address
            });
            if (res.state) {
              console.log(res.data)
              item.reward=this.coinListFormart(res.data) ;
              // item.reward='---11111';
            }
           
         } catch (error) {
           console.log(error)
           
         }

       })
       console.log('==============')
       console.log(this.$data.mydelegationsList)
    },
    coinListFormart(list){
      var result =[]
      list.forEach((item)=>{
        result.push(item.amount+item.denom)
      })
      return result.join(',')

    },
    async getmyUnListData(){
        console.log('myUndelegations')
      try {
        let res = await ipc.callMain("myUndelegations", {
          operator_address:this.address
        });
        // let poolres= await ipc.callMain("pool", {});
        // console.log(res);
        console.log(res)
        // console.log(poolres)
        if (res.state) {
          var list=[]
          res.data.forEach((item)=>{
            item.entries.forEach((entrie)=>{
              var result=Object.assign({},entrie,{
                  validator_address:item.validator_address,
                  delegator_address:item.delegator_address
                })
                list=list.concat(result)

            })
            
          })
          this.$data.myUndelegationsList=list;
          console.log(this.$data.myUndelegationsList)
          
        }
        // if(poolres.state){
        //   this.$data.pool=poolres.data
        // }


      } catch (ex) {
        console.log(ex);
      }
      
    },
  },
  components: {
    MyTable
  },
  computed: {
    address: function() {
        return this.$store.getters.getaddress;
      },
    balance: function() {
        return this.$store.getters.getbalance;
      }
      

  },
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
