<template>
<div>
          <Modal
        loading
        v-model="sendModal"
        :title="$t('Custombrowser.title')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
      <Form ref="formInline"   @keydown.native.enter.prevent ="preSendLAMB"
       :model="formInline" :rules="ruleInline" >

            <FormItem prop="url">
              <Input v-model="formInline.url" >
                <span slot="prepend">{{$t('Custombrowser.browserurl')}}</span>
              </Input>
            </FormItem>

        <p>
                <Button @click="setCustomaddress('main')">{{$t('Custombrowser.mianbrowser')}}</Button>
                <Button @click="setCustomaddress('teat')">{{$t('Custombrowser.testbrowser')}}</Button>
        </p>
        <br/>
        <p>
          <Button @click="checkurlstate"  type="primary" > {{$t('Custombrowser.test')}}  </Button>
        </p>


      </Form >
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('seting.Submit')}}</Button>
        </div>
      </Modal>



</div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
import { DAEMON_CONFIG } from '../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const settings = require('electron-settings');

export default {
  data() {
    return {
      sendModal: false,
      passwordModal: false,
      confirmModal: false,
      Tovalue: '',
      LAMBvalue: '',
      gaseFee: 0,
      voteType: 'Yes',
      title: '',
      address: '',
      name: '',
      password: '',
      formInline: {
        url: ''
      },
      ruleInline: {
        url: [
          {
            required: true,
            message: this.$t('Custombrowser.needurl'),
            trigger: 'blur'
          },
          {
            type: 'url',
            message: this.$t('Custombrowser.Formaterror'),
            trigger: 'blur'
          }
        ]
      },
      custombrowserurl: ''
    };
  },
  components: {
    ConfirmModal
  },
  methods: {
    open(item) {
      this.sendModal = true;
      console.log('open');

      this.$data.formInline.url = settings.get('custombrowserurl');
    },
    sendcancel() {
      this.sendModal = false;
      this.passwordModal = false;
    },
    preSendLAMB() {
      console.log('-----');

      /// ===
      this.$refs['formInline'].validate(valid => {
        if (valid) {
          this.sendModal = false;
          this.passwordModal = true;
          var url = this.$data.formInline.url;
          if (url.endsWith('/') == false) {
            url += '/';
          }
          settings.set('custombrowserurl', url);
          this.$Notice.warning({
            title: this.$t('Custombrowser.success'),
            desc: this.$t('Custombrowser.Setsuccessfully')
          });
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }
      });
      /// ===
    },

    setCustomaddress(typenet) {
      if (typenet == 'main') {
        this.$data.formInline.url = DAEMON_CONFIG.mainexplore;
      } else {
        this.$data.formInline.url = DAEMON_CONFIG.testexplore;
      }
    },
    checkurlstate() {
      this.$refs['formInline'].validate(async valid => {
        if (valid) {
          //= =
          try {
            var url = this.$data.formInline.url;


            if (url.endsWith('/') == false) {
              url += '/';
            }
            let res = await ipc.callMain('testbrowserurl', {
              baseurl: url
            });
            // console.log(res);
            if (res.state && res.data.code == 200) {
              this.$Notice.success({
                title: 'success',
                desc: this.$t('Custombrowser.testsuccess')
              });
            } else {
              this.$Notice.warning({
                title: 'error',
                desc: this.$t('Custombrowser.testerror')
              });
            }
          } catch (ex) {
            this.$Notice.warning({
              title: 'error',
              desc: ex.errormsg
            });
            console.log(ex);
          }
          //= =
        }
      });
    }


  },
  computed: {
    balance: function() {
      return this.$store.getters.getblance;
    },
    balanceLamb: function() {
      return this.$store.getters.getblance;
    },
    isdegeTxt: function() {
      return this.$t('proposalsPage.Vote');
    }
  }



};
</script>

<style lang="less" scoped>
.modal-header {
  .item {
    margin-top: 20px;
    font-size: 14px;
  }


}

</style>

