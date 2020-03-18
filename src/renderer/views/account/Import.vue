<template>
  <div class="container">
    <div class="logo-wrapper">
      <img class="logo" src="../../assets/img/logo.png" alt>
    </div>
    <div class="login-wrapper">
      <div class="form-title">
        <div class="title-wrapper">
          <p class="title">{{$t('Import.Import_LAMBDA_Wallet')}}</p>
          <!-- <p class="notice">WARNING: Password can NOT be reset or recovered, do remember it!</p> -->
        </div>
      </div>
      <!-- <div class="trans-button-wrapper">
        <div class="trans-button-container">
          <button @click="transWays()" class="btn trans-button">
            {{way}}
            <Icon type="ios-arrow-forward"/>
          </button>
        </div>
      </div>-->
      <div class="demo-tabs-style2">
        <Tabs value="name1">
          <TabPane :label="$t('Import.by_keyStore_file')" name="name1">
            <Form @keydown.native.enter.prevent ="handleSubmit('formbyfile')" ref="formbyfile" :model="formInline" :rules="ruleInline" class="form-container">
              <FormItem prop="keystorefile">
                <Upload
                  :before-upload="beforeUpload"
                  :default-file-list="formInline.keystorefile"
                  action
                >
                  <Button
                    class="btn upload-button"
                    icon="ios-cloud-upload-outline"
                  >{{$t('Import.Choose_Wallet_Files')}}</Button>
                </Upload>
              </FormItem>
              <FormItem prop="walletName">
                <Input
                  type="text"
                  v-model="formInline.walletName"
                  :placeholder="$t('Import.Name_you_wallet')"
                >
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>

              <FormItem prop="password">
                <Input
                  type="password"
                  v-model="formInline.password"
                  :placeholder="$t('Import.Password')"
                >
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
            </Form>
            <div class="button-wrapper">
              <button
                class="btn login-button"
                @click="handleSubmit('formbyfile')"
              >{{$t('Import.Import')}}</button>
            </div>
          </TabPane>

          <TabPane :label="$t('Import.by_mnemonic_word')" name="name2">
            <div v-if="review==false">
              <Form
                ref="formInMnemonic"
                :model="Mnemonic"
                :rules="ruleMnemonic"
                class="form-container"
                @keydown.native.enter.prevent ="handleSubmit('formInMnemonic')"
              >
                <FormItem prop="word">
                  <Input
                    type="textarea"
                    v-model="Mnemonic.word"
                    :placeholder="$t('Import.characters_symbol')"
                    :autosize="{minRows: 5}"
                  >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
                </FormItem>
                <FormItem prop="walletname">
                  <Input
                    type="text"
                    v-model="Mnemonic.walletname"
                    :placeholder="$t('Import.Name_you_wallet')"
                  >
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
                </FormItem>

                <FormItem prop="password">
                  <Input
                    autocomplete="on"
                    type="password"
                    v-model="Mnemonic.password"
                    :placeholder="$t('Import.Password')"
                  >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
                </FormItem>

                <FormItem prop="confirmPassword" class="confirmPassword">
                  <Input
                    autocomplete="on"
                    type="password"
                    v-model="Mnemonic.confirmPassword"
                    :placeholder="$t('Import.Confirm_password')"
                  >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
                </FormItem>
              </Form>
              <div class="button-wrapper">
                <button
                  class="btn login-button"
                  @click="handleSubmit('formInMnemonic')"
                >{{$t('Import.preview')}}</button>

              </div>
            </div>
            <div v-else>
              <h2 style="color: white;margin-bottom: 15px">{{$t('Import.name')}}：{{Mnemonic.walletname}}</h2>
              <h2 style="color: white;">{{$t('Import.mnemonicpreview')}}</h2>


                  <Tag  sizr="large" v-for="item in worldList" type="dot"  color="primary">{{item}}</Tag>
              <div style="text-align: center;">
                <br/><br/>

                <Button @click="back" class="btn login-button">{{$t('Import.edit')}}</Button>&nbsp;&nbsp;
                <Button
                  class="btn login-button"
                  @click="importWord"
                >{{$t('Import.Import')}}</Button>
              </div>
              <br/><br/>
            </div>
          </TabPane>
        </Tabs>
      </div>

      <div class="bottom-wrapper tc">
        <router-link class="bottom-wrapper-item" to="/">{{$t('Import.Login_Wallet')}}</router-link>
        <span class="line"></span>
        <router-link class="bottom-wrapper-item" to="/register">{{$t('Import.Create_Wallet')}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      show: true,

      formInline: {
        keystorefile: [],
        password: '',
        walletName: ''
      },
      Mnemonic: {},
      ruleMnemonic: {
        word: [
          {
            required: true,
            message: this.$t('Import.action.fill_Mnemonic_word'),
            trigger: 'blur'
          }
        ],
        walletname: [
          {
            required: true,
            message: this.$t('Import.action.fill_wallet_name'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('Import.action.fill_password'),
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            validator: this.validateConfirmPass,
            trigger: 'blur'
          }
        ]
      },
      ruleInline: {
        walletName: [
          {
            required: true,
            message: this.$t('Import.action.fill_wallet_name'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('Import.action.fill_password'),
            trigger: 'blur'
          }
        ],
        keystorefile: [
          {
            required: true,
            type: 'array',
            message: this.$t('Import.action.fill_keystore'),
            trigger: 'blur'
          }
        ]
      },
      review: false
    };
  },
  mounted() {

  },
  computed: {
    worldList() {
      var mnemonic = this.Mnemonic.word;
      console.log(mnemonic);
      var mnemonicList = mnemonic.match(/[a-z]+[\-\']?[a-z]*/ig);
      console.log(mnemonicList);
      return mnemonicList;
    }
  },
  methods: {
    back() {
      this.$data.review = false;
    },
    handleSubmit(name) {
      // this.$router.push("/home");
      this.$refs[name].validate(valid => {
        if (valid) {
          if (name == 'formbyfile') {
            this.importfile();
          } else {
            this.$data.review = true;
            // this.importWord();
          }
        }
      });
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('Import.action.enter_password')));
      } else {
        if (this.formInline.confirmPassword !== '') {
          this.$refs.formInline.validateField('confirmPassword');
        }
        callback();
      }
    },
    validateConfirmPass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('Import.action.enter_password_again')));
      } else if (value !== this.formInline.password) {
        callback(new Error(this.$t('Import.action.passwords_not_match')));
      } else {
        callback();
      }
    },
    validateConfirmPass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('Import.action.enter_password_again')));
      } else if (value !== this.Mnemonic.password) {
        callback(new Error(this.$t('Import.action.passwords_not_match')));
      } else {
        callback();
      }
    },
    beforeUpload(file) {
      console.log(file.path);
      var v3file = fs.readFileSync(file.path, 'utf8');
      var address = '';
      try {
        v3file = JSON.parse(v3file);
        address = v3file.address;
      } catch (err) {}

      this.$data.formInline.keystorefile = [
        {
          name: `${address}` || file.name,
          url: file.path
        }
      ];
      return false;
    },
    async importfile() {
      console.log(this.$data.formInline);

      var password = this.$data.formInline.password;
      var name = this.$data.formInline.walletName;
      var filepath = this.$data.formInline.keystorefile[0].url;
      try {
        var res = await ipc.callMain('importWalletBykeyStore', {
          filepath,
          password,
          name
        });
      } catch (ex) {
        console.log(ex);
        this.$Modal.error({
          title: 'error',
          content: "<div style='word-break: break-word;'>" + ex.errormsg + '</div>'
        });
      }

      console.log(res);
      if (res && res.state) {
        this.$Notice.success({
          title: this.$t('Import.action.import_Wallet_success')
        });
        this.$router.push('/');
      } else {
      }
    },
    async importWord() {
      console.log(this.$data.Mnemonic);
      var { word, walletname, password } = this.$data.Mnemonic;
      try {
        var res = await ipc.callMain('ImportWalletByMnemonic', {
          mnemonic: word,
          password: password,
          name: walletname
        });
        console.log(res);
      } catch (ex) {
        console.log(ex);
        this.$Modal.error({
          title: 'error',
          content: "<div style='word-break: break-word;'>" + ex.errormsg + '</div>'
        });
      }

      if (res && res.state) {
        this.$Notice.success({
          title: this.$t('Import.action.import_Wallet_success')
        });
        this.$router.push('/');
      } else {
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .container {

    background: url(../../assets/img/bgs_01.jpg);
    background-size: cover;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    .logo-wrapper {
      .logo {
        margin-left: 30px;
        margin-top: 20px;
      }
    }
    .login-wrapper {
      position: absolute;
      width: 70%;
      height: 80%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      overflow-y: scroll;
      .form-title {
        width: 100%;
        margin-top: 90px;
        .title-wrapper {
          text-align: center;
          .title {
            color: #fff;
            font-size: 20px;
            margin-bottom: 30px;
          }
          // .notice{
          //   font-size: 14px;
          //   color: #fff;
          //   margin-bottom: 30px;
          // }
        }
      }
      .trans-button-wrapper {
        width: 100%;
        margin-bottom: 15px;
        .trans-button-container {
          width: 80%;
          text-align: center;
          margin: 0 auto;
          .trans-button {
            width: 100%;
            background-color: rgb(67, 166, 190);
            cursor: pointer;
          }
        }
      }
      .form-container {
        width: 80%;
        margin: 0 auto;
        .upload-button {
          width: 100%;
          height: 45px;
          background-color: #fff;
        }
      }
      .button-wrapper {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 20px;
        .login-button {
          width: 100%;
          background-color: #6b9ebc;
        }
      }
      .bottom-wrapper {
        .bottom-wrapper-item {
          font-size: 14px;
          color: #fff !important;
        }
        .line {
          display: inline-block;
          margin: 0 22px;
          width: 2px;
          height: 14px;
          border-left: 2px solid rgb(83, 102, 128);
        }
      }
    }
  }
  .ivu-tag{
    font-size: 17px;
    height: 30px;
    line-height: 30px;
    margin: 7px;

  }
</style>
