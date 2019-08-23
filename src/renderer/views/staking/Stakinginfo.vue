<template>
  <div class="customer-container">
    <Spin size="large" fix v-if="validator==null"></Spin>
    <Mycard  :cardtitle="$t('stakinginfo.title')" class="mt20" v-if="validator!=null">
      <div class="transaction-content" slot="card-content">
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.Nickname')}}:</span>
          </Col>
          <Col span="16" class-name="content-wrapper">
            {{validator.description.moniker}}
          </Col>
          <Col span="4" class-name="title-wrapper">
            <Button @click="openSend" type="primary">{{$t('stakinginfo.pledge')}}</Button>
            
          </Col>
        </Row>
        <Row v-if="shares!=null" class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.Mypledge')}}:</span>
          </Col>
          <Col span="16" class-name="content-wrapper">
            {{myMypledge()}}
          </Col>
          <Col span="4" class-name="title-wrapper">
            
            <!-- <Button @click="openUndelegate" v-if="shares!=null" type="primary">{{$t('stakinginfo.Cancelpledge')}}</Button> -->
          </Col>
        </Row>

        
        <Row v-if="reward!=null" class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.Myreward')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{reward}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.PledgeAddress')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            
            <a  @click="checkAddress(validator.operator_address)" class="value">{{validator.operator_address}}</a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.details')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{validator.description.details||'--'}}
          </Col>
        </Row>
        
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.commission')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{validator.commission.rate|Percentformat}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.maxcommission')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{validator.commission.max_rate|Percentformat}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.max_change_rate')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{validator.commission.max_change_rate|Percentformat}}
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('stakinginfo.VotingPower')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            {{validator.tokens/pool.bonded_tokens|Percentformat}}
          </Col>
        </Row>
      </div>
    </Mycard>

    <StakingModelDialog ref="StakingModelDialog" />
  </div>
</template>

<script>
import MyTable from "@/components/common/useful/Mytable.vue";
import Mycard from "@/components/common/useful/Mycard.vue";
const ipc = require("electron-better-ipc");
import eventhub from "../../common/js/event.js";
import StakingModelDialog from '@/views/Dialog/stakingModel.vue'
import { DAEMON_CONFIG } from "../../../config.js";
const { shell } = require("electron");
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
      isdege:true,
      reward:null
    };
  },
  async mounted() {
    console.log("-------------");
    let operator_address = this.$route.params.operator_address;
    this.$data.Tovalue = this.$route.params.operator_address;
    var r1 = await this.getinfo(operator_address);
    var r2 = await this.getmyListData(operator_address);
    this.getMyreword(operator_address)
    eventhub.$on("TransactionSuccess", async(data) => {
      console.log("TransactionSuccess");
      var r1 = await this.getinfo(operator_address);
      var r2 = await this.getmyListData(operator_address);
      this.getMyreword(operator_address)
    });
  },
  methods: {
    myMypledge(){
     return this.CalculationMypledge(this.$data.shares,this.$data.validator.delegator_shares,this.$data.validator.tokens)
   },
    checkAddress(value) {
      // console.log(value);
      var explorer = DAEMON_CONFIG.explore;
      let url ;
      if(value.indexOf('lambdavaloper')==0){
         url = `${explorer}/#/validatorDetail/${value}`;
      }else{
          url = `${explorer}/#/address/${value}`;
      }
      
      shell.openExternal(url);
    },
    openSend() {
      // this.sendModal = true;
      // this.$data.isdege = true;
      this.$refs.StakingModelDialog.open(this.$data.Tovalue,true,1)
    },
    sendcancel() {
      this.sendModal = false;
    },
    openUndelegate(){
      // this.sendModal = true;
      // this.$data.isdege = false;
      this.$refs.StakingModelDialog.open(this.$data.Tovalue,false,1)
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
      if(this.$data.mydelegationsList instanceof Array ==false){
        return ;
      }
      this.$data.mydelegationsList.forEach(myitem => {
        if (operator_address == myitem.validator_address) {
          this.$data.shares = myitem.shares;
        }
      });
    },
    async getMyreword(operator_address){
           try {
           let res = await ipc.callMain("delegatorRewardsFromValidator", {
              operator_address:this.address,
              validatorAddr:operator_address
            });
            if (res.state&&res.data&&res.data.error==undefined) {
              console.log(res.data)
              this.$data.reward=this.coinListFormart(res.data) ;
              // item.reward='---11111';
            }
           
         } catch (error) {
           console.log(error)
           
         }
    },
    coinListFormart(list){
      var result =[]
      list.forEach((item)=>{
        result.push(this.bigNumTypeFormat(item.amount,item.denom))
      })
      return result.join(',')

    },
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
