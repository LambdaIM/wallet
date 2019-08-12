<template>
  <div class="customer-container">
    <Mycard cardtitle="节点详情" class="mt20" v-if="validator!=null">
      <div class="transaction-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">昵称:</span>
          </Col>
          <Col span="16" class-name="content-wrapper">
            <a class="item-value">{{validator.description.moniker}}</a>
          </Col>
          <Col span="4" class-name="title-wrapper">
            <Button @click="openSend" type="primary">质押</Button>
            
          </Col>
        </Row>
        <Row v-if="shares!=null" class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">我的质押量:</span>
          </Col>
          <Col span="16" class-name="content-wrapper">
            <a class="item-value">{{shares}}</a>
          </Col>
          <Col span="4" class-name="title-wrapper">
            
            <Button @click="openUndelegate" v-if="shares!=null" type="primary">取消质押</Button>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">地址:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a class="item-value">{{validator.operator_address}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">佣金:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a class="item-value">{{validator.commission.rate}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">佣金:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a class="item-value">{{validator.commission.rate}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">最大佣金:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a class="item-value">{{validator.commission.max_rate}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">最大佣金变化:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a class="item-value">{{validator.commission.max_change_rate}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">投票权重:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a class="item-value">{{validator.tokens/pool.bonded_tokens}}</a>
          </Col>
        </Row>
      </div>
    </Mycard>
    <div class="modal-container">
      <Modal
        loading
        v-model="sendModal"
        :title="isdegeTxt"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('home.Modal1.To')}}</span>
          </Input>
        </p>
        <br />
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal v-model="confirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2>{{isdegeTxt}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.To')}}:</Col>
            <Col span="20" class-name="value">{{Tovalue}}</Col>
          </Row>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{LAMBvalue}} LAMB</Col>
          </Row>
        </div>
        <!-- <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>-->
        <div slot="footer">
          <Button type="primary" @click="confirm">{{$t('home.Modal1.Confirm')}}</Button>
        </div>
      </Modal>
    </div>
    <StakingModelDialog ref="StakingModelDialog" />
  </div>
</template>

<script>
import MyTable from "@/components/common/useful/Mytable.vue";
import Mycard from "@/components/common/useful/Mycard.vue";
const ipc = require("electron-better-ipc");
import eventhub from "../common/js/event.js";
import StakingModelDialog from '@/views/Dialog/stakingModel.vue'

export default {
  data() {
    return {
      validator: null,
      pool: null,
      sendModal: false,
      Tovalue: "",
      confirmModal: false,
      LAMBvalue: "",
      mydelegationsList: [],
      shares: null,
      isdege:true
    };
  },
  async mounted() {
    console.log("-------------");
    let operator_address = this.$route.params.operator_address;
    this.$data.Tovalue = this.$route.params.operator_address;
    var r1 = await this.getinfo(operator_address);
    var r2 = await this.getmyListData(operator_address);
  },
  methods: {
    openSend() {
      // this.sendModal = true;
      // this.$data.isdege = true;
      this.$refs.StakingModelDialog.open(this.$data.Tovalue,true)
    },
    sendcancel() {
      this.sendModal = false;
    },
    openUndelegate(){
      // this.sendModal = true;
      // this.$data.isdege = false;
      this.$refs.StakingModelDialog.open(this.$data.Tovalue,false)
    },
    preSendLAMB() {
      console.log("-----");
      let from = this.address;
      let to = this.Tovalue;
      let value = parseFloat(this.LAMBvalue);
      if (to == from) {
        this.$Notice.warning({
          title: this.$t("home.action.not_transfer_LAMB_to_yourself")
        });
        return;
      }
      if(this.$data.isdege){
         if (value <= 0 || value > this.balance) {
        // need to alert
            this.$Notice.warning({
              title: this.$t("home.action.check_balance_amount_transfer")
            });
            return;
          }

      }else{
        if (value <= 0 || value > this.$data.shares) {
        // need to alert
            this.$Notice.warning({
              title: this.$t("home.action.check_balance_amount_transfer")
            });
            return;
          }


      }
      
      // value = wUtils.numberToBig(value) ;
      // 还需要新的校验地址方法
      // if (Utils.isAddress(to) == false) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title:this.$t('home.action.Check_forwarding_address')
      //   });

      //   return;
      // }

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t("home.action.Check_the_amount")
        });
        return;
      }
      this.transfer(value);
    },
    async transfer(amount) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata = null;
      let isdege = this.$data.isdege;
      try {
        let res = await ipc.callMain("transferDelegation", {
          to,
          amount,
          gas,
          isdege
        });
        // console.log(res);
        if (res.state) {
          this.$data.transactiondata = res.data;
          this.sendcancel();
          this.confirmModal = true;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    confirm() {
      this.confirmModal = false;
      // this.passwordModal = true;
      eventhub.$emit("TxConfirm", this.$data.transactiondata);
    },
    async getinfo(operator_address) {
      try {
        let res = await ipc.callMain("validator", {
          operator_address: operator_address
        });
        let poolres = await ipc.callMain("pool", {});

        console.log(res);

        if (res.state) {
          this.$data.validator = res.data;
        }
        if (poolres.state) {
          this.$data.pool = poolres.data;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async getmyListData(operator_address) {
      console.log("getListData");
      try {
        let res = await ipc.callMain("mydelegations", {
          operator_address: this.address
        });

        if (res.state) {
          this.$data.mydelegationsList = res.data;
          this.getME(operator_address);
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log("getListDataEnd");
    },
    getME(operator_address) {
      this.$data.mydelegationsList.forEach(myitem => {
        if (operator_address == myitem.validator_address) {
          this.$data.shares = myitem.shares;
        }
      });
    }
  },
  components: {
    MyTable,
    Mycard,
    StakingModelDialog
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    },
    balance: function() {
      return this.$store.getters.getbalance;
    },
    isdegeTxt:function(){
      if(this.$data.isdege){
        return "质押"
      }else{
        return "取消质押"
      }
    }
  }
};
</script>

<style lang="less" scoped>
.customer-container {
  position: relative;
  .transaction-content {
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
  }
}
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>
