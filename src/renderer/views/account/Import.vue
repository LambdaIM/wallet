<template>
  <div class="container" @keyup.enter="handleSubmit('formInline')">
    <div class="logo-wrapper">
      <img class="logo" src="../../assets/img/logo.png" alt>
    </div>
    <div class="login-wrapper">
      <div class="form-title">
        <div class="title-wrapper">
          <p class="title">Import LAMBDA Wallet</p>
          <!-- <p class="notice">WARNING: Password can NOT be reset or recovered, do remember it!</p> -->
        </div>
      </div>
      <!-- <div class="trans-button-wrapper">
        <div class="trans-button-container">
          <button  class="btn trans-button">
            {{way}}
            <Icon type="ios-arrow-forward"/>
          </button>
        </div>
      </div> -->

      <Form
        ref="formInline"
        :model="formInline"
        :rules="ruleInline"
        class="form-container"
        v-if="show==true"
      >
        <!-- <FormItem prop="key">
          <Input type="text" v-model="formInline.user" placeholder="Paste Private Key Here">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem> -->

        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Name Your Wallet">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            placeholder="8-20 characters,letter,number or symbol"
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

      <Form
        ref="formInline"
        :model="formInline"
        :rules="ruleInline"
        class="form-container"
        v-if="show==false"
      >
        <FormItem prop="key">
          <Upload :before-upload="beforeUpload" :default-file-list="walletfile" action="" >
            <Button class="btn upload-button" icon="ios-cloud-upload-outline">Choose Wallet Files</Button>
          </Upload>
          
        </FormItem>

        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>

        <FormItem prop="key">
          <Input type="text" v-model="formInline.user" placeholder="Name your wallet">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>

      <div class="button-wrapper">
        <button class="btn login-button" @click="handleSubmit('formInline')">Import</button>
      </div>

      <div class="bottom-wrapper tc">
        <router-link class="bottom-wrapper-item" to="/">Login Wallet</router-link>
        <span class="line"></span>
        <router-link class="bottom-wrapper-item" to="/register">Create Wallet</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { DAEMON_CONFIG } from "../../../config.js";
const ipc = require("electron-better-ipc");
import https from "@/server/https.js";
const settings = require("electron-settings");
export default {
  data() {
    return {
      show: false,
      way: "By Pravate Key store file ",

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
        ],
        confirmPassword: [
          {
            validator: this.validateConfirmPass,
            trigger: "blur"
          }
        ] 
      },
      walletfile:[
                    
                ]
    };
  },
  methods: {
    handleSubmit(name) {
      // this.$router.push("/home");
      if(this.$data.walletfile.length==0){
          this.$Message.info('need select  Key store file ');
        return 
      }
      this.$refs[name].validate((valid)=>{
        if(valid){
            var path=encodeURIComponent(this.$data.walletfile[0].url);
            var walletName=encodeURIComponent(this.$data.formInline.user) ;
            var password=encodeURIComponent(this.$data.formInline.password) ;

            https.fetchget(
                  `http://localhost:${DAEMON_CONFIG.RPC_PORT}/ImportWalletByfile/${path}/${walletName}/${password}/`
                )
                .then((res)=>{
                  console.log(res)
                  if(res.data.state==true){
                    this.$Message.info('Import wallet successfully');
                    settings.set('isopenfile',true)
                    this.$router.push("/home");
                  }else{
                    this.$Message.info('Exceptional file format or incorrect wallet password');
                  }

                })
                .catch((err)=>{
                  this.$Message.info('Exceptional file format or incorrect wallet password');
                })
              }

      })
    },
    transWays() {
      this.show = !this.show;
      if (this.show == false) {
        this.way = "By Pravate Key store file ";
      } else {
        this.way = "By Mnemonic Words";
      }
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
    },
    beforeUpload(file){  
      console.log(file.path)

      this.$data.walletfile=[{
                        name: file.name,
                        url: file.path
                    }];

       return false;
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
</style>
