<template>
  <div class="container">
    <Header/>

    <div class="account-info-container">
      <Row class-name="account-info-wrapper" type="flex" justify="space-between">
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">Balance</p>
            <p class="value">50 LAMB</p>
          </div>
        </Col>
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">Lend</p>
            <p class="value">123 LAMB</p>
          </div>
        </Col>
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">Borrow</p>
            <p class="value">10 LAMB</p>
          </div>
        </Col>
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">Interest Expense</p>
            <p class="value">50 LAMB</p>
          </div>
        </Col>
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">Interest Revenue</p>
            <p class="value">35 LAMB</p>
          </div>
        </Col>
      </Row>
    </div>

    <MyTable title="Latest Local Transaction Records" class="mt20 mytable-container">
      <div class="operation" slot="operation">
        <div class="search-wrapper">
          <Input search enter-button placeholder="Enter something..."/>
        </div>

        <div class="repay-wrapper">
          <Icon type="md-map" size="32" @click="openRepay()"/>
        </div>

        <div class="borrow-wrapper">
          <Icon type="ios-photos-outline" @click="openBorrow()" size="32"/>
        </div>

        <div class="send-wrapper">
          <Icon type="md-swap" @click="openSend()" size="32"/>
        </div>
      </div>
      <Table :columns="columns" :data="data" slot="content"></Table>
    </MyTable>

    <div class="modal-container">
      <Modal v-model="detailModal" title="detail" :styles="{top: '200px'}">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
      </Modal>

      <Modal v-model="repayModal" title="repay" :styles="{top: '200px'}">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
      </Modal>

      <Modal v-model="borrowModal" title="borrow" :styles="{top: '200px'}">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
      </Modal>

      <Modal v-model="sendModal" title="send" :styles="{top: '200px'}">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
      </Modal>
    </div>

  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
export default {
  data() {
    return {
      stateType: null,
      detailModal: false,
      repayModal: false,
      borrowModal: false,
      sendModal: false,
      columns: [
        {
          title: "Amount",
          key: "amount"
        },
        {
          title: "Source",
          key: "source"
        },
        {
          title: "Date",
          key: "date"
        },
        {
          title: "Type",
          key: "type"
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
        },
        {
          title: "Detail",
          render: (h, params) => {
            return h("Icon", {
              props: {
                type: "ios-arrow-dropdown-circle",
                size: 32
              },
              on: {
                click: () => {
                  this.openDetail();
                }
              }
            });
          }
        }
      ],
      data: [
        {
          amount: "+ 0.0001 LAMB ($0)",
          source: "From fisimtoken4y",
          type: "Transaction",
          date: "3 days ago",
          status: 1
        },
        {
          amount: "- 0.0001 LAMB ($0)",
          source: "To Givenchy13000",
          type: "Lend",
          date: "1 days ago",
          status: 0
        },
        {
          amount: "+ 0.0001 LAMB ($0)",
          source: "From fisimtoken4y",
          type: "Transaction",
          date: "3 days ago",
          status: 1
        },
        {
          amount: "+ 0.0001 LAMB ($0)",
          source: "From fisimtoken4y",
          type: "Intereste",
          date: "4 days ago",
          status: 0
        }
      ]
    };
  },
  components: {
    Header,
    MyTable
  },
  methods: {
    openDetail() {
      this.detailModal = true;
    },
    openRepay() {
      this.repayModal = true;
    },
    openBorrow() {
      this.borrowModal = true;
    },
    openSend() {
      this.sendModal = true;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  .account-info-container {
    width: 100%;
    height: 90px;
    .account-info-wrapper {
      width: 96%;
      height: 100%;
      border-bottom: 1px solid transparent;
      border-image: linear-gradient(to right, #339cae, #9167d3);
      border-image-slice: 10;
      margin: 0 auto;
      .account-item {
        height: 100%;
        position: relative;
        .item-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .title {
            font-size: 18px;
            color: #999999;
            text-align: center;
            white-space: nowrap;
          }
          .value {
            margin-top: 10px;
            font-size: 16px;
            text-align: center;
            color: #67a7db;
          }
        }
      }
    }
  }
  .mytable-container {
    .operation-wrapper {
      height: 40px;
      .operation {
        width: 100%;
        height: 100%;
        position: relative;
        .search-wrapper {
          position: absolute;
          left: 28%;
        }
        .repay-wrapper {
          position: absolute;
          left: 70%;
          top: 25%;
        }
        .borrow-wrapper {
          position: absolute;
          left: 83%;
          top: 25%;
        }
        .send-wrapper {
          position: absolute;
          right: 0;
          top: 25%;
        }
      }
    }
  }
  .table-content-container {
    width: 100%;
    .table-content-wrapper {
      width: 96%;
      margin: 0 auto;
    }
  }
}
</style>
