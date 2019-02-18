<template>
  <div class="container">
    <Header/>

    <div class="account-info-container">
      <Row class-name="account-info-wrapper" type="flex" justify="space-between">
        <Col span="4" class="account-item">
          <div class="item-wrapper">
            <p class="title">Balance</p>
            <p class="value">{{balance}} LAMB</p>
          </div>
        </Col>
        <!-- <Col span="4" class="account-item">
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
        </Col> -->
      </Row>
    </div>

    <MyTable  title="Latest Local Transaction Records" class="mt20 mytable-container">
      <div class="operation" slot="operation">
        <div class="search-wrapper">
          <Input search enter-button placeholder="Enter something..."/>
        </div>

        <!-- <div class="repay-wrapper">
          <Icon type="md-map" size="32" @click="openRepay()"/>
        </div>

        <div class="borrow-wrapper">
          <Icon type="ios-photos-outline" @click="openBorrow()" size="32"/>
        </div> -->

        <div class="send-wrapper">
          <Icon type="md-swap" @click="openSend()" size="32"/>
        </div>
      </div>
      <Table no-data-text="no Transaction" :columns="columns" :data="data" slot="content"></Table>
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

      <Modal loading v-model="sendModal" title="Send LAMB" :styles="{top: '200px'}"
       
       @on-cancel="sendcancel"
      >
        <p>
        <Input  v-model="Fromvalue" readonly>
        <span slot="prepend">From</span>
        </Input>
        </p>
        <br/>
        <p>
        <Input  v-model="Tovalue"  placeholder="an LAMB address" >
        <span slot="prepend"> To  </span>
        </Input>
        </p>
        <br/>
        <p>
          <Input  v-model="LAMBvalue">
            <span slot="prepend"> Amount  </span>
            <span slot="append">LAMB</span>
          </Input>

            <!-- <InputNumber
            style="width:100%;"
            :min="0"
            v-model="LAMBvalue"
            :formatter="value => `LAMB ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
            :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber> -->
        
        </p>
           <div slot="footer">
            <Button type="primary" @click="preSendLAMB">Submit</Button>
        </div>
        

      </Modal>
      <Modal @on-ok="sendLAMBTx" v-model="passwordModal" title="wallet password" :styles="{top: '200px'}">
        <p>
          <Input v-model="walletPassword" type="password">
          </Input>
        </p>
        <div slot="footer">
            <Button type="primary" @click="sendLAMBTx">Submit</Button>
        </div>
        
      </Modal>
    </div>

  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
