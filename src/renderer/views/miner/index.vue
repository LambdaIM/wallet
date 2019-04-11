<template>
  <div class="miner-container">
      <Tabs value="name1">
        <TabPane label="Pledge information" name="name1">
          
          <div v-if="pledgeMinerData!=null" class="transaction-content">
            <Row class-name="card-item">
              <Col span="4" class-name="title-wrapper">
                <span class="title">Validator address:</span>
              </Col>
              <Col span="20" class-name="content-wrapper">
                <span  class="item-value">{{pledgeMinerData.validator_address}}</span>
              </Col>
            </Row>
            <Row class-name="card-item">
              <Col span="4" class-name="title-wrapper">
                <span class="title">Size:</span>
              </Col>
              <Col span="20" class-name="content-wrapper">
                <span  class="item-value">{{pledgeMinerData.size/(1024*1024)}}TB</span>
              </Col>
            </Row>
            <Row class-name="card-item">
              <Col span="4" class-name="title-wrapper">
                <span class="title">Use size:</span>
              </Col>
              <Col span="20" class-name="content-wrapper">
                <span  class="item-value">{{pledgeMinerData.use_size/(1024*1024)}}TB</span>
              </Col>
            </Row>
            <Row class-name="card-item">
              <Col span="4" class-name="title-wrapper">
                <span class="title">Pledge money:</span>
              </Col>
              <Col span="20" class-name="content-wrapper">
                <span  class="item-value">{{pledgeMinerData.money|formatValue}}</span>
              </Col>
            </Row>
            <Row class-name="card-item">
              <Col span="4" class-name="title-wrapper">
                <span class="title">status:</span>
              </Col>
              <Col span="20" class-name="content-wrapper">
                <span  class="item-value">{{statusText}}</span>
              </Col>
            </Row>
            
      </div>
          
        </TabPane>
        <TabPane label="Pending order list" name="name2">
          <div>
            <Table :columns="columns" :data="OrderList" slot="content"></Table>
        
          </div>
          <div class="pager">
                <ButtonGroup :size="buttonSize">
                  <Button :disabled="enrevious" @click="reviouspage" :size="buttonSize" type="primary">
                      <Icon type="ios-arrow-back" />
                      revious page
                  </Button>
                  <Button  :disabled="ennext"  @click="nextpage" :size="buttonSize" type="primary">
                      next page
                      <Icon type="ios-arrow-forward" />
                  </Button>
              </ButtonGroup>
          </div>
          
        </TabPane>
        <TabPane label="Matched orders" name="name3">
          <div>
            <Table :columns="columnsMatch" :data="matchOrderList" slot="content"></Table>
        
          </div>
          <div class="pager">
                <ButtonGroup :size="buttonSize">
                  <Button :disabled="enreviousMatched" @click="reviouspageMatched" :size="buttonSize" type="primary">
                      <Icon type="ios-arrow-back" />
                      revious page
                  </Button>
                  <Button  :disabled="ennextMatched"  @click="nextpageMatched" :size="buttonSize" type="primary">
                      next page
                      <Icon type="ios-arrow-forward" />
                  </Button>
              </ButtonGroup>
          </div>

        </TabPane>
        <!-- <TabPane label="Cancelled orders" name="name4">已经取消的订单</TabPane> -->
        <Button  @click="pledgeSpace"  slot="extra">Pledge space</Button>
        <Button style="margin-left: 10px"  @click="PendingOrder" slot="extra">Hang sell orders</Button>
    </Tabs>
       <Modal
        ok-text='Submit'
        cancel-text='Cancel'
        v-model="showPledgeSpace"
        title="Pledge New space"
        @on-ok="okPledgeNewspace">
        
        
        <p>
              <Input @on-change="datachange" v-model="pledgeSpaceNum">
                <span slot="prepend">Pledge space</span>
                <span slot="append">TB</span>
            </Input>
            
        </p>
        <p style="margin-top: 10px">
              <Input  :readonly="validatorAddressreadonly" v-model="validatorAddress">
                <span slot="prepend">Validator address</span>
                
            </Input>
            
        </p>
        
        <p class="PledgeP">Pledge LAMB:{{pledgeMoney}} LAMB</p>
    </Modal>
        <Modal
        v-model="showorder"
        title="Hang sell orders"
        ok-text='Submit'
        cancel-text='Cancel'
        @on-ok="askNewOrder"
        >
        <p class="inputitem">
            <Input v-model="orderTime">
              <span slot="prepend">Duration</span>
              <span slot="append">Day</span>
          </Input>
        </p>
        <p class="inputitem">
            <Input v-model="orderPrice">
              <span slot="prepend">Price </span>
              <span slot="append">LAMB/GB/Day</span>
          </Input>
        </p>
        <p class="inputitem">
            <Input v-model="orderSpace">
              <span slot="prepend">Space </span>
              <span slot="append">GB</span>
          </Input>
        </p>
        
    </Modal>
  </div>
