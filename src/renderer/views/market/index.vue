<template>
  <div class="customer-container">

      <div class="tableContainer">

          <Tabs value="name1">
                <TabPane label="购买空间" name="name1">
          <Row>
        <Col span="22"><h3>自动匹配-一键购买  </h3></Col>


    </Row>
                  <div style="text-align: center;">
          <Dropdown>
        <a href="javascript:void(0)">
            lambd存储市场
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem>biss存储市场</DropdownItem>
            <DropdownItem>火币矿池存储市场</DropdownItem>

        </DropdownMenu>
    </Dropdown>&nbsp;


      数量 <Input   style="width: auto" />GB&nbsp;
      时间 <Input   style="width: auto" />Day&nbsp;
         <Button type="primary">一键购买空间</Button>

    </div>
    <br/>
        <div>lambda存储市场指标    订单量：111，最短购买时间：1天 最长购买时间1年，空间最小1gb 空间最大 10gb </div>

     <Divider />

        <Row>
        <Col span="22"><h3>自选交易-更多选择，自由交易  </h3></Col>
        <Col span="2"><Button @click="openSellingspace"  size="small">出售空间</Button></Col>

    </Row>
     <br/>
                    <Table  :columns="columns1" :data="data1">
                        <template slot-scope="{ row, index }" slot="action">
              <Button  @click="openBuyingspace"  type="primary" size="small"> 购买空间 </Button>


            </template>
                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page total="100" show-elevator />
                    </div>
                </TabPane>
                <!-- <TabPane label="出售" name="name1">
                    <Table :columns="columns1" :data="data1"></Table>
                </TabPane> -->
                <TabPane label="我出售的空间" name="name4">
                 <Table :columns="columns3" :data="data2"></Table>
                 <br/>
                    <div style="text-align: center;">
                     <Page total="100" show-elevator />
                    </div>
                 </TabPane>
                <TabPane label="订单列表" name="name3">
                    <Table :columns="columns4" :data="data3">
                      <template slot-scope="{ row, index }" slot="action">
                        <Button  @click="orderinfo"  type="primary" size="small"> 订单详情 </Button>
                      </template>
                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page total="100" show-elevator />
                    </div>
                </TabPane>

            </Tabs>



      </div>
      <BuyingspaceModal ref="Buyingspace" />
      <SellingspaceModal ref="Sellingspace" />
      <autoBuyingspaceModal ref="autoBuyingspace" />


  </div>
</template>

<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';
import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';
import autoBuyingspaceModal from '@/views/Dialog/autoBuyingspaceModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      autoprice: 1,
      columns1: [{
        title: '市场类别',
        key: 'marketType'
      }, {
        title: '名称',
        key: 'name'
      }, {
        title: '地址',
        key: 'address'
      },
      {
        title: '数量',
        key: 'num'
      },
      {
        title: '单价LAMB/GB/day',
        key: 'price'
      },
      {
        title: '限额',
        key: 'range'
      },
      {
        title: '交易',
        key: 'action',
        slot: 'action'
      }, {
        title: '费率',
        key: 'rate'
      }
      ],
      columns2: [
        {
          title: '数量',
          key: 'name'
        },
        {
          title: '单价',
          key: 'age'
        },
        {
          title: '时间',
          key: 'address'
        }
      ],
      columns3: [
        {
          title: '数量',
          key: 'age'
        },
        {
          title: '单价',
          key: 'price'
        },
        {
          title: '时间',
          key: 'time'
        }, {
          title: '已售',
          key: 'age2'
        }
      ],
      columns4: [{
        title: '类型',
        key: 'type'
      },
      {
        title: '订单id',
        key: 'age'
      },

      {
        title: '数量',
        key: 'age'
      },
      {
        title: '单价',
        key: 'price'
      },
      {
        title: '支付金额',
        key: 'price'
      },
      {
        title: '开始时间',
        key: 'time'
      },
      {
        title: '结束时间',
        key: 'time'
      },
      {
        title: '地址',
        key: 'address'
      },
      {
        title: '状态',
        key: 'state'
      }, {
        title: '订单详情',
        key: 'action',
        slot: 'action'
      }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'lambda19zptal4p80w29kqjv4wrwyd4qm2y4u7w9k8nrv',
          date: '2016-10-03',
          num: '0.8 GB',
          price: '2000lamb',
          range: '19~1000',
          marketType: 'lambda交易市场',
          rate: '4%'
        }
      ],
      data2: [
        {
          name: 'John Brown',
          age: 18,
          age2: 11,
          address: 'lambda19zptal4p80w29kqjv4wrwyd4qm2y4u7w9k8nrv',
          date: '2016-10-03',
          num: '0.8 TBB',
          price: '2000lamb',
          range: '19~1000',
          time: '2019-10-1'
        }
      ],
      data3: [
        {
          name: 'John Brown',
          age: 18,
          age2: 11,
          type: '出售',
          address: 'lambda19zptal4p80w29kqjv4wrwyd4qm2y4u7w9k8nrv',
          date: '2016-10-03',
          num: '0.8 TBB',
          price: '2000lamb',
          range: '19~1000',
          time: '2019-10-1',
          state: '匹配中'
        }
      ]



    };
  },
  components: {
    MyTable,
    Mycard,
    BuyingspaceModal,
    SellingspaceModal,
    autoBuyingspaceModal
  },
  methods: {
    openBuyingspace() {
      this.$refs.Buyingspace.open();
    },
    openSellingspace() {
      this.$refs.Sellingspace.open();
    },
    openautoBuyingspace() {
      this.$refs.Sellingspace.open();
    },
    orderinfo() {
      this.$router.push(`/orderinfo`);
    }

  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    }
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
}
.card-item {
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .item-value {
        font-size: 14px;
      }
}
</style>
