<template>
  <div class="container">
    <Mybg>
      <div class="content-container" slot="content">
        <div class="head-wrapper mt20">
          <div class="icon">
            <Icon type="ios-card-outline" class="icon-item" size="70"/>
          </div>
          <h2 class="title">{{ $t("Confirm.Confirm_words") }}</h2>
          <p>{{ $t("Confirm.click_words_to_confirm") }}</p>
        </div>


        <div class="word-wrapper">

          <div class="word-content">
            <span
              @click="deleteSingleWord(item,index)"
              v-for="(item,index) in inputWords"
              class="word-item"
              :key="index"
            >{{item}}</span>
          </div>
        </div>

        <div class="word-wrapper" :style="style">
          <div class="word-content">
            <span
              @click="getSingleWord(item,index)"
              v-for="(item,index) in words"
              class="word-item"
              :key="index"
            >{{item}}</span>

            <!-- <span v-if="showErr">Didn't get words</span> -->
          </div>
        </div>
        <div v-if="showButton" class="button-wrapper">
          <button class="btn next-button" @click="exportWallet">{{ $t("Confirm.Export_Keystore_File") }}</button>
        </div>
        <div v-else class="button-wrapper">
          <button class="btn next-button" @click="back">{{ $t("Confirm.backtoword") }}  </button>
        </div>
      </div>
    </Mybg>
  </div>
</template>

<script>
import Mybg from '@/components/common/useful/Mybg.vue';


const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      words: [],
      inputWords: [],
      showButton: false,
      combineWords: '',
      tempWords: [],
      style: {
        display: 'block'
      }
    };
  },
  watch: {
    words: {
      handler() {
        if (this.words.length == 0) {
          this.style.display = 'none';
          let tempCombineWords = this.inputWords.join(' ');
          console.log(tempCombineWords);
          if (tempCombineWords == this.combineWords) {
            this.showButton = true;
          } else {
            this.$Message.error(this.$t('Confirm.action.Confirmed_Fail'));
            setTimeout(() => {
              // this.$router.push("/register");
            }, 2000);
          }
        } else {
          this.style.display = 'block';
        }
      },
      deep: true
      // immediate: true
    }
  },
  methods: {
    back() {
      this.$router.push('/success');
    },
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
      this.tempWords = this.$store.getters.getCombineWords.split(' ');
      this.combineWords = this.$store.getters.getCombineWords;
      this.words = this.shuffle(this.tempWords);
    },
    async exportWallet() {
      console.log('- -');
      try {
        var res = await ipc.callMain('creatWalletComplete', {});
        if (res.state) {
          this.$store.dispatch('setCombineWord', '');
          this.$store.dispatch('setWord', []);
          ipc.callMain('openkeystore', {});
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } else {
          this.$Notice.error({
            desc: this.$t('create.action.create_fail'),
            duration: 1000
          });
        }
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          desc: this.$t('create.action.create_fail'),
          duration: 1000
        });
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
