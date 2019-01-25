<template>
  <div class="container">
    <Mybg>
      <div class="login-container" slot="content">
        <div class="login-wrapper">
          <div class="form-title">
            <div class="title-wrapper">
              <p class="title">LAMBDA Wallet</p>
            </div>
          </div>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form-container">
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>

          <div class="button-wrapper">
            <button class="btn login-button" @click="openWallet('formInline')">Login</button>
          </div>

          <div class="bottom-wrapper tc">
            <router-link class="bottom-wrapper-item" to="/register">Create Wallet</router-link>
            <span class="line"></span>
            <router-link class="bottom-wrapper-item" to="/import">Import Wallet</router-link>
          </div>
        </div>
      </div>
    </Mybg>
  </div>
</template>

<script>
// import RPC from "../../rpc.js";
import { DAEMON_CONFIG } from "../../../config.js";
import https from "@/server/https.js";
import Mybg from "@/components/common/useful/Mybg.vue";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
export default {
  data() {
    return {
      formInline: {
        password: ""
      },
      ruleInline: {
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
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
    openWallet(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let param = {
            password: this.formInline.password
          };
          console.log(param.password);
          let res = https.fetchget(
            `http://localhost:${DAEMON_CONFIG.RPC_PORT}/openWallet/${
              param.password
            }`
          );
          console.log(res.data.data);
        }
      });
    },
    test3() {
      // var pra =JSON.stringify({
      //   url:'https://www.baidu.com/',
      //   data:{
      //     ss:'sddss'
      //   }
      // })
      //http://18.136.176.184:13659/getAccount?address=%22cd8ed969d881c0e0b7b39ba32853db6741c5afb1%22
      var nodeBaseUrl = settings.get("user.node");
      var pra = {
        url:
          nodeBaseUrl +
          "abci_query?path=%22/accounts/cd8ed969d881c0e0b7b39ba32853db6741c5afb1%22&data=&height=&prove=",
        data: {
          ss: "sddss"
        }
      };
      ipc
        .callMain("httpget", pra)
        .then(function(data) {
          console.log("data", data.data.data.result.response);
          console.log("data", data.data.data.result.response.value);
          return ipc.callMain("protodecode", {
            value: data.data.data.result.response.value,
            dataType: "types.Account"
          });
        })
        .then(value => {
          console.log("解析后的数据", value);
        })

        .catch(function(err) {
          console.log("err", err);
        });
    },
  }
};
</script>

<style lang="less" scoped>
.container {
  .login-wrapper {
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
