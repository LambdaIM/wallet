
<template>
  <div class="customer-container">
      <div class="tableContainer">
           <Row  class-name="card-item">
                            <Col span="4" class-name="title-wrapper">
                              <span class="title">{{$t('orderinfo.operating')}}:</span>
                            </Col>
                            <Col span="20" class-name="content-wrapper">
                              <Button @click="Datacollection" type="primary">{{$t('orderinfo.Viewlambdastorage')}} </Button>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <!-- <Button type="warning">{{$t('orderinfo.Filelossarbitration')}}</Button> -->
                            </Col>
                          </Row>
                          <Row class-name="card-item">
                            <Col span="8" class-name="title-wrapper">
                              <span class="title">{{$t('orderinfo.lambdastorageConsole')}}:</span>
                            </Col>
                            <Col span="8" class-name="content-wrapper">

                              {{$t('orderinfo.Username')}}：{{managerkey['access-key']}}，
                              {{$t('orderinfo.Password')}}：{{managerkey['secret-key']}}<br/>
                              <!-- 访问地址：{{managerkey['address']}}<br/> -->


                            </Col>
                            <Col span="8" class-name="title-wrapper">
                              <Button @click="editS3user" icon="md-person" type="default" > {{$t('marketpage.edits3userinfo')}} </Button>
                            </Col>
                          </Row>
                          <Row class-name="card-item">
                            <Col span="24" >
                              <span style="cursor: pointer;" @click="opencmd"  class="title">{{$t('marketpage.Openfailure')}}？<Icon v-if="cmdstate==true" type="ios-arrow-dropdown-circle" /> <Icon v-if="cmdstate==false" type="ios-arrow-dropup-circle" /></span>
                            </Col>
                            <Col v-if="cmdstate" span="24" class-name="content-wrapper">
                            {{$t('marketpage.Openfailuretip')}}<Button
              v-clipboard:copy="storagecommandline"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="primary"
              shape="circle"
              icon="ios-copy"
            ></Button><br/>

                            <Input readonly v-model="storagecommandline" type="textarea" :rows="4" />

                            </Col>
                          </Row>
      </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      managerkey: {}
    };
  }
};
</script>

<style lang="less" scoped>
.customer-container {
  .container {
    margin-top: 40px;
  }
  .tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 10px;
  }
}
.card-item {
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .item-value {
        font-size: 14px;
      }
}
</style>
