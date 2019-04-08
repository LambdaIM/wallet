<template>
  <div class="container">
    

    <div class="account-info-container" style="margin: 20px">
        <Divider>rpc 接口和调用说明</Divider>
    <p>创建钱包     </p>
    <p><Button @click="createWallet">createWallet</Button></p>
    <Divider dashed></Divider>
    <p>导入钱包bykeystore</p>
    <p><Button @click="importWalletBykeyStore">importWalletBykeyStore</Button></p>
    <Divider dashed></Divider>
    <p>导入钱包by 助记词语</p>
    <p><Button @click="importWalletByMnemonic">importWalletByMnemonic</Button></p>
    
    <Divider dashed />
    <p>读取钱包列表</p>
    <p><Button @click="walletList">walletList</Button></p>
    <Divider dashed />
    <p>读取默认钱包(钱包地址和默认钱包名称)</p>
    <p><Button @click="defaultWalletBasicinfo">defaultWalletBasicinfo</Button> </p>
    <Divider dashed />
    <p>设置默认钱包</p>
    <p><Button @click="setDefaultWallet">setDefaultWallet</Button></p>
    
    <Divider dashed />
    <p>登录打开钱包</p>
    <p><Button @click="loginDefaultWallet">loginDefaultWallet</Button></p>
    <Divider dashed />
    <p>读取账号余额</p>
    <p><Button @click="getDefaultWalletBlance">getDefaultWalletBlance</Button></p>
    <p>转账</p>
    <p><Button @click="transfer">transfer</Button>  ________  <Button @click="TransferConfirm">TransferConfirm</Button> </p>
    <Divider dashed />
    <p>读取转账记录</p>
    <p><Button @click="transactionList">transactionList</Button></p>
    <Divider dashed />
    <p>一条转账记录的详情</p>
    <p><Button @click="transactionInfo">transactionInfo</Button></p>
    <p>获取挂单列表</p>
    <p><Button @click="getOrderListByAddress">getOrderListByAddress</Button></p>
    <p>获取匹配订单列表</p>
    <p><Button @click="getMatchListByAddress">getMatchListByAddress</Button></p>
    <p>获取矿工质押列表</p>
    <p><Button @click="pledgeMiner"> 获取矿工质押列表 </Button></p>
    <p>矿工挂单</p>
    <p><Button @click="pledgeOrder"> 生成挂单数据 </Button>
    <Button @click="TransferConfirm"> 签名并发送请求 </Button></p>
<!-- height, err := orderActor.Save(address, duration, price, size, ip)
    orderData := &types.OrderData{
		Address:    address,
		Duration:   uint64(duration),
		Price:      abci.NewBigInt().SetBigInt(price),
		Size_:      abci.NewBigInt().SetInt64(esEncodeFileStat.Size()),
		CreateTime: uint64(time.Now().Unix()),
		Type:       types.OrderType_BUY,
		Status:     types.OrderStatus_ORDER_ACTIVE,
	}
	orderDataBytes, err := proto.Marshal(orderData)
	if err != nil {
		return nil, -1, err
	}
	orderDataHash := utils.SHA256(orderDataBytes)
	txOrder := &types.TxOrder{
		Id:   orderDataHash,
		Data: orderData,
	}
	result, err := a.txClient.BroadcastTxCommit(txOrder) -->



    <p>矿工质押</p>
    <p><Button @click="pledgeNewspace">质押  </Button>
    <Button @click="TransferConfirm"> 签名并发送请求 </Button>
    </p>
    <!-- result, err := txclient.BroadcastTxCommit(&types.TxPledgeNew{
		Address:          key.GetPubKey().Address().Bytes(),
		SumSectors:       abci.NewBigInt().SetBigInt(sectorsSum),
		PledgeTime:       uint64(time.Now().Unix()),
		ValidatorAddress: validatorBytes,
	})
    
    message TxPledgeNew {
    bytes   address             = 1;
    BigInt  sumSectors          = 2;
    bytes   ip                  = 3;
    uint64  pledgeTime          = 4;
    bytes   validatorAddress    = 5;
}
} -->
    <p>取消挂单</p>
    <p><Button >取消挂单  </Button></p>
    <p>取消质押</p>
    <p><Button >取消质押  </Button></p>
      

    </div>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>


  </div>
</template>


<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
const ipc = require("electron-better-ipc");

import utils from "@/common/js/utils.js";




