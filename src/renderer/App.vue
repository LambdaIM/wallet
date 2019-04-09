<template>
  <div id="app">
    <Header/>

    <router-view></router-view>
    <Modal  title="Please enter your wallet password" v-model="passwordModal" :styles="{top: '200px'}">
        <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="sendLAMBTx">Confirm</Button>
        </div>
      </Modal>

    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/common/layout/Footer.vue";
import Header from "@/components/common/layout/Head.vue";
import eventHub from "@/common/js/event.js"
export default {
  name: "wallet",
  components: {
    Footer,
    Header
  },
  mounted() {
    eventHub.$on("TransferConfirm", (data) => {
      console.log('TransferConfirm');
      console.log(data);
      this.$data.passwordModal=true;
    });
  },
  data(){

    return {
      passwordModal:false
    }
  }
};
</script>

<style lang="less" scoped>
</style>
