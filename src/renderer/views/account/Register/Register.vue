<template>
  <div class="container">
    <Mybg>
      <div class="register-container" slot="content">
        <div class="register-wrapper">
          <div class="form-title">
            <div class="title-wrapper">
              <p class="title">{{ $t("create.Create_Lambda_Wallet") }}</p>
              <!-- <p class="notice">WARNING: Password can NOT be reset or recovered, do remember it!</p> -->
            </div>
          </div>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form-container">
            <FormItem prop="walletName">
              <Input type="text" v-model="formInline.walletName" :placeholder="$t('create.Wallet_Name')">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="formInline.password"
                :placeholder="$t('create.characters_symbol')"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>

            <FormItem prop="confirmPassword" class="confirmPassword">
              <Input
                autocomplete="on"
                type="password"
                v-model="formInline.confirmPassword"
                :placeholder="$t('create.Confirm_password')"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>

          <div class="button-wrapper">
            <button  :loading="loading" class="btn login-button" @click="submit('formInline')">{{ $t("create.Create") }}</button>
          </div>

          <div class="bottom-wrapper tc">
            <router-link class="bottom-wrapper-item" to="/">{{ $t("create.Login_Wallet") }}</router-link>
            <span class="line"></span>
            <router-link class="bottom-wrapper-item" to="/import">{{ $t("create.Import_Wallet") }}</router-link>
          </div>
        </div>
      </div>
    </Mybg>
  </div>
</template>

<script>
import Mybg from "@/components/common/useful/Mybg.vue";
import { DAEMON_CONFIG } from "../../../../config.js";

const {ipcRenderer: ipc} = require('electron-better-ipc');
// const settings = require("electron-settings");
export default {
  data() {
    return {
      formInline: {
        walletName: "",
        password: ""
      },
      ruleInline: {
        walletName: [
          {
            required: true,
            message: this.$t("create.action.fill_walletName"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("create.action.fill_password"),
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max:20,
            message: this.$t("create.action.password_length"),
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            validator: this.validateConfirmPass,
            trigger: "blur"
          }
        ],
      },
      loading:false
    };
  },
  components: {
    Mybg
  },
  methods: {
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.create();
        }
      });
    },
    async create() {
      console.log("createWallet");
      let password = this.formInline.password;
      let name = this.formInline.walletName;
      console.log(password, name);
      // debugger;
      this.$data.loading=true;
      try {
        let res = await ipc.callMain("createWallet", {
          password,
          name
        });
        console.log(res);
        if (!res.state) {
          this.$Notice.error({
            desc: this.$t("create.action.create_fail"),
            duration: 1000
          });
        } else {
          let word = res.data.mnemonic.split(" ");
          // console.log(word);
          let combineWords = res.data.mnemonic;
          this.$store.dispatch("setCombineWord", combineWords);
          this.$store.dispatch("setWord", word);
          // this.$store.state.combineWords = result.mnemonic;
          this.$router.push("/success");
        }
      } catch (ex) {
        console.log(ex);
        this.$Notice.error({
            desc: this.$t("create.action.create_fail"),
            duration: 1000
          });

      }
      this.$data.loading=false;
    },
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error(this.$t("create.action.enter_password")));
      } else {
        if (this.formInline.confirmPassword !== "") {
          this.$refs.formInline.validateField("confirmPassword");
        }
        callback();
      }
    },
    validateConfirmPass(rule, value, callback) {
      if (value === "") {
        callback(new Error(this.$t("create.action.enter_password_again")));
      } else if (value !== this.formInline.password) {
        callback(new Error(this.$t("create.action.passwords_match")));
      } else {
        callback();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  .register-wrapper {
    position: absolute;
    width: 55%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
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
      }
    }
    .form-container {
      width: 80%;
      margin: 0 auto;
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
</style>