</template>

<script>
const ipc = require("electron-better-ipc");
import MyTable from "@/components/common/useful/Mytable.vue";
import filters from "../../common/js/filter.js";
import wUtils from "../../common/js/utils.js";
import eventhub from "../../common/js/event.js";
function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

export default {
  mounted() {
    this.pledgeMiner();
    this.getOrderListByAddress();
    this.getMatchListByAddress();
  },
  data(){
    return {
      pledgeMinerData:null,
      OrderList:[],
      buttonSize: 'large',
      columns:[{
          title: "order id",
          key: "order_id"
        },{
          title: "price(LAMB/G/Day)",
          key: "price",
          render:(h,params)=>{
              return h('span',{style:{}},filters.formatValue(params.row.price) )
          }
        },{
          title: "space",
          key: "sellSize",
          render:(h,params)=>{
              return h('span',{style:{}},readableBytes(params.row.sellSize*1024*1024)  )
          }
        },{
          title: "surplus space",
          key: "size",
          render:(h,params)=>{
              return h('span',{style:{}},readableBytes( params.row.size*1024*1024) )
          }
        },{
          title: "create time",
          key: "create_time",
          render:(h,params)=>{
              return h('span',{style:{}}, filters.formatStringToTime(params.row.create_time) )
          }
        },{
          title: "duration",
          key: "duration",
          render:(h,params)=>{
              return h('span',{style:{}},params.row.duration/(60*60*24)+" days" )
          }
        }],
        pageIndex:1,
        matchOrderList:[],
        columnsMatch:[{
          title: "order id",
          key: "order_id"
        },{
          title: "buy address",
          key: "buy_address"
        },{
          title: "price(LAMB/G/Day)",
          key: "price"
        },{
          title: "space",
          key: "size"
        },{
          title: "amount",
          key: "amount"
        },{
          title: "status",
          key: "status"
        },{
          title: "create time",
          key: "create_time"
        },{
          title: "end time",
          key: "end_time"
        },{
          title: "settle time",
          key: "settle_time"
        }],
        pageMatchedIndex:1,
        showPledgeSpace:false,
        pledgeSpaceNum:'',
        validatorAddress:'',
        validatorAddressreadonly:false,
        transactiondata:null,
        showorder:false,
        orderTime:null,
        orderPrice:null,
        orderSpace:null
    }
  },
  methods: {
    async pledgeMiner(){
       console.log('**********')
          try{
            var result = await ipc.callMain("pledgeMiner", {
            })
            console.log(result)
            if(result.state==true){
              this.$data.pledgeMinerData = result.data;
              this.$data.validatorAddress = result.data.validator_address ;
              if(result.data.validator_address!=undefined){
                this.$data.validatorAddressreadonly=true;
              }
              
              
            }else{
              this.$Message.info('read pledgeMiner info error');
            }
            
          }
          catch(ex){
            console.log(ex);
            this.$Message.info('read pledgeMiner info error');
          }
     },
     async getOrderListByAddress(){
       console.log('**********')
          try{
            var result = await ipc.callMain("getOrderListByAddress", {
              pageNum:this.$data.pageIndex,
              showNum:10
            })
            console.log(result)
            if(result.state==true){
              this.$data.OrderList=result.data.data.result;
            }else{
              this.$Message.info('read Order List info error');
            }
            
          }
          catch(ex){
            console.log(ex);
            this.$Message.info('read Order List info error');
          }
     },
     nextpage(){
       this.$data.pageIndex+=1;
       this.getOrderListByAddress();

     },
     reviouspage(){
       this.$data.pageIndex-=1;
       this.getOrderListByAddress();
     },
     nextpageMatched(){
       this.$data.pageMatchedIndex+=1;
       this.getMatchListByAddress();

     },
     reviouspageMatched(){
       this.$data.pageMatchedIndex-=1;
       this.getMatchListByAddress();
     },
     async getMatchListByAddress(){
       console.log('**********')
          try{
            var result = await ipc.callMain("getMatchListByAddress", {
              pageNum:this.$data.pageMatchedIndex,
              showNum:10
            })
            console.log(result)
            if(result.state==true){
              var data=result.data.data.result;
                data.forEach(function(item){
                  item.price = filters.formatValue(item.price) ;
                  item.size = readableBytes(item.size*1024*1024);
                  item.create_time=filters.formatStringToTime(item.create_time) ;
                  item.end_time=filters.formatStringToTime(item.end_time) ;
                  item.settle_time=filters.formatStringToTime(item.settle_time) ;
                  item.amount = filters.formatValue(item.amount);
                  item.status = filters.formatMinerStatus(item.status);

              })

              this.$data.matchOrderList=result.data.data.result;
            }else{
              this.$Message.info('read match order list info error');
            }
            
          }
          catch(ex){
            console.log(ex);
            this.$Message.info('read match order list info error');
          }
          
     },
     pledgeSpace(){
       this.$data.showPledgeSpace=true;
     },
     PendingOrder(){
       this.$data.showorder=true;
     },
     async okPledgeNewspace(){
       var num = parseInt(this.$data.pledgeSpaceNum);
       if(isNaN(num)){
         return;
       }
       if(num<=0){
         this.$Message.info('Pledge space should not be less than 0');
         return
       }
       console.log(this.$store.getters.getblance)
       if(num*3000>wUtils.bigToNumber(this.$store.getters.getblance) ){
         this.$Message.info('Sorry, your LAMB is running low');
         return
       }
        var result = await ipc.callMain("pledgeNewspace", {
              sumSectors:String(num*1024*1024),//质押空间bigint 问题 最小单位1t
              validatorAddress:this.$data.validatorAddress,
            })
      console.log(result)
      this.$data.transactiondata=result.data;
      eventhub.$emit('TxConfirm',this.$data.transactiondata);
       

     },
     datachange(){
       console.log('*****')
       var num = parseInt(this.$data.pledgeSpaceNum);
       if(isNaN(num)){
         return;
       }
       this.$data.pledgeSpaceNum=num;

     },
     async  askNewOrder(){
        // orderTime:null,
        // orderPrice:null,
        // orderSpace:null

        var {orderTime,orderPrice,orderSpace} = this.$data;

        orderTime=parseInt(orderTime);
        orderPrice=parseFloat(orderPrice);
        orderSpace=parseFloat(orderSpace);

        if(isNaN(orderTime)){
          this.$Message.info('Fill in the correct duration ');
          return ;
        }
        if(isNaN(orderPrice)){
          this.$Message.info('Fill in the correct Price ');
          return ;
        }
        if(isNaN(orderSpace)){
          this.$Message.info('Fill in the correct Space ');
          return ;
        }
        if(orderTime<1){
            this.$Message.info('The duration should not be less than one day.');
        }

        if(orderPrice<=0){
          this.$Message.info('Prices need to be greater than zero');
        }
        if(orderSpace<=0){
          this.$Message.info('Pledge space need to be greater than zero');
        }
        orderSpace=orderSpace*1024;
        try{
            var result = await ipc.callMain("askpledgeOrder", {
              duration:orderTime,
              price:wUtils.numberToBig(orderPrice),
              size:String(orderSpace),   //最小单位是1m 
              type:0,     //SELL = 0;BUY  = 1;
              status:1, //ORDER_INACTIVE = 0; ORDER_ACTIVE   = 1;
              ip:'192.168.1.1',
              // sellSize:String(0)
            })
            console.log('挂单接口返回数据')
            console.log(result)
            this.$data.transactiondata=result.data;
            eventhub.$emit('TxConfirm',this.$data.transactiondata);
          }
          catch(ex){
            this.$Message.info('error');
            console.log(ex);
          }




     }
  },
  computed: {
    statusText:function(){
      return this.$data.pledgeMinerData.status==0?"Successful":"canceled"
    },
    ennext(){
      return  this.$data.OrderList.length<10;
    },
    enrevious(){
      return  this.$data.pageIndex==1;
    },
    ennextMatched(){
      return  this.$data.matchOrderList.length<10;
    },
    enreviousMatched(){
      return  this.$data.pageMatchedIndex==1;
    },
    pledgeMoney(){
      var num = parseInt(this.$data.pledgeSpaceNum);
      if(isNaN(num)){
        return 0

      }else{
        return this.$data.pledgeSpaceNum*3000||0

      }
      
    },
    blance: function() {
      return this.$store.getters.blance;
    }

  },
  components: {
    MyTable
  }

}
</script>

<style lang="less" scoped>
.miner-container {
  
    
    width: 96%;
    margin: 0 auto;
    margin-top: 40px;
  
}

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
  
.pager{
  text-align: center;
  margin-top: 20px;
  margin-bottom: 80px;
}

.PledgeP{
  margin-top: 20px;
  margin-left: 10px;
  // text-align: center;
  font-size: 14px;

}
.inputitem{
    margin-top: 5px;
    margin-bottom: 10px;
}
</style>
