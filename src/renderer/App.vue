<template>
  <div id="app">
    <Header/>

    <router-view></router-view>
    <Modal  :title="$t('apppage.Modal1.Please_enter_password')" v-model="passwordModal" :styles="{top: '200px'}">
        <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button :loading="loadingsendLAMBTx" type="primary" @click="TransferConfirm">{{$t('apppage.Modal1.Confirm')}}</Button>
        </div>
      </Modal>

    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/common/layout/Footer.vue";
import Header from "@/components/common/layout/Head.vue";
import eventHub from "@/common/js/event.js"
const ipc = require("electron-better-ipc");

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
    eventHub.$on("TxConfirm", (data) => {
      console.log('TxConfirm');
      console.log(data);
      this.$data.txdata=data
      this.$data.passwordModal=true;
      this.$data.loadingsendLAMBTx=false;
    });
  },
  methods: {
    TransferConfirm() {
      
      var _this = this;
      if (this.$data.walletPassword == null) {
        return;
      }
      this.$data.loadingsendLAMBTx = true;
      ipc
        .callMain("transferConfirm", {
          password: this.$data.walletPassword,
          transactiondata: this.$data.txdata
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
            _this.$Notice.success({
                      title: _this.$t("apppage.action.Transaction_success"),
                      // desc:'Transaction hash  <br/>'+data.data.data.result.hash
                  });
            console.log(data.data.txhash);
            _this.$Modal.success({
              title: "Transaction success",
              width: '700',
              content: "Transaction hash  <br/>" + data.data.txhash,
              okText: "OK",
            });
            // _this.getAccountInfo()
            eventHub.$emit('TransactionSuccess');

            }
          // if (data.data.data.error) {
          //   _this.$data.passwordModal = false;
          //   _this.$Notice.error({
          //     title: data.data.data.error.message,
          //     desc: data.data.data.error.data
          //   });
          //   return;
          // }
          // if (data.data.data.result.check_tx.log == undefined) {
          //   console.log("ok");
          //   _this.$data.passwordModal = false;
          //   _this.$data.walletPassword = null;
          //   _this.$Notice.success({
          //             title: _this.$t("apppage.action.Transaction_success"),
          //             // desc:'Transaction hash  <br/>'+data.data.data.result.hash
          //         });
          //   console.log(data.data.data.result);
          //   // _this.$Modal.success({
          //   //   title: "Transaction success",
          //   //   width: '700',
          //   //   content: "Transaction hash  <br/>" + data.data.data.result.hash,
          //   //   okText: "OK",
          //   // });
          //   // _this.getAccountInfo()
          //   eventHub.$emit('TransactionSuccess');
          // } else {
          //   _this.$data.loadingsendLAMBTx = false;
          //   console.log("fail");
          //   _this.$Notice.error({
          //     title: _this.$t("apppage.action.Transaction_error"),
          //     desc: data.data.data.result.check_tx.log
          //   });
          // }
        })
        .catch(function(err) {
          console.log(err);
          _this.$data.loadingsendLAMBTx=false;

          try {
            var errormsg = JSON.parse(err.errormsg) 
            _this.$Notice.error({
              title: errormsg.message,
              
            });
          } catch (error) {
            _this.$Notice.error({
              title: err.errormsg||'error',
              
            });
            
          }
          
        });

    },
  },
};
</script>

<style lang="less" scoped>
</style>
