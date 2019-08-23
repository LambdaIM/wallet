<template>
  <div class="setting-container">
    <div class="setting-wrapper">
      <Mycard
        v-if="walletInfo"
        :cardtitle="$t('seting.Wallet_Info')"
        class="mb10"
      >
        <div
          class="storage-content"
          slot="card-content"
        >
          <Row class-name="card-item">
            <Col
              span="4"
              class-name="title-wrapper"
            >
            <span class="title">{{$t("seting.Wallet_Name")}}</span>
            </Col>
            <Col
              span="12"
              class-name="content-wrapper"
            >
            <span>{{walletInfo.name}}</span>
            <Button
              @click="modal2 = true"
              type="primary"
              shape="circle"
              icon="ios-create"
            ></Button>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col
              span="4"
              class-name="title-wrapper"
            >
            <span class="title">{{$t("seting.Account_Address")}}</span>
            </Col>
            <Col
              span="12"
              class-name="content-wrapper"
            >
            <span>{{walletInfo.address}}</span>

            <Button
              v-clipboard:copy="walletInfo.address"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="primary"
              shape="circle"
              icon="ios-copy"
            ></Button>
            <!-- <Button
                v-clipboard:copy="walletInfo.address"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="primary"
                shape="circle"
                icon="ios-copy"
              ></Button> -->
            </Col>
          </Row>
          <Row class-name="card-item">
            <Col
              span="4"
              class-name="title-wrapper"
            >
            <span class="title">{{ $t("seting.switch-lang") }}</span>
            </Col>
            <Col
              span="12"
              class-name="content-wrapper"
            >
            <Dropdown @on-click="selectlang">
              <a href="javascript:void(0)">
                <svg
                  v-if="langnow =='en'"
                  t="1561106310862"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2302"
                  width="32"
                  height="25"
                >
                  <path
                    d="M0 859.7h1024V177.3H0z"
                    fill="#00458F"
                    p-id="2303"
                  ></path>
                  <path
                    d="M1023.4 416.2H614V177.3h-205v238.9H0v204.6h409v238.9h205V620.8h409.4z"
                    fill="#FFFFFF"
                    p-id="2304"
                  ></path>
                  <path
                    d="M1023.4 781.1L117.1 177.3H0v79.3l905.1 603.1h118.3z"
                    fill="#FFFFFF"
                    p-id="2305"
                  ></path>
                  <path
                    d="M0 781.1l906-603.8h117.4v79.3L118 859.7H0z"
                    fill="#FFFFFF"
                    p-id="2306"
                  ></path>
                  <path
                    d="M1023.4 459H571.2V177.3H452.2V459H0v119H452.2v281.7h119V578h452.2z"
                    fill="#CC3440"
                    p-id="2307"
                  ></path>
                  <path
                    d="M1023.4 857.8v-54l-275-182.9H667.2l356.2 236.9z m0-680.5H942.2L614 395.7v20.1h50.5l358.9-238.5zM356 620.8L0.1 857.8v1.6h77.7l331.6-220v-18.5h-53.4zM0 177.3v54l276.6 184.8h81.9L0 177.3z"
                    fill="#CC3440"
                    p-id="2308"
                  ></path>
                </svg>
                <svg
                  v-if="langnow =='zh'"
                  t="1561106763567"
                  class="icon"
                  viewBox="0 0 1546 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3099"
                  width="32"
                  height="25"
                >
                  <path
                    d="M11.322 1017.71h1520.904V6.29H11.322v1011.42zM1536 1021.484v-3.774 3.774zM5.032 1024V0h1533.484v1024H5.032z"
                    fill="#353636"
                    p-id="3100"
                  ></path>
                  <path
                    d="M8.806 2.516H1536v1017.71H8.806z"
                    fill="#D64B24"
                    p-id="3101"
                  ></path>
                  <path
                    d="M264.177 118.25l32.708 99.381h104.412l-84.285 60.384 31.45 99.38-84.285-61.64-84.285 61.64 32.708-99.38-84.286-60.384h104.413z m271.725-52.835l-1.258 35.224 31.45 12.58-33.966 8.806-1.258 33.965L512 127.057l-32.708 7.547 21.386-26.417-17.612-28.934 31.45 13.838z m116.992 111.96L637.8 207.569l23.901 23.901-33.965-5.032-15.096 30.192-5.032-33.966-33.966-5.032 30.192-15.095-5.032-33.966 23.902 23.902z m-35.223 138.38l11.322 32.707h33.965l-27.675 20.128 10.063 32.707-27.675-20.127-27.676 20.127 11.322-32.707-27.676-20.128h33.966z m-81.77 105.67l-2.515 33.966 32.707 12.58-33.965 8.805-2.516 33.966L512 481.808l-33.966 8.806 22.644-26.417-18.87-28.934 32.708 12.58z"
                    fill="#FBDC00"
                    p-id="3102"
                  ></path>
                </svg>
                <svg
                  t="1561107977281"
                  class="icon arrow"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4038"
                  width="12"
                  height="12"
                >
                  <path
                    d="M99.7376 238.0288l409.9328 443.6736 416-440.8064c18.2656-19.5584 47.9616-19.4944 66.304 0.1536 18.3424 19.6352 18.4192 51.4304-4.5568 70.9888L548.3264 782.272c-6.6304 6.3488-14.464 13.632-18.688 14.848-17.2416 7.4368-38.4256 3.712-55.8336-11.1488L28.5824 309.1712c-13.7216-19.7248-13.7984-51.6608 4.544-71.3088 18.3552-19.648 48.1664-19.584 66.6112 0.1664z"
                    p-id="4039"
                    fill="#000000"
                  ></path>
                </svg>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="en">English</DropdownItem>
                <DropdownItem name="zh">简体中文</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            </Col>
          </Row>
        </div>
      </Mycard>

      <!-- <Mycard  cardtitle="Storage Info" class="mb10">
        <div v-if="pledgeMinerData!=null" class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="3" class-name="title-wrapper">
              <span class="title">Storage</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>Used {{pledgeMinerData.use_size/(1024*1024)}} TB / {{pledgeMinerData.size/(1024*1024)}} TB</span>
              <p>
                <Progress :percent="calProgress" :stroke-width="5"/>
              </p>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="3" class-name="title-wrapper">
              <span class="title">Pledge</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>{{pledgeMinerData.money|formatValue}} LAMB</span>
            </Col>
          </Row>
        </div>
      </Mycard> -->

      <Mycard
        :cardtitle="$t('seting.Privat_Key_Info')"
        class="mb10"
      >
        <div
          class="storage-content"
          slot="card-content"
        >
          <Row class-name="card-item">
            <!-- <Col span="4" class-name="title-wrapper">
              <span class="title">Private Key</span>
            </Col>
            <Col span="6" class-name="content-wrapper">
              <span>{{hidden}}</span>
            </Col>

            <Col span="4" class-name="content-wrapper">
              <a>Private Key Visible</a>
            </Col> -->
            <Col
              span="4"
              class-name="title-wrapper"
            >
            &nbsp;
            </Col>

            <Col
              span="4"
              class-name="content-wrapper"
            >
            <a @click="openkeystore">{{$t("seting.Keystore_File_Backup")}}</a>
            </Col>
          </Row>

          <!-- <Row class-name="card-item">
            <Col span="20">
              <p
                class="notice tc"
              >Wallet Password can’t be recovered, you can only create a new Wallet using Private Key once forgotten</p>
            </Col>
          </Row> -->
        </div>
      </Mycard>
      <Mycard
        v-if="getstore.length>0"
        :cardtitle="$t('seting.Validator_Node_info')"
        class="mb10"
      >
        <div
          class="storage-content"
          slot="card-content"
        >
          <Row
            v-if="item[0]!='pub_key'"
            v-for="item in getstore"
            class-name="card-item"
          >
            <Col
              span="4"
              class-name="title-wrapper"
            >
            <span class="title">{{item[0]}}</span>
            </Col>
            <Col
              span="12"
              class-name="content-wrapper"
            >
            <span>{{item[1]}}</span>
            </Col>
          </Row>
          <Row class-name="card-item">
            <Col
              span="4"
              class-name="title-wrapper"
            >
            &nbsp;
            </Col>
            <Col
              span="12"
              class-name="content-wrapper"
            >
            <span>
              <router-link
                to="/validator"
                class="item"
              >{{$t("seting.Switch_Validator")}}</router-link>
            </span>
            </Col>
          </Row>

        </div>
      </Mycard>
      <Mycard
        v-if="getstore.length==0"
        :cardtitle="$t('seting.Validator_Node_info')"
        class="mb10"
      >
        <div
          class="storage-content"
          slot="card-content"
        >
          <Row class-name="card-item">
            <Col
              span="4"
              class-name="title-wrapper"
            >
            &nbsp;
            </Col>
            <Col
              span="12"
              class-name="content-wrapper"
            >
            <span>
              <router-link
                to="/validator"
                class="item"
              >{{$t("seting.Switch_Validator")}}</router-link>
            </span>
            </Col>
          </Row>
        </div>
      </Mycard>

      <!-- <Mycard cardtitle="Store Path for File" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">Store Path for File</span>
            </Col>
            <Col span="16" class-name="content-wrapper">
              <a>F:\program\BumoWallet-win32-x64-v1.1.0\BumoWallet-win32-x64\buchain\data</a>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">KeyStore File Path</span>
            </Col>
            <Col span="16" class-name="content-wrapper">
              <a>F:\program\BumoWallet-win32-x64-v1.1.0\BumoWallet-win32-x64\wallets\kerinlinlin.wallet</a>
            </Col>
          </Row>
        </div>
      </Mycard> -->

      <Mycard
        :cardtitle="$t('seting.Version')"
        class="mb20"
      >
        <div
          class="storage-content"
          slot="card-content"
        >
          <Row class-name="card-item">
            <Col
              span="4"
              class-name="title-wrapper"
            >
            <span class="title">{{$t("seting.Current_Version")}}</span>
            </Col>
            <Col
              span="3"
              class-name="content-wrapper"
            >
            <span>V{{versionNumber}}</span>
            </Col>
            <!-- <Col span="3" class-name="content-wrapper">
              <a>Check Version</a>
            </Col> -->
          </Row>
        </div>
      </Mycard>

      <div class="logout-container">
        <div class="logout-wrapper">
          <button
            class="btn logout-button"
            @click="logout"
          >{{$t('seting.Logout')}}</button>
        </div>
      </div>

      <Modal
        v-model="modal2"
        width="360"
      >
        <p slot="header">
          <span>{{$t('seting.edit_name')}}</span>
        </p>
        <div style="text-align:center">
          <p v-if="walletInfo!=null"> <Input
              v-model="editvalue"
              :placeholder="walletInfo.name"
            /></p>

        </div>
        <div slot="footer">
          <Button
            type="primary"
            size="large"
            long
            @click="editName"
          >{{$t('seting.Submit')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import Mycard from "@/components/common/useful/Mycard.vue";

  import https from "@/server/https.js";
  const {ipcRenderer: ipc} = require('electron-better-ipc');
  const settings = require("electron-settings");
  import { DAEMON_CONFIG } from "../../../config.js";
  import _ from "underscore";

  export default {
    data() {
      return {
        used: 3.04,
        total: 5,
        hidden: "*********************************",
        progressPercent: "",
        walletInfo: null,
        pledgeMinerData: null,
        modal2: false,
        editvalue: "",
        lang: "zh",
        langnow: this.$i18n.locale,
        versionNumber: "0.1.10"
      };
    },
    mounted() {
      this.getAccountInfo();
      // this.pledgeMiner();
    },
    methods: {
      onCopy: function(e) {
        this.$Message.info("You just copied: " + e.text);
      },
      onError: function(e) {
        this.$Message.info("Failed to copy texts");
      },
      logout() {
        settings.set("isopenfilev1", false);
        this.$store.dispatch("setLogin", false);
        this.$router.push("/");
        // console.log('8888')
      },
      async getAccountInfo() {
        var _this = this;
        var res = await ipc.callMain("defaultWalletBasicinfo", {});
        _this.$data.walletInfo = res.data;
      },
      openkeystore() {
        ipc.callMain("openkeystore", {});
      },
      async pledgeMiner() {
        console.log("**********");
        try {
          var result = await ipc.callMain("pledgeMiner", {});
          console.log(result);
          if (result.state == true) {
            this.$data.pledgeMinerData = result.data;
          } else {
            this.$Message.info("read pledgeMiner info error");
          }
        } catch (ex) {
          console.log(ex);
          this.$Message.info(ex.errormsg);
        }
      },
      async editName() {
        console.log("********** editName");
        var name = this.$data.editvalue;
        try {
          var res = await ipc.callMain("editWalletName", { name });

          console.log(res);
          if (res.state) {
            this.$Message.info(this.$t("seting.action.Modified_success"));
            this.$data.modal2 = false;
            this.getAccountInfo();
          } else {
            this.$Message.info(this.$t("seting.action.Modification_failed"));
          }
        } catch (ex) {
          this.$Message.info(this.$t("seting.action.Modification_failed"));
        }

        // _this.$data.walletInfo=res.data
      },
      selectlang(item) {
        this.$i18n.locale = item;
        this.$data.langnow = item;
        settings.set("set", {
          language: item
        });
        window.location.reload();
      }
    },
    computed: {
      calProgress() {
        this.progressPercent =
          (
            this.$data.pledgeMinerData.use_size / this.$data.pledgeMinerData.size
          ).toFixed(4) * 100;
        // console.log(this.progressPercent);
        return this.progressPercent;
      },
      getstore() {
        console.log(" - -");
        try {
          // this.$data.node_info=this.$store.getters.info.node_info;
          return _.pairs(this.$store.getters.info.validator_info);
        } catch (error) {
          return [];
        }
      }
    },
    components: {
      Mycard
    }
  };
</script>

<style lang="less" scoped>
  .setting-container {
    .setting-wrapper {
      padding: 20px;
      .card-item {
        padding-bottom: 15px;
      }
      .title-wrapper {
        .title {
          font-weight: 500;
        }
      }
      .logout-container {
        padding-bottom: 40px;
        width: 100%;
        .logout-wrapper {
          width: 40%;
          margin: 0 auto;
          .logout-button {
            width: 100%;
            background-color: rgb(134, 22, 22);
          }
        }
      }
    }
  }
  .arrow{
    margin-bottom: 6px;
    margin-left: 6px;
  }
</style>
