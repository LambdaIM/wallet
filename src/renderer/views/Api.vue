<template>
  <div class="container">
    <Header/>

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
    
      

    </div>


  </div>
</template>


<script>
import Header from "@/components/common/layout/Head.vue";
import MyTable from "@/components/common/useful/Mytable.vue";
const ipc = require("electron-better-ipc");



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
         var password = '123456';
         var name = '通过文件导入钱包';
         var mnemonic='sorry opinion city view misery physical eyebrow hunt gift tragic apology empty';
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
              address:'2BFC8C8C0554102A9683C77943E15F25E74FB259'
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
         var  amount =1215;
         var  gas =1;
         amount=amount*10000

          try{
            var result = await ipc.callMain("transfer", {
            to,amount,gas
            })
            console.log(result)
          }
          catch(ex){
            console.log(ex);
          }
     },
     async TransferConfirm(){
         console.log('getDefaultWalletBlance')
         var  to='480DC2D434EEA9EB95958A86749AC99C5073631C'; 
         var  amount =1215;
         var  gas =1;
         amount=amount*10000;
         var password = '123456';

          try{
            var result = await ipc.callMain("transferConfirm", {
            password
            })
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
     }


     //transactionInfo
     
     

  }
  
};
</script>