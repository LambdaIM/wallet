<template>
  <div class="container">
    <Mybg>
      <div class="content-container" slot="content">
        <div class="head-wrapper mt20">
          <div class="icon">
            <Icon type="ios-checkmark-circle-outline" class="icon-item" size="70"/>
          </div>
          <h2 class="title mt10">{{ $t("success.t1") }}</h2>
          <p>{{ $t("success.t2") }}</p>
        </div>

        <div class="word-wrapper">
          <div class="word-content">
            <span v-for="(item,index) in words" class="word-item">{{item}}</span>
          </div>
        </div>

        <div class="button-wrapper">
          <button class="btn next-button" @click="next">{{ $t("success.t3") }}</button>
        </div>
      </div>
    </Mybg>
  </div>
</template>

<script>
import Mybg from "@/components/common/useful/Mybg.vue";
import { DAEMON_CONFIG } from "../../../..//config.js";
import https from "@/server/https.js";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      words: []
    };
  },
  computed: {
    // ...mapState({
    //   word: state => state.register.word
    // })
  },
  methods: {
    getWords() {
      this.words=this.$store.state.word;
    },
    next() {
      this.$router.push("/export");
    }
  },
  components: {
    Mybg
  },
  mounted() {
    this.getWords();
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .content-container {
    width: 90%;
    padding-bottom: 40px;
    // background-color: #fff;
    color: #fff;
    margin: 0 auto;
    text-align: center;
    .head-wrapper {
      margin-bottom: 40px;
      // .title{
      //   color: #1aa9ff;
      // }
      h2 {
        font-size: 24px;
      }
      p {
        margin-top: 20px;
        font-size: 18px;
      }
    }
    .word-wrapper {
      width: 76%;
      padding-top: 24px;
      padding-bottom: 54px;
      background-color: #fff;
      border-radius: 14px;
      margin: 0 auto;
      margin-bottom: 40px;
      .word-content {
        width: 100%;
        height: 100%;
        margin-left: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        .word-item {
          margin-top: 20px;
          padding: 0 16px;
          height: 44px;
          margin-right: 34px;
          line-height: 44px;
          border-radius: 6px;
          font-weight: 600;
          box-shadow: 0px 9px 0px #eef2f4, 0px 9px 25px #eef2f4;
          color: #606060;
          font-size: 14px;
          &:hover {
            cursor: pointer;
            &:active {
              box-shadow: 0px 3px 0px #eef2f4, 0px 9px 8px #eef2f4;
              position: relative;
              top: 6px;
            }
          }
        }
      }
    }
    .button-wrapper {
      width: 76%;
      margin: 0 auto;
      .next-button {
        width: 100%;
        height: 54px;
        border-radius: 6px;
        background-color: #6b9ebc;
        text-shadow: 0 -1px 0 #6b9ebc;
        box-shadow: 0 4px 0 #a3c5d6, 0 3px 20px #6b9ebc;
        &:active {
          box-shadow: 0 1px 0 #a3c5d6, 0 3px 8px #6b9ebc inset;
          position: relative;
          top: 6px;
        }
      }
    }
  }
}
</style>
