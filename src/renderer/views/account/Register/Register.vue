<template>
  <div class="container">
    <Mybg>
      <div class="register-container" slot="content">
        <div class="register-wrapper">
          <div class="form-title">
            <div class="title-wrapper">
              <p class="title">Create Lambda Wallet</p>
              <!-- <p class="notice">WARNING: Password can NOT be reset or recovered, do remember it!</p> -->
            </div>
          </div>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form-container">
            <FormItem prop="walletName">
              <Input type="text" v-model="formInline.walletName" placeholder="Wallet Name">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="formInline.password"
                placeholder="8-20 characters,letter,number or symbol password"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>

            <FormItem prop="confirmPassword" class="confirmPassword">
              <Input
                autocomplete="on"
                type="password"
                v-model="formInline.confirmPassword"
                placeholder="Confirm the password"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>

          <div class="button-wrapper">
            <button class="btn login-button" @click="createWallet('formInline')">Create</button>
          </div>

          <div class="bottom-wrapper tc">
            <router-link class="bottom-wrapper-item" to="/">Login Wallet</router-link>
            <span class="line"></span>
            <router-link class="bottom-wrapper-item" to="/import">Import Wallet</router-link>
          </div>
        </div>
      </div>
    </Mybg>
  </div>
</template>

<script>
import Mybg from "@/components/common/useful/Mybg.vue";
import { DAEMON_CONFIG } from "../../../../config.js";
import https from "@/server/https.js";
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
            message: "Please fill in the walletName",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 8,
            message: "The password length cannot be less than 8 bits",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            validator: this.validateConfirmPass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    Mybg
  },
  methods: {
    createWallet(name) {
      // console.log('clickd');
      var _this=this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let param = {
            name: this.formInline.walletName,
            password: this.formInline.password
          };
          try {
            https
              .fetchget(
                `http://localhost:${DAEMON_CONFIG.RPC_PORT}/createWallet/${
                  encodeURIComponent(param.password)
                }/${param.name}`
              )
              .then(res => {
                let data = res.data.data;
                console.log(data);
                this.$store.state.word = data.split(" ");
                this.$store.state.combineWords = data;
                this.$router.push('/success');
              })
              .catch(function(err){
                _this.$Notice.warning({
                    title: 'create Wallet fail',
                });

              }) ;
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (this.formInline.confirmPassword !== "") {
          this.$refs.formInline.validateField("confirmPassword");
        }
        callback();
      }
    },
    validateConfirmPass(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.formInline.password) {
        callback(new Error("The two input passwords do not match!"));
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
