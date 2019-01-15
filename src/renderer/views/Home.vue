<template>
  <div class="container">
    <span class="back" @click="goBack">返回</span>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
}
</script>

<style lang="less" scoped>
.back{
  cursor: pointer;
}
</style>
