<template>
  <div id="app">
    <Header/>

    <router-view></router-view>

    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/common/layout/Footer.vue";
import Header from "@/components/common/layout/Head.vue";
export default {
  name: "wallet",
  components: {
    Footer,
    Header
  }
};
</script>

<style lang="less" scoped>

</style>
