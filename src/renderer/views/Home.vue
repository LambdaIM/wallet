<template>
  <div class="container">
    <p class="balance">
      账户余额: {{Totalblance}} LAMB
      可用资产: {{balance}} LAMB
      奖励 :{{DistributionReward}} LAMB
        <!-- <span style="color:green">
        <a @click="openvalidator">{{ $t("home.profits_pledge_system") }}</a>
      </span> -->
    </p>
    <div style="width:94%;    margin: 0 auto;">
    <Tabs>
        <TabPane label="最新交易记录" >
                <Table :loading="loading"  :columns="columns" :data="data"  >
        <template slot-scope="{ row, index }" slot="from">
          <Poptip word-wrap trigger="hover" width="200" :content="row.from">
            <span class="etc">{{row.from}}</span>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="to">
          <Poptip v-if="row.to!='--'" word-wrap trigger="hover" width="200" :content="row.to">
            <span class="etc">{{row.to}}</span>
          </Poptip>
          <span v-else>
            {{row.to}}
          </span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="toDetail(row,index)">{{ $t("home.View_Detail") }}</Button>
          <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
        </template>
      </Table>
        </TabPane>
        <TabPane label="资产">
           <Table :columns="columnsToken" ></Table>
        </TabPane>
              <span slot="extra">
                  <Button  @click="openSend()">
                      {{$t('home.Transfer')}}
                      <Icon type="md-swap"></Icon>
                  </Button>
                  &nbsp; &nbsp; 

                  <Button slot="extra" @click="openwithdrawalModal()">
                      提取奖励
                      <Icon type="md-swap"></Icon>
                  </Button>
                  <Button slot="extra" @click="openAssert()">
                      兑换资产
                      <Icon type="md-swap"></Icon>
                  </Button>
                          
               </span>   
         
        
    </Tabs>
    </div>
               
  
          <div class="tc " >
            <!-- <Page :total="sum" show-elevator @on-change="changePage"></Page> -->
          </div>
    <div>
          <!-- <Button to="/api">API 测试</Button> -->
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
    </div>

    <div class="modal-container">
      <Modal
        loading
        v-model="sendModal"
        :title="$t('home.Modal1.Send_LAMB')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="Tovalue" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('home.Modal1.To')}}</span>
          </Input>
        </p>
        <br>
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
          <h2>{{$t('home.Modal1.Transfer')}}</h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          <Row v-if="Tovalue" class-name="item">
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

      <Modal
        loading
        v-model="withdrawalModal"
        title="提取奖励（一次只能从5个验证节点中提取奖励）"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input  v-model="DistributionReward">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="prewithdrawalLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal
        loading
        v-model="AssetlModal"
        title="资产兑换"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p style="text-align: center">
              <RadioGroup v-model="exchangesStatus" type="button">
                  <Radio label="true">
                      <span>LAMB 兑换 STO</span>
                  </Radio>
                  <Radio label="false">
                      <span>STO 兑换 LAMB</span>
                  </Radio>
                  
              </RadioGroup>
              
        </p>
        <br/>
        <div v-if="exchangesStatus=='true'">
                <p>
                  <Input @keyup.native="AssetLAMBvalueChane"  v-model="AssetLAMBvalue">
                    <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
                    <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
                  </Input>
                </p>
                <br/>
                <p>
                  <Input v-model="AssetSTOvalue" readonly>
                    <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
                    <span slot="append">STO</span>
                  </Input>
                  
                
                </p>
        </div>
        <div v-else>
              <p>
                  <Input @keyup.native="AssetSTOvalueChane" v-model="AssetSTOvalue" >
                    <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
                    <span slot="append">STO</span>
                  </Input>
                </p>
                  <br/>
                <p>
                  <Input v-model="AssetLAMBvalue" readonly>
                    <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
                    <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
                  </Input>
                </p>
                <br/>
                

        </div>

        <div slot="footer">
          <Button type="primary" @click="preAssetPledge">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

      <Modal v-model="assetConfirmModal" :styles="{top: '200px'}">
        <div class="modal-header" slot="header">
          <h2> 资产兑换 </h2>
          <Row class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.From')}}:</Col>
            <Col span="20" class-name="value">{{address}}</Col>
          </Row>
          
          <Row v-if="exchangesStatus=='true'" class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{AssetLAMBvalue}} LAMB 兑换  {{AssetSTOvalue}} STO</Col>
          </Row>
          <Row v-else class-name="item">
            <Col span="4" class-name="key">{{$t('home.Modal1.Amount')}}:</Col>
            <Col span="20" class-name="value">{{AssetSTOvalue}} STO  兑换 {{AssetLAMBvalue}} LAMB </Col>
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
  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
