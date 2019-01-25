<template>
  <div class="container">
    <Mybg>
      <div class="content-container" slot="content">
        <div class="head-wrapper mt20">
          <div class="icon">
            <Icon type="ios-card-outline" class="icon-item" size="70"/>
          </div>
          <h2 class="title">Confirm the words</h2>
          <p>Please click on the words in order to confirm that you are backing up correctly</p>
        </div>

        <div class="word-wrapper">
          <div class="word-content">
            <span
              @click="deleteSingleWord(item,index)"
              v-for="(item,index) in inputWords"
              class="word-item"
            >{{item}}</span>
          </div>
        </div>

        <div class="word-wrapper" :style="style">
          <div class="word-content">
            <span
              @click="getSingleWord(item,index)"
              v-for="(item,index) in words"
              class="word-item"
            >{{item}}</span>
            
            <!-- <span v-if="showErr">Didn't get words</span> -->
          </div>
        </div>
        <div class="button-wrapper">
          <button class="btn next-button" @click="goback">Export Keystore File</button>
        </div>
      </div>
    </Mybg>
  </div>
</template>

<script>
import Mybg from "@/components/common/useful/Mybg.vue";
import { DAEMON_CONFIG } from "../../../..//config.js";
import { mapState, mapMutations } from "vuex";
import https from "@/server/https.js";
export default {
  data() {
    return {
      words: [],
      inputWords: [],
      style: {
        display: "block"
      }
    };
  },
  // computed:{
  //   ...mapState(['word']),
  // },
  watch: {
    words: {
      handler() {
        if (this.words.length == 0) {
          this.style.display = "none";
        } else {
          this.style.display = "block";
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    deleteSingleWord(item, index) {
      // console.log(item,index);
      this.inputWords.splice(index, 1);
      this.words.push(item);
    },
    getSingleWord(item, index) {
      // console.log(item);
      this.inputWords.push(item);
      this.words.splice(index, 1);
    },
    getWords() {
      let tempWords = this.$store.state.word;
      this.words = this.shuffle(tempWords);
      // console.log(this.words);
    },
    goback() {
      let tempCombineWords = this.inputWords.join(" ");
      console.log(tempCombineWords);
      let combineWords = this.$store.state.combineWords;
      console.log(combineWords);
      if (tempCombineWords == combineWords) {
        // console.log("true");
        // 导出文件的逻辑
        this.$Message.success('Confirmed Success,the file has been export to your computer');
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } else {
        this.$Message.error('Confirmed fail!');
        setTimeout(() => {
          this.$router.push("/success");
        }, 2000);
      }
    },
    shuffle(array) {
      for (let i = array.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = array[randomIndex];
        array[randomIndex] = array[i];
        array[i] = itemAtIndex;
      }
      return array;
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
            cursor: pointer !important;
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
