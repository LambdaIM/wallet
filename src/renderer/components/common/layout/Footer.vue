<template>
  <div class="footer-container">
    <div class="footer-wrapper">
      <!-- <span class="item etc">Validator id: -->
      <span class="item etc">Validator id:
        <Poptip word-wrap trigger="hover" width="300" :content="id">{{id}}</Poptip>
      </span>
      
      <span class="item">Sync latest_block_height: {{height}}</span>
      <span class="item">latest_block_time: {{time | formatDate}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "9617c10aa3552d65620afc73b0a00278c9f063ab",
      height: "48596",
      time: "2019-03-07T09:02:17.105491169Z"
    };
  }
};
</script>

<style lang="less" scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  z-index: 9999;
  background: #09334c;
  background-size: cover;
  .footer-wrapper {
    width: 96%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item {
      width: 30%;
      height: 40px;
      // background-color: rgb(211, 211, 211);
      font-size: 14px;
      color: #fff;
      line-height: 40px;
    }
  }
}
</style>
