<template>
  <div class="customer-container">
       <Mycard :cardtitle="$t('Sign.Data_signature')" class="mt20">
      <div class="content" slot="card-content">

        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('Sign.address')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a  class="item-value"> {{address}} </a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('Sign.content')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a  class="item-value"> <Input v-model="content" type="textarea" placeholder="" /> </a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="10" class-name="title-wrapper">
            &nbsp;&nbsp;
          </Col>
          <Col span="10" class-name="content-wrapper">
            <Button @click="Datacollection" type="primary">{{$t('Sign.submit')}}</Button>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">{{$t('Sign.Signature_data')}}:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a  class="item-value"> <Input type="textarea"  :autosize="{minRows: 2,maxRows: 10}"  v-model="jsondata"  style="width: 400px" readonly/> 
            <Button
                v-clipboard:copy="jsondata"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="primary"
                shape="circle"
                icon="ios-copy"
              ></Button>
             </a>
          </Col>
        </Row>

        <!-- <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">公钥:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a  class="item-value"> <Input v-model="key"  style="width: 300px" readonly/> 
            <Button
                v-clipboard:copy="key"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="primary"
                shape="circle"
                icon="ios-copy"
              ></Button>
             </a>
          </Col>
        </Row>
        <Row class-name="card-item">
          <Col span="4" class-name="title-wrapper">
            <span class="title">签名:</span>
          </Col>
          <Col span="20" class-name="content-wrapper">
            <a  class="item-value"> <Input v-model="signature" style="width: 300px" readonly/>  
            <Button
                v-clipboard:copy="signature"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="primary"
                shape="circle"
                icon="ios-copy"
              ></Button>
            </a>
          </Col>
        </Row> -->

      </div>
    </Mycard>

    <Modal
        @on-ok="Datacollection"
        v-model="passwordModal"
        :title="$t('Sign.Enter_password')"
        :styles="{top: '200px'}"
      >
        <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button  type="primary" @click="walletsign">{{$t('Sign.submit')}}</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
import MyTable from "@/components/common/useful/Mytable.vue";
import Mycard from "@/components/common/useful/Mycard.vue";
const ipc = require("electron-better-ipc");
export default {
  data() {
    return {
      content:'',
      key:'',
      signature:'',
      jsondata:"",
      passwordModal:false,
      walletPassword:''
   
    };
  },
  components: {
    MyTable,
    Mycard
  },
  methods: {
    walletsign:async function(){
      var result={}
      try{
        result = await ipc.callMain("Walletsign", {
            content: this.$data.content,
            password: this.$data.walletPassword
          })
      }catch(ex){
        console.log(ex)
        this.$Message.error(ex.errormsg); 
      }
      
      console.log(result)
       if(result.state==true){
         this.$data.key=result.data.key;
         this.$data.signature=result.data.signature;
         this.$data.jsondata=JSON.stringify(result.data)
         this.$data.passwordModal=false;
       }
    },
    Datacollection: async function(){
      this.$data.passwordModal=true;
      
    },
    onCopy: function(e) {
      this.$Message.info(this.$t('Sign.action.Copy_success') );
    },
    onError: function(e) {
      this.$Message.info(this.$t("Sign.action.Copy_failed"));
    },
  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    }
  }
};
</script>

<style lang="less" scoped>
.customer-container {
  .container {
    margin-top: 40px;
  }
}
.card-item {
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .item-value {
        font-size: 14px;
      }
}
</style>