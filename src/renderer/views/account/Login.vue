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
<<<<<<< HEAD:src/renderer/views/account/Login.vue
=======
        <FormItem>
          <button type="button" class="btn login-button" @click="handleSubmit('formInline')">Login</button>
        </FormItem>
        <FormItem>
          <span @click="test">sss1</span>
          <span @click="test2">sss2</span>
          <span @click="test3">sss333333</span>
        </FormItem>
>>>>>>> 3a3460f... add dnode:src/renderer/views/Login.vue
      </Form>

      <div class="button-wrapper">
        <button class="btn login-button" @click="handleSubmit('formInline')">Login</button>
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
<<<<<<< HEAD:src/renderer/views/account/Login.vue
=======
const ipcRenderer = require("electron").ipcRenderer;
// import { DAEMON_CONFIG } from "../../config.js";
// var dnode = require('dnode');
// const RPC=require("../rpc.js")
import RPC from '../rpc.js'


>>>>>>> 3a3460f... add dnode:src/renderer/views/Login.vue
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
    test(){
      RPC('createWallet',{
        name:'mywallet',
        password:'123456'
      })
      .then((data)=>{
        console.log(data)

      })
      .catch((err)=>{
        console.log(err)

      })
    },
    test2(){
      RPC('getWalletAddress')
      .then((data)=>{
        console.log(data)

      })
      .catch((err)=>{
        console.log(err)

      })
    },
    test3(){
      RPC('getWallet','123456')
      .then((data)=>{
        console.log(data)

      })
      .catch((err)=>{
        console.log(err)

      })
    },
    handleSubmit(name) {
<<<<<<< HEAD:src/renderer/views/account/Login.vue
      this.$router.push("/home");
      // console.log(ipcRenderer.sendSync('message','world'));
=======
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
      ipcRenderer.send("message");
      ipcRenderer.on("message",(event)=>{
        console.log(event);
      });

      this.$router.push('/home');
      console.log(ipcRenderer.sendSync('message','world'));
>>>>>>> 3a3460f... add dnode:src/renderer/views/Login.vue
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
