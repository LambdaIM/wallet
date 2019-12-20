<template>
  <div>
    <Modal
      v-model="open"
      :title="$t('Sign.Enter_password')"
      :styles="{ top: '200px' }"
      @on-visible-change="changeStatus"
    >
      <p>
        <Input v-model="walletPassword" type="password"></Input>
      </p>

      <Row class-name="fail">
        <Col span="24">
          <span style="cursor: pointer;" @click="opencmd" class="title">
            {{ $t('marketpage.Openfailure') }}？
            <Icon v-if="cmdstate == true" size="18" type="ios-arrow-dropup-circle" />
            <Icon v-if="cmdstate == false" size="18" type="ios-arrow-dropdown-circle" />
          </span>
        </Col>
        <Col v-if="cmdstate" span="24" class-name="content-wrapper">
          <p class="fail-message">
            {{ $t('marketpage.Openfailuretip') }}
            <Icon
              v-clipboard:copy="storagecommandline"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              size="24"
              :type="type"
            ></Icon>
          </p>

          <Input readonly v-model="storagecommandline" type="textarea" :rows="4" />
        </Col>
      </Row>

      <div slot="footer">
        <Button :loading="loading" type="primary" @click="s3authorization">{{ $t('Sign.submit') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');

export default {
  data() {
    return {
      storagecommandline: 'aaaaaaa',
      type: 'md-copy',
      open: false,
      walletPassword: '',
      loading: false,
      cmdstate: false,
      managerkey: {}
    };
  },
  props: {
    orderid: {
      type: String
    }
  },
  methods: {
    openDialog(id) {
      this.init();
      this.open = true;
    },

    async init() {
      await this.getmanagerkey();
      await this.getlambdastoragecommandline();
    },

    async getmanagerkey() {
      try {
        let res = await ipc.callMain('lambdastoragemanagerkey', {});
        if (res.state) {
          this.managerkey = res.data.gateway;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getlambdastoragecommandline() {
      try {
        let res = await ipc.callMain('lambdastoragecommandline', {});
        if (res.state) {
          this.storagecommandline = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    opencmd() {
      this.cmdstate = !this.cmdstate;
    },
    onCopy: function(e) {
      this.type = 'ios-copy';
      setTimeout(() => {
        this.type = 'md-copy';
        this.$Message.info(this.$t('head.action.You_just_copied') + e.text);
      }, 300);
    },
    onError: function(e) {
      this.$Message.info(this.$t('head.action.Failed_to_copy_texts'));
    },

    changeStatus(val) {
      this.open = val;
    },

    async s3authorization() {
      // console.log('runlambdastorage');
      this.loading = true;
      var result = {};
      try {
        this.timeid = setTimeout(() => {
          this.loading = false;
          shell.openExternal(`http://${this.managerkey['address']}/minio/login`);
          this.open = false;
        }, 3000);
        result = await ipc.callMain('runlambdastorage', {
          password: this.walletPassword
        });
        // console.log(result);
      } catch (ex) {
        console.log(ex);

        this.loading = false;
        console.log(ex.errormsg.indexOf('Got a signal from the OS'));
        if (ex.errormsg.indexOf('Got a signal from the OS') == -1) {
          this.$Notice.error({
            title: 'error',
            desc: ex.errormsg
          });
          clearTimeout(this.timeid);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.fail {
  margin-top: 14px;
}
.fail-message {
  margin-bottom: 6px;
  margin-top: 4px;
}
</style>