export default {
  data() {
    return {
      

    };
  },
  components: {
    Header,
    MyTable
  },
  mounted() {

    
  },
  beforeDestroy(){
    

  },
  data:function(){
    return {
    transactiondata:null
    }

  },
  methods:{
    async createWallet(){
         console.log('createWallet')
         var password = '12345678';
         var name = '注册测试钱包';
          try{
            var result = await ipc.callMain("createWallet", {
                password,
                name
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
         

     },
     async importWalletBykeyStore(){
         console.log('importWallet')
         var password = '123456';
         var name = '通过文件导入钱包';
         var filepath='/Users/webjs/lambWallet/testim.json';
          try{
            var result = await ipc.callMain("importWalletBykeyStore", {
                filepath,
                password,
                name
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async importWalletByMnemonic(){
         console.log('importWallet')
         var password = '123456';
         var name = '通过助记词语导入钱包';
         var mnemonic='sorry opinion city view misery physical eyebrow hunt gift tragic apology empty';
          try{
            var result = await ipc.callMain("ImportWalletByMnemonic", {
                mnemonic,
                password,
                name
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async walletList(){
         console.log('importWallet')
        //  var password = '123456';
        //  var name = '通过文件导入钱包';
        //  var mnemonic='sorry opinion city view misery physical eyebrow hunt gift tragic apology empty';
          try{
            var result = await ipc.callMain("walletList", {})
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async defaultWalletBasicinfo(){
         console.log('importWallet')
         
          try{
            var result = await ipc.callMain("defaultWalletBasicinfo", {})
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async setDefaultWallet(){
         console.log('importWallet')
         
          try{
            var result = await ipc.callMain("setDefaultWallet", {
              address:'37F56CAA1ADDBBDDA5656F383A1933B55433F448'
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async loginDefaultWallet(){
         console.log('loginDefaultWallet')
         
          try{
            var result = await ipc.callMain("loginDefaultWallet", {
              password:'123456'
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async getDefaultWalletBlance(){
         console.log('getDefaultWalletBlance')
         
          try{
            var result = await ipc.callMain("defaultWalletBlance", {
          
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async transfer(){
         console.log('getDefaultWalletBlance')
         var  to='480DC2D434EEA9EB95958A86749AC99C5073631C'; 
         var  amount =1;
         var  gas =1;
         amount = utils.numberToBig(amount) ;

          try{
            var result = await ipc.callMain("transfer", {
            to,amount,gas
            })
            console.log(result)
            this.$data.transactiondata=result.data;
          }
          catch(ex){
            console.log(ex);
          }
     },
     async TransferConfirm(){
          try{
            var password='qq123456';

            var result = await ipc.callMain("transferConfirm", {
            password:password,
            transactiondata:this.$data.transactiondata
            })
            console.log('交易返回的结果')
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async transactionList(){
         console.log('getDefaultWalletBlance')
          try{
            var result = await ipc.callMain("transactionList", {
            
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async transactionInfo(){
         console.log('getDefaultWalletBlance')
          try{
            var result = await ipc.callMain("transactionInfo", {
              hash:'997921421340592295cc8ae0479aabb4474b16017b6985aac2ddb5bbf6bf444a'
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async getOrderListByAddress(){
       console.log('**********')
          try{
            var result = await ipc.callMain("getOrderListByAddress", {
              pageNum:1,
              showNum:10
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async getMatchListByAddress(){
       console.log('**********')
          try{
            var result = await ipc.callMain("getMatchListByAddress", {
              pageNum:1,
              showNum:10
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async pledgeMiner(){
       console.log('**********')
          try{
            var result = await ipc.callMain("pledgeMiner", {
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async pledgeOrder(){
       console.log('**********')
          try{
            var result = await ipc.callMain("askpledgeOrder", {
              duration:361,
              price:utils.numberToBig(1),
              size:String(1024),   //最小单位是1m 
              // type:0,     //SELL = 0;BUY  = 1;
              status:1, //ORDER_INACTIVE = 0; ORDER_ACTIVE   = 1;
              ip:'192.168.1.1',
              sellSize:String(0)
            })
            console.log(result)
            this.$data.transactiondata=result.data;
          }
          catch(ex){
            console.log(ex);
          }
     },
     async pledgeNewspace(){
       console.log('**********')
          try{
            var result = await ipc.callMain("pledgeNewspace", {
              sumSectors:String(1*1024*1024),//质押空间bigint 问题 最小单位1t
              validatorAddress:'BAD01004F5D4D22D31F468ED297E7D75C1D6915E',
            })
            console.log(result)
            this.$data.transactiondata=result.data;
          }
          catch(ex){
            console.log(ex);
          }
     }


     //transactionInfo
     
     

  }
  
};
</script>