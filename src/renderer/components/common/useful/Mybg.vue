<template>
  <div class="bg-container">
    <keep-alive>
      <div class="bg-img-container"></div>
    </keep-alive>
    <!-- <div class="bg-logo-container">
      <keep-alive>
        <img @click="goHome" class="logo" src="../../../assets/img/logo.png" alt>
      </keep-alive>
    </div> -->
    <div class="bg-content-container">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    goHome(){
      this.$router.push('/');
    }
  }
};
</script>

<style lang="less" scoped>
.bg-container {
  width: 100%;
  height: 100%;
  z-index: 1;
  .bg-img-container {
    background: url(../../../assets/img/bgs_01.jpg);
    background-size: cover;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .bg-logo-container {
    .logo {
      margin-left: 30px;
      margin-top: 20px;
    }
  }
  .bg-content-container {
    margin-top: 10px;
    width: 100%;
    padding-bottom: 40px;
  }
}
</style>