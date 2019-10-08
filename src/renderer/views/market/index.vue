<template>
  <div class="customer-container">

      <div class="tableContainer">
          <Tabs value="name1">
                <TabPane label="购买空间" name="name1">
                    <Table :columns="columns1" :data="data1">
                        <template slot-scope="{ row, index }" slot="action">
              <Button  @click="openBuyingspace"  type="primary" size="small"> 购买空间 </Button>


            </template>
                    </Table>
                </TabPane>
                <!-- <TabPane label="出售" name="name1">
                    <Table :columns="columns1" :data="data1"></Table>
                </TabPane> -->
                <TabPane label="我出售的空间" name="name4">
                 <Table :columns="columns3" :data="data1"></Table>
                 </TabPane>
                <TabPane label="订单列表" name="name3">
                    <Table :columns="columns4" :data="data1"></Table>
                </TabPane>
              <Button @click="openSellingspace"  size="small" slot="extra">出售空间</Button>
            </Tabs>



      </div>
      <BuyingspaceModal ref="Buyingspace" />
      <SellingspaceModal ref="Sellingspace" />


  </div>
</template>

<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';
import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      columns1: [{
        title: '名称',
        key: 'name'
      }, {
        title: '地址',
        key: 'address'
      },
      {
        title: '数量',
        key: 'name'
      },
      {
        title: '单价',
        key: 'age'
      },
      {
        title: '限额',
        key: 'address'
      },
      {
        title: '交易',
        key: 'action',
        slot: 'action'
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
          key: 'name'
        },
        {
          title: '单价',
          key: 'age'
        },
        {
          title: '时间',
          key: 'address'
        }, {
          title: '已售',
          key: 'address'
        }
      ],
      columns4: [{
        title: '类型',
        key: 'address'
      },
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
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]

    };
  },
  components: {
    MyTable,
    Mycard,
    BuyingspaceModal,
    SellingspaceModal
  },
  methods: {
    openBuyingspace() {
      this.$refs.Buyingspace.open();
    },
    openSellingspace() {
      this.$refs.Sellingspace.open();
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
