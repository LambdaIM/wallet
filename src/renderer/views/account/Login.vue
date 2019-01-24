<template>
  <div class="container">
    <div class="logo-wrapper">
      <img class="logo" src="../../assets/img/logo.png" alt>
    </div>
    <div class="login-wrapper">
      <div class="form-title">
        <div class="title-wrapper">
          <p class="title">LAMBDA Wallet</p>
        </div>
      </div>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form-container">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Wallet Name">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>

      <div class="button-wrapper">
        <button class="btn login-button" @click="handleSubmit()">Login</button>
        <button class="btn login-button" @click="test">test</button>
      </div>

      <div class="bottom-wrapper tc">
        <router-link class="bottom-wrapper-item" to="/register">Create Wallet</router-link>
        <span class="line"></span>
        <router-link class="bottom-wrapper-item" to="/import">Import Wallet</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import RPC from "../../rpc.js";
import { DAEMON_CONFIG } from "../../../config.js";
import https from "@/server/https.js";
export default {
  data() {
    return {
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
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
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async test() {
      // RPC("createWallet", {
      //   name: "mywallet",
      //   password: "123456"
      // })
      //   .then(data => {
      //     console.log(data);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      console.log(`http://localhost:${DAEMON_CONFIG.RPC_PORT}/createWallet`);
      https
        .fetchget(
          `http://localhost:${DAEMON_CONFIG.RPC_PORT}/`
        )
        .then(response => {
          console.log(response.data)
          alert(response.data);
        });
        console.log(`http://localhost:${DAEMON_CONFIG.RPC_PORT}/createWallet`);
      https
        .fetchget(
          `http://localhost:${DAEMON_CONFIG.RPC_PORT}/createWallet/123456/admin`
        )
        .then(response => {
          alert(response.data.data);
        });

      //  console.log(res);
    },
    handleSubmit(name) {
      this.$router.push("/home");
      // console.log(ipcRenderer.sendSync('message','world'));
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
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
    width: 55%;
    height: 80%;
    left: 50%;
    top: 50%;
    // border-radius: 25px;
    transform: translate(-50%, -50%);
    // background: rgba(255, 255, 255,0.3);
    // border: 1px solid #fff;
    // color: rgb(199, 21, 21);
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
