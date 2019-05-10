<template>
  <div class="container">
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
          <button @click="transWays()" class="btn trans-button">
            {{way}}
            <Icon type="ios-arrow-forward"/>
          </button>
        </div>
      </div> -->
      <div class="demo-tabs-style2">
    <Tabs value="name1"  >

      <TabPane label="by keyStore file" name="name1">
          <Form
            ref="formbyfile"
            :model="formInline"
            :rules="ruleInline"
            class="form-container"
            
          >
            <FormItem prop="keystorefile">
              <Upload :before-upload="beforeUpload" :default-file-list="formInline.keystorefile" action="">
                <Button class="btn upload-button" icon="ios-cloud-upload-outline">Choose Wallet Files</Button>
              </Upload>
            </FormItem>

            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="Old password">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>

            <FormItem prop="walletName">
              <Input type="text" v-model="formInline.walletName" placeholder="Name your wallet">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>
          <div class="button-wrapper">
        <button class="btn login-button" @click="handleSubmit('formbyfile')">Import</button>
      </div>


        </TabPane>

        <TabPane label="by mnemonic word " name="name2">
          <Form
        ref="formInMnemonic"
        :model="Mnemonic"
        :rules="ruleMnemonic"
        class="form-container"
        
      >
        <FormItem prop="word">
          <Input
            type="textarea"
            v-model="Mnemonic.word"
            placeholder="8-20 characters,letter,number or symbol"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="walletname">
          <Input type="text" v-model="Mnemonic.walletname" placeholder="Name Your Wallet">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        
        <FormItem prop="password" >
          <Input
            autocomplete="on"
            type="password"
            v-model="Mnemonic.password"
            placeholder="password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>

        <FormItem prop="confirmPassword" class="confirmPassword">
          <Input
            autocomplete="on"
            type="password"
            v-model="Mnemonic.confirmPassword"
            placeholder="Confirm the password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
      <div class="button-wrapper">
        <button class="btn login-button" @click="handleSubmit('formInMnemonic')">Import</button>
      </div>

        </TabPane>
        
    </Tabs>
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
const ipc = require("electron-better-ipc");

export default {
  data() {
    return {
      show: true,
      
      formInline: {
        keystorefile:[],
        password: "",
        walletName: ""
      },
      Mnemonic:{

      },
      ruleMnemonic:{
        word:[
          {
            required: true,
            message: "Please fill in the Mnemonic word",
            trigger: "blur"
          }
        ],
        walletname: [
          {
            required: true,
            message: "Please fill in the wallet name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
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
      ruleInline: {
        walletName: [
          {
            required: true,
            message: "Please fill in the wallet name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          }
        ],
        keystorefile: [
          {
            required: true,
            type: "array",
            message: "Please select the keystore file ",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    console.log('8 8 8 8')
  },
  methods: {
    handleSubmit(name) {
      // this.$router.push("/home");
      this.$refs[name].validate(valid => {
        if (valid) {
          if(name == 'formbyfile'){
            this.importfile();
          }else{
            this.importWord();

          }
           
          
        }
      });
    },
    transWays() {
      this.show = !this.show;
      if (this.show == false) {
        this.way = "By Pravate Key";
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
    validateConfirmPass(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.Mnemonic.password) {
        callback(new Error("The two input passwords do not match!"));
      } else {
        callback();
      }
    },
    beforeUpload(file){  
      console.log(file.path)
      this.$data.formInline.keystorefile=[{
                        name: file.name,
                        url: file.path
                    }];
       return false;
    },
    async importfile(){
      console.log(this.$data.formInline);

      var password = this.$data.formInline.password;
      var name = this.$data.formInline.walletName;
      var filepath = this.$data.formInline.keystorefile[0].url;
      try{
        var res = await ipc.callMain("importWalletBykeyStore", {
          filepath,
          password,
          name
        });


      }catch(ex){
        console.log(ex);
        this.$Notice.error({
            title: ex.errormsg
          });
      }
      

        console.log(res)
        if (res.state) {
          this.$Notice.success({
            title: "import Wallet !"
          });
          this.$router.push("/");
        }else{

        }
      
    },
    async importWord(){
        console.log( this.$data.Mnemonic)
        var {word ,walletname,password} = this.$data.Mnemonic
        try{
            var res = await ipc.callMain("ImportWalletByMnemonic", {
              mnemonic:word,
              password:password,
              name:walletname
            });
            console.log(res);


          }catch(ex){
            console.log(ex);
            this.$Notice.error({
                title: ex.errormsg
              });
          }

          if (res&&res.state) {
          this.$Notice.success({
            title: "import Wallet  Success!"
          });
          this.$router.push("/");
          }else{

          }
        
    }
  }
}
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