import { DAEMON_CONFIG } from "../../config.js";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
import filters from "../common/js/filter.js";
import * as Utils from "web3-utils";
import wUtils from "../common/js/utils.js";
import eventhub from "../common/js/event.js";
import _ from "underscore";
import { setTimeout, clearTimeout } from 'timers';
import { isNull } from 'util';
const { shell } = require("electron");


export default {
  data() {
    return {
      stateType: null,
      balance: 0,
      address: "",
      sendModal: false,
      columns: [
        {
          title: this.$t("home.table.Type"),
          key: "txType",

        },
        {
          title: this.$t("home.table.Amount"),
          key: "amount"
        },
        {
          title: this.$t("home.table.From"),
          key: "from",
          slot: "from"
        },
        {
          title: this.$t("home.table.To"),
          key: "to",
          slot: "to"
        },
        {
          title: this.$t("home.table.Date"),
          key: "date"
        },
        {
          title: this.$t("home.table.Status"),
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
          title: this.$t("home.table.detail"),
          key: "detail",
          slot: "action"
        }
      ],
      data: [],
      accountinfo: null,
      Fromvalue: "",
      Tovalue: "",
      LAMBvalue: "",
      confirmModal: false,
      passwordModal: false,
      walletPassword: null,
      txlist: [],
      Interval: null,
      transactiondata:null,
      txType:null,
      sum:null,
      pageNumber:1,
      loading:true,
      Totalblance:0,
      DistributionReward:0,
      columnsToken:[
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '金额',
                        key: 'name'
                    },
                    {
                        title: '操作',
                        key: 'name'
                    },
      ],
      withdrawalModal:false,
      AssetlModal:false,
      AssetLAMBvalue:"",
      AssetSTOvalue:"",
      assetConfirmModal:false,
      exchangesStatus:"true"

    };
  },
  components: {
    MyTable
  },
  computed: {
    amount: value => {
      console.log(value);
    },
    STOcounter(){
      return this.$data.AssetLAMBvalue/1000
    }
  },
 async mounted() {
    this.address= await this.WalletBasicinfo();
    

    this.getBalance();
    this.transactionList();
    
    this.Interval = setInterval(() => {
      // this.getBalance();
      // this.transactionList();
    }, 1000 * 15);

    eventhub.$on("TransactionSuccess", (data) => {
      console.log('TransactionSuccess');
      // this.getBalance();
      // this.transactionList();
     
    });

    eventhub.$on("TxType", (data) => {
      console.log('TxType',data);
      this.$data.txType=data;
      
      this.transactionList()
      
     
    });

    // var num = this.bigNum(0);
    // console.log(num);

    

  },
  beforeDestroy() {
    clearInterval(this.$data.Interval);
  },
  methods: {
    AssetLAMBvalueChane(){
     console.log('- -')
     this.$data.AssetSTOvalue = this.$data.AssetLAMBvalue/1000; 
    },
    AssetSTOvalueChane(){
      this.$data.AssetLAMBvalue= this.$data.AssetSTOvalue *  1000; 
    },
    openwithdrawalModal(){
      this.$data.withdrawalModal=true;
    },
    toDetail(row, index) {
      console.log(row, index);
      let id = index;
      // console.log(id);
      this.$router.push(`/detail/${row.txHash}/${row.txType}`);
    },
    openSend() {
      this.sendModal = true;
    },
    openAssert(){
      this.$data.AssetlModal=true;
    },
    async transfer(amount,txType) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata=null;
      try {
        let res = await ipc.callMain(txType, {
          to,
          amount,
          gas
        });
        // console.log(res);
        if (res.state) {
          this.$data.transactiondata=res.data
          this.sendcancel();
          this.confirmModal = true;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async transferAsset(amount,asset,isdege) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata=null;
      try {
        let res = await ipc.callMain('AssetPledge', {
          asset,
          amount,
          gas,
          isdege
        });
        // console.log(res);
        if (res.state) {
          this.$data.transactiondata=res.data
          this.sendcancel();
          this.assetConfirmModal = true;
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    preSendLAMB() {
      let from = this.address;
      let to = this.Tovalue;
      let value = parseFloat(this.LAMBvalue);
      if (to == from) {
        this.$Notice.warning({
          title:this.$t('home.action.not_transfer_LAMB_to_yourself')
        });
        return;
      }
      if (value <= 0 || value > this.balance ) {
        // need to alert
        this.$Notice.warning({
          title: this.$t('home.action.check_balance_amount_transfer')
        });
        return;
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
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.transfer(value,"transfer");
    },
    prewithdrawalLAMB() {
      this.LAMBvalue=this.$data.DistributionReward;
      let value = parseFloat(this.LAMBvalue);
      
      // if (value <= 0 || value > this.$data.DistributionReward ) {
      //   // need to alert
      //   this.$Notice.warning({
      //     title: this.$t('home.action.check_balance_amount_transfer')
      //   });
      //   return;
      // }
  

      if (isNaN(value)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      this.$data.withdrawalModal=false;
      this.transfer(value,'withdrawal');
    },
    preAssetPledge() {
      // this.LAMBvalue=this.$data.DistributionReward;
      // let value = parseFloat(this.LAMBvalue);
      
      // // if (value <= 0 || value > this.$data.DistributionReward ) {
      // //   // need to alert
      // //   this.$Notice.warning({
      // //     title: this.$t('home.action.check_balance_amount_transfer')
      // //   });
      // //   return;
      // // }
  

      
      
      console.log(this.$data.exchangesStatus)

      this.$data.withdrawalModal=false;
      var AssetLAMBvalue = this.$data.AssetLAMBvalue;
      var sto =this.$data.AssetSTOvalue;

      if (isNaN(sto)||isNaN(AssetLAMBvalue)) {
        this.$Notice.warning({
          title: this.$t('home.action.Check_the_amount')
        });
        return;
      }
      if(this.$data.exchangesStatus == "false"){
        this.transferAsset(AssetLAMBvalue,sto,false);
      }else{
        this.transferAsset(AssetLAMBvalue,sto,true);
      }
      
    },
    sendcancel() {
      this.sendModal = false;
      this.$data.AssetlModal=false;
    },
    confirm() {
      this.confirmModal = false;
      this.$data.assetConfirmModal=false;
      // this.passwordModal = true;
      eventhub.$emit('TxConfirm',this.$data.transactiondata);


    },
     getBalance() {
      // console.log("importWallet");
      if(this.$data.timeid!=undefined){
        clearTimeout(this.$data.timeid);
      }

      this.$data.timeid=setTimeout(async ()=>{
         try {
            var res = await ipc.callMain("defaultWalletBlance", {});
            if(!res.state) return;
            // this.address = res.data.address;
            // this.$store.dispatch("setaddress", this.address);
            this.balance = res.data.Liquid.balance - 0 ;
            this.balanceSto = res.data.Liquid.balanceSto - 0 ;
            var DistributionReward=0; 
            if(res.data.DistributionReward!=null){
              res.data.DistributionReward.forEach((item)=>{
                if(item.denom=='lamb'){
                   DistributionReward = item.amount||0;

                }
              })
               

            }
            
            var Totalblance = (res.data.Delegation-0)+this.balance + (DistributionReward-0);
            this.$store.dispatch("setblance", this.balance);
            this.$store.dispatch("setTotalblance",Totalblance);
            this.$store.dispatch("setDistributionReward", DistributionReward) ;
            this.$store.dispatch("setbalanceSto", this.balanceSto);
            
            this.$data.Totalblance = Totalblance  ;
            this.$data.DistributionReward = DistributionReward ;

            console.log(this.balance);
          } catch (ex) {
            console.log(ex);
          }

      },1000)
      
    },
    async transactionList(pagenum) {
      console.log("transactionList");
      var address=this.address;
      function checkaddress(address1) {
        if (address1.toUpperCase() == address.toUpperCase()) {
          return " -  ";
        } else {
          return " +  ";
        }
      }
      
      function subAddress(address){
        if(address){
          return address.substr(0,8)+"..."

        }else{
          return '--'
        }

      }
      // this.$data.loading=false;
      try {
        // txType: txPledgeNew
        let param = {
          pageNum: this.$data.pageNumber,
          showNum: 10
        };
        if (this.txType != null || this.txType != "") {
          param.txType = this.txType;
        }
        
        let res = await ipc.callMain("transactionList", param);
        // console.log(res);
        if (!res.state) return;
        let tempData = res.data.data;
        this.$data.data=null;
        this.data = [];
        console.log(tempData);
        if (tempData) {
          // this.$data.sum=tempData.data.count;
          //  item.tx.value.msg[0].value.amount[0].amount+item.tx.value.msg[0].value.amount[0].denom
          tempData.forEach(item => {
            if(item.error==undefined){
              this.data.push({
                // amount: item.value==""?"--":(checkaddress(item.tx.value.msg[0].value.from_address) + item.tx.value.msg[0].value.amount[0].amount+item.tx.value.msg[0].value.amount[0].denom  ,
                amount:this.getamount(item) ,
                from:this.getSendAddress(item),
                to:item.tx.value.msg[0].value.to_address||'--',
                txType: item.tags[0].value,
                date: filters.formatDate(item.timestamp),
                status: item.logs[0].success,
                txHash:item.txhash,
                timestampSort:new Date(item.timestamp).getTime()
              });
            }else{
              console.log('读取交易记录失败')
            }
          });
        }
        this.data.sort((item1,item2)=>{
          return   item2.timestampSort - item1.timestampSort
          })
        this.$data.loading=false;
      } catch (ex) {
        console.log(ex);
        this.$data.loading=false;
      }
    },
    async WalletBasicinfo() {
      var result=null;
      try {
        let res = await ipc.callMain("defaultWalletBasicinfo", {});
        console.log(res);
        if (!res.state) return;
         result = res.data.address;
      } catch (ex) {

      }
      
      return result;
    },
    async changePage(pageNumber){
        this.$data.pageNumber=pageNumber;
        this.transactionList();
    },
    openvalidator(value) {
        // console.log(value);
        let url = DAEMON_CONFIG.pledgeurl;
        shell.openExternal(url);
    },
    getamount(item){
      var msg0=item.tx.value.msg[0];
      var result='--'
      if(msg0.value!=undefined&&msg0.value.amount!=undefined){
        if(msg0.value.amount instanceof Array){
          result= msg0.value.amount[0].amount+msg0.value.amount[0].denom
        }else{
          result= msg0.value.amount.amount+msg0.value.amount.denom
        }
        
      }else{
        item.tags.forEach((item)=>{
          if(item.key=='rewards'){
            result = item.value
          }
        })
        
      }
      return result;
        
    },
    getSendAddress(item){
      var result ='--' 
      if(item.tx.value.msg[0].value.from_address!=undefined){
        result = item.tx.value.msg[0].value.from_address;
      }else{
        item.tags.forEach((item)=>{
          if(item.key=='delegator'){
            result = item.value
          }
        })

      }

      return result;
    
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  .balance {
    width: 96%;
    margin: 0 auto;
    margin-top: 30px;
    font-size: 18px;
    margin-bottom: 20px;
  }
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
    padding-bottom: 30px;
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
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>
