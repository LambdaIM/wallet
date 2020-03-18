<template>
  <div id="app">

    <Header/>

    <router-view></router-view>
    <Modal  :title="$t('apppage.Modal1.Please_enter_password')" v-model="passwordModal" :styles="{top: '200px'}">
        <Form  @keydown.native.enter.prevent ="TransferConfirmTimeOut" >
          <Input autofocus v-model="walletPassword" type="password"></Input>
        </Form>
        <div slot="footer">
          <Button v-if="loadingsendLAMBTx==false" :loading="loadingsendLAMBTx" type="primary" @click="TransferConfirmTimeOut">{{$t('apppage.Modal1.Confirm')}}</Button>
          <Button v-else :loading="loadingsendLAMBTx" type="primary" > {{$t('apppage.Modal1.loading10')}}</Button>
        </div>
      </Modal>
         <div class="demo-spin-col" v-if="showTxLoading">
            <Spin fix>
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              <div>
                <Icon type="md-checkmark-circle" />
                {{$t("txTable.sendtxloading")}}<br/>
             {{$t('Dialog.com.Transactionhash')}}：{{txhash}}
              </div>

            </Spin>
        </div>

    <Footer/>

  </div>
</template>

<script>
import Footer from '@/components/common/layout/Footer.vue';
import Header from '@/components/common/layout/Head.vue';
import eventHub from '@/common/js/event.js';
import { setTimeout } from 'timers';


const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  name: 'wallet',
  components: {
    Footer,
    Header
  },
  data() {
    return {
      txdata: null,
      passwordModal: false,
      walletPassword: null,
      loadingsendLAMBTx: false,
      closeID: undefined,
      txhash: '',
      showTxLoading: false
    };
  },
  mounted() {
    eventHub.$on('TxConfirm', (data, gaseFee) => {
      console.log('TxConfirm');
      console.log(data);
      this.$data.txdata = data;
      this.$data.passwordModal = true;
      this.$data.loadingsendLAMBTx = false;
      this.$data.gaseFee = gaseFee;
      this.$data.walletPassword = '';
      this.txhash = '';
      this.showTxLoading = false;
    });
  },
  methods: {
    TransferConfirmTimeOut() {
      if (this.$data.loadingsendLAMBTx == true) {
        return;
      }
      console.log('TransferConfirmTimeOut');
      ipc.callMain('log', 'TransferConfirmPreJS');
      this.$data.loadingsendLAMBTx = true;
      if (this.$data.timeid != undefined) {
        clearTimeout(this.$data.timeid);
      }
      this.$data.timeid = setTimeout(() => {
        this.TransferConfirm();
      }, 1000);
    },
    cloasLoading() {
      if (this.$data.closeID != undefined) {
        clearTimeout(this.$data.closeID);
      }
      this.$data.closeID = setTimeout(() => {
        this.$data.loadingsendLAMBTx = false;
      }, 1000 * 10);
    },
    TransferConfirm() {
      console.log('TransferConfirm');
      ipc.callMain('log', 'TransferConfirmcallMain');
      var _this = this;
      if (this.$data.walletPassword == null) {
        return;
      }


      ipc
        .callMain('transferConfirm', {
          password: this.$data.walletPassword,
          transactiondata: this.$data.txdata,
          gaseFee: this.$data.gaseFee
        })
        .then(function(data) {
          if (data.state == false) {
            _this.cloasLoading();
            if (data.code == '1001') {
              _this.$Notice.error({
                title: _this.$t('apppage.action.check_password')
              });
            } else {
              _this.$data.passwordModal = false;
              _this.$Notice.error({
                title: _this.$t('apppage.action.Transaction_failure')
              });
            }
            return;
          }
          if (data.data == 'repeattx') {
            _this.$data.passwordModal = false;
            _this.$data.walletPassword = null;
            eventHub.$emit('TransactionSuccess');
            return;
          }

          if (data.data.haveHash == true) {
            console.log('ok');
            _this.$data.passwordModal = false;
            _this.$data.walletPassword = null;

            console.log(data.data.txhash);
            _this.$data.showTxLoading = true;

            _this.$data.txhash = data.data.txhash;

            setTimeout(() => {
              _this.Checkstatus();
            }, 1000);
          }
        })
        .catch(function(err) {
          console.log(err);

          _this.cloasLoading();
          if (err.errormsg && err.errormsg.indexOf('Tx already exists in cache') > 0) {
            _this.$data.passwordModal = false;
            _this.$data.walletPassword = null;
            _this.$Modal.warning({
              title: _this.$t('Dialog.com.Txalreadyexistsincache'),
              width: '700',
              content: err.errormsg,
              okText: 'OK'
            });
            eventHub.$emit('TransactionSuccess');
            return;
          }

          try {
            var errormsg = JSON.parse(err.errormsg);
            if (errormsg instanceof Array) {
              errormsg.forEach(errItem => {
                var log = JSON.parse(errItem.log);
                _this.$Notice.error({
                  title: 'error',
                  desc: log.message || 'error',
                  duration: 60
                });
              });
            } else {
              _this.$Notice.error({
                title: 'error',
                desc: errormsg.message || 'error',
                duration: 60
              });
            }
          } catch (error) {
            _this.$Notice.error({
              title: 'error',
              desc: err.errormsg || error.message || 'error',
              duration: 60
            });
          }
        });
    },
    async Checkstatus() {
      try {
        var txinfo = await ipc.callMain('CheckTxstatus', {});

        this.$data.showTxLoading = false;
        this.$Modal.success({
          title: this.$t('apppage.action.Transaction_success'),
          width: '700',
          content: `${this.$t('Dialog.com.Transactionhash')}  <br/>
                          <a  href="#/detail/${txinfo.data.txhash}">
                          ${txinfo.data.txhash}
                        </a>`,
          okText: 'OK'
        });
        eventHub.$emit('TransactionSuccess');
      } catch (err) {
        // 交易失败了也需要刷新余额
        this.$data.showTxLoading = false;
        console.log('Checkstatus6');
        console.log(err);
        this.$Modal.error({
          title: 'error',
          width: '700',
          content: `${this.$t('Dialog.com.Transactionhash')}  <br/>
                          ${this.$data.txhash}
                        <br/>
                        ${err.errormsg || err.message || 'error'}
                        <br/>
                        ${this.$t('Dialog.txhash.tip')}<br/>
                        ${this.$t('Dialog.txhash.tip1')}<br/>
                        ${this.$t('Dialog.txhash.tip2')}<br/>
                        ${this.$t('Dialog.txhash.tip3')}<br/>

                        `,
          okText: 'OK'
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>

@font-face {
  font-family: 'Consolas';  //重命名字体名
  src: url('./assets/CONSOLA.ttf');  //引入字体
  font-weight: normal;
  font-style: normal;
}
   .demo-spin-col{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    // border: 1px solid #eee;
    z-index: 9999;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>
