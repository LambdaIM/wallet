<template>
  <div class="setting-container">
    <Header/>
    <div class="setting-wrapper">
      <Mycard cardtitle="Wallet Info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">Wallet Name</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>Kagzag</span>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">Account Address</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>buQgSo8QLGtprNT2m4aTi2KpjQHEuHFcWXaw</span>
            </Col>
          </Row>
        </div>
      </Mycard>

      <Mycard cardtitle="Storage Info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="3" class-name="title-wrapper">
              <span class="title">Storage</span>
            </Col>
            <Col span="12" class-name="content-wrapper">
              <span>Used {{used}} GB / {{total}} GB</span>
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
              <span>30 LAMB</span>
            </Col>
          </Row>
        </div>
      </Mycard>

      <Mycard cardtitle="Private Key Info" class="mb10">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">Private Key</span>
            </Col>
            <Col span="6" class-name="content-wrapper">
              <span>{{hidden}}</span>
            </Col>

            <Col span="4" class-name="content-wrapper">
              <a>Private Key Visible</a>
            </Col>

            <Col span="4" class-name="content-wrapper">
              <a>Keystore File Backup</a>
            </Col>
          </Row>

          <Row class-name="card-item">
            <Col span="20">
              <p
                class="notice tc"
              >Wallet Password can’t be recovered, you can only create a new Wallet using Private Key once forgotten</p>
            </Col>
          </Row>
        </div>
      </Mycard>

      <Mycard cardtitle="Store Path for File" class="mb10">
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
      </Mycard>

      <Mycard cardtitle="Version" class="mb20">
        <div class="storage-content" slot="card-content">
          <Row class-name="card-item">
            <Col span="4" class-name="title-wrapper">
              <span class="title">Current Version</span>
            </Col>
            <Col span="3" class-name="content-wrapper">
              <span>V0.0.1</span>
            </Col>
            <Col span="3" class-name="content-wrapper">
              <a>Check Version</a>
            </Col>
          </Row>
        </div>
      </Mycard>

      <div class="logout-container">
        <div class="logout-wrapper">
          <button class="btn logout-button" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/common/layout/Head.vue";
import Mycard from "@/components/common/useful/Mycard.vue";
export default {
  data() {
    return {
      used: 3.04,
      total: 5,
      hidden: "*********************************",
      progressPercent: ""
    };
  },
  methods: {
    logout() {
      this.$router.push("/");
    }
  },
  computed: {
    calProgress() {
      this.progressPercent = (this.used / this.total).toFixed(4) * 100;
      // console.log(this.progressPercent);
      return this.progressPercent;
    }
  },
  components: {
    Header,
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
</style>
