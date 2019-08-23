<template>
  <div id="app">
    <Header/>

    <router-view></router-view>
    <Modal  :title="$t('apppage.Modal1.Please_enter_password')" v-model="passwordModal" :styles="{top: '200px'}">
        <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button :loading="loadingsendLAMBTx" type="primary" @click="TransferConfirmTimeOut">{{$t('apppage.Modal1.Confirm')}}</Button>
        </div>
      </Modal>

    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/common/layout/Footer.vue";
import Header from "@/components/common/layout/Head.vue";
import eventHub from "@/common/js/event.js"

const {ipcRenderer: ipc} = require('electron-better-ipc');

export default {
  name: "wallet",
  components: {
    Footer,
    Header
  },
  data(){
    return {
      txdata:null,
      passwordModal:false,
      walletPassword:null,
      loadingsendLAMBTx:false
    }

  },
  mounted() {
    eventHub.$on("TxConfirm", (data,gaseFee) => {
      console.log('TxConfirm');
      console.log(data);
      this.$data.txdata=data
      this.$data.passwordModal=true;
      this.$data.loadingsendLAMBTx=false;
      this.$data.gaseFee=gaseFee;
      this.$data.walletPassword='';

    });
  },
  methods: {
    TransferConfirmTimeOut(){
      this.$data.loadingsendLAMBTx = true;
      if(this.$data.timeid!=undefined){
        clearTimeout(this.$data.timeid)
      }
      this.$data.timeid = setTimeout(()=>{
        this.TransferConfirm();
      },1000);


    },
    TransferConfirm() {
      
      var _this = this;
      if (this.$data.walletPassword == null) {
        return;
      }
      
      ipc
        .callMain("transferConfirm", {
          password: this.$data.walletPassword,
          transactiondata: this.$data.txdata,
          gaseFee:this.$data.gaseFee
        })
        .then(function(data) {
          if (data.state == false) {
            _this.$data.loadingsendLAMBTx = false;
            if (data.code == "1001") {
              _this.$Notice.error({
                title: _this.$t("apppage.action.check_password")
              });
            } else {
              _this.$data.passwordModal = false;
              _this.$Notice.error({
                title: _this.$t("apppage.action.Transaction_failure")
              });
            }
            return;
          }
          if(data.data.logs[0].success){
            console.log("ok");
            _this.$data.passwordModal = false;
            _this.$data.walletPassword = null;
            
            console.log(data.data.txhash);
            _this.$Modal.success({
              title: _this.$t("apppage.action.Transaction_success"),
              width: '700',
              content: `${_this.$t('Dialog.com.Transactionhash')}  <br/>
                          <a  href="#/detail/${data.data.txhash}">
                          ${data.data.txhash}
                        </a>` ,
              okText: "OK",
            });
            // _this.getAccountInfo()
            eventHub.$emit('TransactionSuccess');

            }
         
        })
        .catch(function(err) {
          console.log(err);
          
          _this.$data.loadingsendLAMBTx=false;
          if(err.errormsg&&err.errormsg.indexOf("Tx already exists in cache")>0){
            _this.$data.passwordModal = false;
            _this.$data.walletPassword = null;
            _this.$Modal.warning({
              title: _this.$t('Dialog.com.Txalreadyexistsincache'),
              width: '700',
              content: err.errormsg ,
              okText: "OK",
            });
            eventHub.$emit('TransactionSuccess');
           return ;
          }

          try {
            var errormsg = JSON.parse(err.errormsg) 
            if(errormsg instanceof Array){
              errormsg.forEach((errItem)=>{
                var log = JSON.parse(errItem.log) 
                _this.$Notice.error({
                  title: 'error',
                  desc:log.message||'error',
                  duration: 60
                });
              })

            }else{
              _this.$Notice.error({
                  title: 'error',
                  desc:errormsg.message||'error',
                  duration: 60
                });

            }
            

          } catch (error) {
            _this.$Notice.error({
              title: 'error',
              desc:err.errormsg||'error',
              duration: 60
            });
            
          }
          
        });

    },
  },
};
</script>

<style lang="less" scoped>
</style>