import { DAEMON_CONFIG } from "../../config.js";
import https from "@/server/https.js";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
import filters from '../common/js/filter.js'
import * as Utils from 'web3-utils';


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
        // {
        //   title: "Detail",
        //   render: (h, params) => {
        //     return h("Icon", {
        //       props: {
        //         type: "ios-arrow-dropdown-circle",
        //         size: 32
        //       },
        //       on: {
        //         click: () => {
        //           this.openDetail();
        //         }
        //       }
        //     });
        //   }
        // }
      ],
      data: [
        
      ],
      accountinfo:null,
      Fromvalue:'',
      Tovalue:'',
      LAMBvalue:'',
      passwordModal:false,
      walletPassword:null,
      txlist:[],
      Interval:null
    };
  },
  components: {
    Header,
    MyTable
  },
  mounted() {
    this.getAccountInfo();
    var _this=this;
    this.$data.Interval = setInterval(function(){
      _this.getAccountInfo();
    },1000*20)
    
  },
  beforeDestroy(){
    clearInterval(this.$data.Interval);

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
    },
    getAccountInfo() {
      var _this=this;
       https.fetchget(
            `http://localhost:${DAEMON_CONFIG.RPC_PORT}/getWalletAddress/`
          )
          .then(function(res){
            console.log(res.data.data);
            if(res.data.data){
              return res.data.data;

            }else{
              return null
            }
            

          })
          .then(function(data){
            console.log(data)
            var nodeBaseUrl = settings.get("user.node");
            _this.$data.Fromvalue=data.address;
            console.log('dispatch')
            _this.$store.dispatch('setaddress',data.address)
             
            

            // _this.$store.commit('setaddress',{address:data.address})



            var pra = {
              url:nodeBaseUrl +
                "abci_query?path=%22/accounts/"+data.address+"%22&data=&height=&prove=",
                data: {
                  ss: ""
                }
            };
            
            return ipc.callMain("httpget", pra)

          })
          .then(function(res){
            console.log('res',res)
            if(res.data.data.result.response.log&&res.data.data.result.response.value==undefined){
                // _this.$Notice.warning({
                //     title: 'Your account was not found',
                //     desc:res.data.data.result.response.log,
                // });
                 return ;
        
            }
            return ipc.callMain("protodecode", {
              value: res.data.data.result.response.value,
              dataType: "types.Account"
            });

          })
          .then(function(res){
            if(res!=undefined){
              _this.$data.accountinfo=res.data
              _this.getpaylist(res.data.address);
            }
            

          })
      
       
      
      
    },
    preSendLAMB(){
      var from =this.$data.Fromvalue;
      var to =this.$data.Tovalue;
      var value   =parseFloat(this.$data.LAMBvalue);  
      var _this = this ;
      if(to==from){
        this.$Notice.warning({
                    title: 'You can\'t transfer LAMB to yourself.',
                });
        return ;
      }
      if(value<=0||value>this.$data.accountinfo.balance){
        // need to alert
        this.$Notice.warning({
                    title: 'Please check the balance and the amount of transfer.',
                });
        return 
      }
      console.log(from,to,value)
      value=value*10000;
      if(Utils.isAddress(to)==false){
        // need to alert
        this.$Notice.warning({
                    title: 'Check the forwarding address',
                });
      
       return ;
     }


     if(isNaN(value)){
       this.$Notice.warning({
                    title: 'Check the amount',
                });
      
       return ;
     }




      ipc.callMain('pay', {
        to:to,
        amount:value
      })
      .then(function(data){
        console.log(data)
        _this.sendcancel()
        _this.$data.passwordModal=true;

        

      })
      .catch(function(err){
        console.log(err);
        _this.$Notice.warning({
                    title: 'error',
                });


      })

      

    },
    sendcancel(){
      this.sendModal = false;
    },
    sendLAMBTx(){
      var _this=this;


      if(this.$data.walletPassword==null){
        return ; 
      }
      ipc.callMain('Wallettransfer', {
          'password':encodeURIComponent(this.$data.walletPassword),
          'txdata':{}
      })
      .then(function(data){
        
        if(data.state==false){
          if(data.code =='1001'){
            _this.$Notice.error({
                    title: 'Please check your password.'
                });
            
          }else{
            _this.$Notice.error({
                    title: 'Transaction failure.'
                });

          }
          
          
          return ;
        }
        if(data.data.data.result.check_tx.log==undefined){
          console.log('ok')
          _this.$data.walletPassword='';
          _this.$Notice.success({
                    title: 'Transaction success',
                    desc:'Transaction hash  <br/>'+data.data.data.result.hash
                });
          _this.getAccountInfo();

        }else{
          console.log('fail')
             _this.$Notice.error({
                    title: 'Transaction error',
                    desc:  data.data.data.result.check_tx.log
                });
        }

      })
      .catch(function(err){
        console.log(err);

      })
      
    },
    getpaylist(address){
      function checkaddress(address1){
        if(address1.toUpperCase()==address.toUpperCase()){
          return ' -  ';
        }else{
          return ' +  ';
        }

      }
      function showaddress(address1,address2){
        if(address1.toUpperCase()==address.toUpperCase()){
          return 'to  '+address2;
          
        }else{
          return 'from  '+address1;
        }

      }
      var _this=this;
      ipc.callMain('httpget', {
          'url':'http://explorer.lambda.im/api/tx/getTxAccountList',
          'data':{
            accountHash:address,
            pageNum:1,
            showNum:10
          }
      })
      .then(function(res){
        console.log('getpaylist',res.data.data);
        if(res.data.data&&res.data.data.code==200){
          // _this.$data.txlist=res.data.data.data.txList;
          _this.$data.data=[];
          res.data.data.data.txList.forEach(function(item){
            
            _this.$data.data.push(  {
              amount:checkaddress(item.from)+  filters.formatValue(item.value),
              source: showaddress(item.from,item.to),
              type: "Transaction",
              date: filters.formatDate(item.time),
              status: 1
            })
          })


          //===
          // data: [
            // {
            //   amount: "+ 0.0001 LAMB ",
            //   source: "From fisimtoken4y",
            //   type: "Transaction",
            //   date: "3 days ago",
            //   status: 1
            // }
          // ],
          //===
        }

      })
      .catch(function(err){

      })
    }
  },
  computed: {
    balance:function(){
      if(this.$data.accountinfo&&this.$data.accountinfo.balance){
        return this.$data.accountinfo.balance/10000

      }else{
        return 0
      }
    }
  },
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
