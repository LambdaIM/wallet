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
          <!-- <p v-for="(item,index) in walletList" :key="index">
            <span>{{item.name}}</span>
            <span>{{item.address}}</span>
          </p>-->
          <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form-container">
            <FormItem prop="name">
              <Select v-model="value" @on-change="selectName" clearable size="large">
                <Option
                  v-for="(item,index) in walletList"
                  :value="item.name"
                  :key="index"
                >{{ item.name}} &nbsp; &nbsp; [{{item.address.slice(0,7)}}.....{{item.address.slice(-7)}}]</Option>
              </Select>
            </FormItem>

            <FormItem prop="password">
              <Input
                type="password"
                v-model="formInline.password"
                placeholder="Password"
                @on-enter="openWallet('formInline')"
              >
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>

          <div class="button-wrapper">
            <button class="btn login-button" @click="openWallet('formInline')">Login</button>
            <!-- <button class="btn login-button"    @click="getwalletList">Login1</button> -->
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
// import https from "@/server/https.js";
import Mybg from "@/components/common/useful/Mybg.vue";
const ipc = require("electron-better-ipc");
const settings = require("electron-settings");
export default {
  data() {
    return {
      formInline: {
        password: ""
      },
      index: null,
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
      },
      walletList: [],
      name: "",
      value: null,
      address: null
    };
  },
  components: {
    Mybg
  },
  mounted() {
    this.getwalletList();
    var open = settings.get("isopenfile");
    // console.log(open);
    if (open) {
      this.$router.push("/home");
    }  
  },
  methods: {
    selectName(value) {
      // console.log($event);
      for (let index = 0; index < this.walletList.length; index++) {
        if (value == this.walletList[index].name) {
          this.address = this.walletList[index].address;
          // console.log(this.address);

          this.setDefaultWallet();
        }
      }
    },
    openWallet(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.login();
        }
      });
    },
    async login() {
      console.log("loginDefaultWallet");
      let pass = this.formInline.password;
      try {
        var res = await ipc.callMain("loginDefaultWallet", {
          password: pass
        });
        console.log("login default wallet", res);
        if (res.state) {
          this.$Notice.success({
            title: "Login success !"
          });
          let login=settings.set("isopenfile", true);
          console.log(login);
          this.$store.dispatch("set", login);
          this.$router.push("/home");
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    async setDefaultWallet() {
      try {
        var res = await ipc.callMain("setDefaultWallet", {
          address: this.address
        });
        // this.$store.dispatch("setaddress", this.address);
        // console.log("set default success", res);
        if (!res.state)  return;

        // this.login();
      } catch (ex) {
        // console.log(ex);
        console.log("密码错误");
      }
    },
    getwalletList() {
      // console.log("- -");
      ipc
        .callMain("walletList", {})
        .then(res => {
          // console.log(res);
          if (!res.state) return;
          this.walletList = res.data;
        })
        .catch(err => {
          console.log("err");
          console.log(err);
        });
    }
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
