<template>
  <div class="customer-container">

      <div class="tableContainer">

          <Tabs value="name3">
            <TabPane  :label="$t('marketpage.orderlist')" name="name3">
                  <div>{{$t('marketpage.last100data')}} </div>
                  <br/>
                    <Table v-if="UserOrderslist" :columns="UserOrderscolumns" :data="UserOrderslist">
                      <template slot-scope="{ row, index }" slot="action">
                        <Button  @click="orderinfo(row)"  type="primary" size="small"> {{$t('marketpage.ordertable.orderdetails')}} </Button>
                      </template>
                        <template slot-scope="{ row, index }" slot="price">
                         {{row.MatchOrder.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="userPay">

                         {{amountFormat(row.MatchOrder.userPay)}}

                        </template>
                        <template slot-scope="{ row, index }" slot="buyAddress">
                         {{typeFormat(row.MatchOrder.buyAddress)}}
                        </template>
                        <template  slot-scope="{ row, index }" slot="minerPay">
                         <span v-if="typeBuyType(row.MatchOrder.buyAddress)">
                         {{amountFormat(row.MatchOrder.minerPay)}}
                         </span>
                         <span v-else>--</span>

                        </template>
                        <template slot-scope="{ row, index }" slot="createTime">
                         {{row.MatchOrder.createTime|formatDate}}
                        </template>
                        <template slot-scope="{ row, index }" slot="endTime">
                         {{row.MatchOrder.endTime|formatDate}}
                        </template>
                        <template slot-scope="{ row, index }" slot="size">
                         {{row.MatchOrder.size}}
                        </template>
                        <template slot-scope="{ row, index }" slot="orderId">
                         {{row.MatchOrder.orderId}}
                        </template>
                        <template slot-scope="{ row, index }" slot="status">
                         <span style="color:green" v-if="row.MatchOrder.status=='0'">
                           {{$t('marketpage.Active')}}
                        </span>
                        <span style="color:red" v-if="row.MatchOrder.status=='2'">
                           {{$t('marketpage.Expired')}}
                        </span>

                        </template>



                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page @on-change="UserOrdersListPage" :total="100" show-elevator />
                    </div>
                    <br/><br/><br/><br/>
                </TabPane>
                <TabPane :label="$t('marketpage.buyingspace')" name="name1">
          <Row>
        <Col span="22"><h3>{{$t('marketpage.autotitle')}}</h3></Col>


    </Row>
                  <div style="text-align: center;">
          <Dropdown @on-click="selectmarketClick">
        <a href="javascript:void(0)">
            {{selectmarket.name}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu  v-if="marketList" slot="list">
            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList" >{{item.name}}</DropdownItem>


        </DropdownMenu>
    </Dropdown>&nbsp;


      {{$t('marketpage.space')}} <Input v-model="autoSpaceSize"  style="width: auto" />GB&nbsp;
      {{$t('marketpage.duration')}}<Input v-model="autoSpaceDuration"  style="width: auto" />{{$t('marketpage.month')}}&nbsp;
         <Button @click="openautoBuyingspace" type="primary">{{$t('marketpage.One-click-space')}}</Button>

    </div>
    <br/>

        <div style="text-align: center;"> {{$t('marketpage.Pending-order-fee')}}：{{selectmarket.feeRate|Percentformat}}
          {{$t('marketpage.Single-fee')}}：{{selectmarket.commissionRate|Percentformat}} ，
          {{$t('marketpage.unitprice')}}：{{marketinfo.order_normal_price|Lambformat}}，
          {{$t('marketpage.Minimumtime')}}： {{marketinfo.order_min_buy_duration|formatMonth}}{{$t('marketpage.month')}}
          {{$t('marketpage.Maximumtime')}}：{{marketinfo.order_max_buy_duration|formatMonth}}{{$t('marketpage.month')}}，
          {{$t('marketpage.Minimumspace')}}：{{marketinfo.order_min_buy_size}}GB  </div>


     <Divider />

        <Row>
        <Col span="8"><h3>{{$t('marketpage.Optionaltitle')}}  </h3></Col>
        <Col span="16" style="text-align: right;">
           <syncbar :marketName="selectmarket.name"/>
        </Col>
      </Row>
     <br/>
     <div>{{$t('marketpage.last100data')}}</div>
     <br/>
                    <Table @on-sort-change="OrderListSort" v-if="OrderList"  :columns="OrderListcolumns" :data="OrderList">
                        <template slot-scope="{ row, index }" slot="action">
                         <Button v-if="row.status=='0'"  @click="openBuyingspace(row)"  type="primary" size="small"> {{$t('marketpage.selltable.Purchasespace')}} </Button>
                        </template>
                        <template slot-scope="{ row, index }" slot="price">
                         {{row.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="minDuration">
                         {{row.minDuration|formatMonth}}
                        </template>
                        <template slot-scope="{ row, index }" slot="rate">
                         {{parseInt(row.rate)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="status">
                         <span style="color:green" v-if="row.status=='0'">
                           {{$t('marketpage.Active')}}
                        </span>
                        <span style="color:red" v-if="row.status=='1'">
                           {{$t('marketpage.Finish')}}
                        </span>

                        </template>



                    </Table>
                    <br/>
                    <div style="text-align: center;">
                     <Page  @on-change="orderListPage" :total="100" show-elevator />
                    </div>
                    <br/><br/><br/>
                </TabPane>
                <!-- <TabPane label="出售" name="name1">
                    <Table :columns="columns1" :data="data1"></Table>
                </TabPane> -->
                <TabPane :label="$t('marketpage.sellspace')" name="name4">
                  <Row>
        <Col span="20">&nbsp;</Col>
        <Col span="4">
        <Button @click="openSellingspace" type="primary"  size="small">{{$t('marketpage.sellspacebtn')}}</Button>
        </Col>
      </Row>
                <div>{{$t('marketpage.last100data')}} </div>
                <br/>
                 <Table v-if="SellOrderslist" :columns="SellOrdercolumns" :data="SellOrderslist">
                   <template slot-scope="{ row, index }" slot="price">
                         {{row.price|Lambformat}}
                        </template>
                        <template slot-scope="{ row, index }" slot="minDuration">
                         {{row.minDuration|formatMonth}}
                        </template>
                        <template slot-scope="{ row, index }" slot="rate">
                         {{parseInt(row.rate)}}
                        </template>
                        <template slot-scope="{ row, index }" slot="status">
                         <span style="color:green" v-if="row.status=='0'">
                           {{$t('marketpage.Active')}}
                        </span>
                        <span style="color:red" v-if="row.status=='1'">
                           {{$t('marketpage.Finish')}}
                        </span>

                        </template>
                 </Table>
                 <br/>
                    <div style="text-align: center;">
                     <Page  @on-change="SellOrderListPage"  :total="100" show-elevator />
                    </div>
                 </TabPane>
                 <TabPane v-if="runstorage==1" label="Lambda  S3" name="name5">
                   <br/><br/>
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

                 </TabPane>


            </Tabs>
            <Modal

        v-model="passwordModal"
        :title="$t('Sign.Enter_password')"
        :styles="{top: '200px'}"
      >
        <p>
          <Input v-model="walletPassword" type="password"></Input>
        </p>
        <div slot="footer">
          <Button :loading="loading"  type="primary" @click="s3authorization">{{$t('Sign.submit')}}</Button>
        </div>
      </Modal>
    <Modal
        v-model="editpassword"
        :title="$t('marketpage.edits3userinfotitle')"
        footer-hide
        >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" >
        <FormItem prop="user">
            <Input type="text" v-model="formInline.user" :placeholder="$t('orderinfo.Username')">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="text" v-model="formInline.password" :placeholder="$t('orderinfo.Password')">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="port">
            <Input type="text" v-model.number="formInline.port" :placeholder="$t('orderinfo.Portnumber')" >
                <Icon type="ios-disc" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')">{{$t('seting.Submit')}}</Button>
        </FormItem>
    </Form>
    </Modal>



      </div>
      <BuyingspaceModal ref="Buyingspace" />
      <SellingspaceModal ref="Sellingspace" />
      <autoBuyingspaceModal ref="autoBuyingspace" />


  </div>
</template>

<script>
import MyTable from '@/components/common/useful/Mytable.vue';
import Mycard from '@/components/common/useful/Mycard.vue';
import BuyingspaceModal from '@/views/Dialog/BuyingspaceModal.vue';
import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';
import autoBuyingspaceModal from '@/views/Dialog/autoBuyingspaceModal.vue';
import eventhub from '../../common/js/event.js';
import syncbar from './syncbar.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');
var packagejson = require('../../../../package.json');


export default {
  data() {
    return {
      autoprice: 1,
      marketList: [],
      marketExplain: '',
      selectmarket: '',
      marketinfo: '',
      autoSpaceSize: '',
      autoSpaceDuration: '',
      OrderList: [],
      OrderListcolumns: [{
        title: this.$t('marketpage.selltable.Mineraddress'),
        key: 'address'
      },
      {
        title: this.$t('marketpage.selltable.amountspace'),
        key: 'sellSize',
        sortable: 'custom'
      },
      {
        title: this.$t('marketpage.selltable.remainingspace'),
        key: 'unUseSize',
        sortable: 'custom'
      },
      {
        title: this.$t('marketpage.selltable.unitprice'),
        key: 'price',
        slot: 'price',
        sortable: 'custom'
      },
      {
        title: this.$t('marketpage.selltable.minimumspace'),
        key: 'minBuySize'
      },
      {
        title: this.$t('marketpage.selltable.minimumduration'),
        key: 'minDuration',
        slot: 'minDuration'
      },
      {
        title: this.$t('marketpage.selltable.operating'),
        key: 'action',
        slot: 'action'
      }, {
        title: this.$t('marketpage.selltable.Odds'),
        key: 'rate',
        slot: 'rate',
        sortable: 'custom'
      }, {
        title: this.$t('marketpage.Status'),
        key: 'status',
        slot: 'status'

      }
      ],

      SellOrdercolumns: [
        {
          title: this.$t('marketpage.myselltable.amountspace'),
          key: 'sellSize'
        },
        {
          title: this.$t('marketpage.myselltable.remainingspace'),
          key: 'unUseSize'
        },
        {
          title: this.$t('marketpage.myselltable.unitprice'),
          key: 'price',
          slot: 'price'

        },
        {
          title: this.$t('marketpage.myselltable.minimumspace'),
          key: 'minBuySize'
        },
        {
          title: this.$t('marketpage.myselltable.minimumduration'),
          key: 'minDuration',
          slot: 'minDuration'
        },
        {
          title: this.$t('marketpage.myselltable.Odds'),
          key: 'rate',
          slot: 'rate'
        }, {
          title: this.$t('marketpage.myselltable.Storagedevice'),
          key: 'machineName'
        }, {
          title: this.$t('marketpage.myselltable.Marketaddress'),
          key: 'marketAddress'
        }, {
          title: this.$t('marketpage.Status'),
          key: 'status',
          slot: 'status'

        }
      ],
      SellOrderslist: [],
      UserOrderscolumns: [{
        title: this.$t('marketpage.ordertable.orderType'),
        key: 'MatchOrder.buyAddress',
        slot: 'buyAddress'
      },
      {
        title: this.$t('marketpage.ordertable.orderid'),
        key: 'MatchOrder.orderId',
        slot: 'orderId'
      },

      {
        title: this.$t('marketpage.ordertable.amountspace'),
        key: 'MatchOrder.size',
        slot: 'size'
      },
      {
        title: this.$t('marketpage.ordertable.unitprice'),
        key: 'MatchOrder.price',
        slot: 'price'
      },

      {
        title: this.$t('marketpage.ordertable.Startingtime'),
        key: 'MatchOrder.createTime',
        slot: 'createTime'
      },
      {
        title: this.$t('marketpage.ordertable.EndTime'),
        key: 'MatchOrder.endTime',
        slot: 'endTime'
      },
      {
        title: this.$t('marketpage.ordertable.userPay'),
        key: 'MatchOrder.userPay',
        slot: 'userPay'
      },
      {
        title: this.$t('marketpage.ordertable.minerPay'),
        key: 'MatchOrder.minerPay',
        slot: 'minerPay'
      },
      {
        title: this.$t('marketpage.ordertable.orderdetails'),
        key: 'action',
        slot: 'action'
      }, {
        title: this.$t('marketpage.Status'),
        key: 'status',
        slot: 'status'

      }
      ],
      UserOrderslist: [],
      walletPassword: '',
      managerkey: {},
      passwordModal: false,
      runstorage: packagejson.runstorage,
      loading: false,
      timeid: '',
      editpassword: false,
      formInline: {
        user: '',
        password: '',
        port: ''
      },
      ruleInline: {
        user: [
          { required: true, message: this.$t('marketpage.action.fillaccesskey'), trigger: 'blur' },
          { type: 'string', min: 3, message: this.$t('marketpage.action.accesskeytip'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('marketpage.action.fillsecretkey'), trigger: 'blur' },
          { type: 'string', min: 8, message: this.$t('marketpage.action.secretkeytip'), trigger: 'blur' }
        ],
        port: [

          { type: 'integer', message: this.$t('marketpage.action.portip'), trigger: 'blur' }
        ]
      },
      storagecommandline: '',
      cmdstate: false,
      orderSortinfo: {},
      islocal: false,
      islocalfilter: {}



    };
  },
  components: {
    MyTable,
    Mycard,
    BuyingspaceModal,
    SellingspaceModal,
    autoBuyingspaceModal,
    syncbar
  },
  mounted() {
    this.getmarketlist();
    this.getSellOrderslist();
    this.getUserOrderslist();
    this.getmanagerkey();
    this.getlambdastoragecommandline();


    eventhub.$on('TransactionSuccess', data => {
      console.log('TransactionSuccess');
      this.getSellOrderslist();
      this.getUserOrderslist();
      this.getOrderList();
      this.getlambdastoragecommandline();
    });

    // marketsellordersync

    eventhub.$on('marketsellordersync', data => {
      console.log('marketsellordersync');
      this.$data.islocal = data;
      this.getOrderList(1);
    });

    eventhub.$on('marketconditionfilter', data => {
      console.log('marketconditionfilter');
      this.$data.islocalfilter = data;
      this.getOrderList(1);
    });


    // marketconditionfilter



    this.getmarketinfo('');
  },
  methods: {
    OrderListSort(columninfo) {
      console.log(columninfo);
      var key = columninfo.key;
      var order = columninfo.order;
      this.$data.orderSortinfo = {
        key,
        order
      };

      this.getOrderList(1);
    },
    opencmd() {
      this.$data.cmdstate = !this.$data.cmdstate;
    },
    onCopy: function(e) {
      this.$Message.info(this.$t('head.action.You_just_copied') + e.text);
    },
    onError: function(e) {
      this.$Message.info(this.$t('head.action.Failed_to_copy_texts'));
    },
    editS3user() {
      this.$data.editpassword = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          // editlambdastoragemanagerkey
          try {
            var result = await ipc.callMain('editlambdastoragemanagerkey', {
              accesskey: this.$data.formInline.user,
              secretkey: this.$data.formInline.password,
              port: this.$data.formInline.port
            });

            console.log(result.state);

            if (result.state) {
              this.$Message.success(this.$t('seting.action.Modified_success'));
              this.$data.editpassword = false;
              this.getmanagerkey();
            } else {
              this.$Message.error(this.$t('seting.action.Modification_failed'));
            }
          } catch (error) {
            console.log(error);
            // this.$Message.error(this.$t('seting.action.Modification_failed'));
            this.$Notice.error({
              title: this.$t('seting.action.Modification_failed'),
              desc: error.errormsg
            });
          }
        } else {
          this.$Message.error(this.$t('seting.action.Modification_failed'));
        }
      });
    },
    s3authorization: async function() {
      console.log('runlambdastorage');
      this.$data.loading = true;
      var result = {};
      try {
        this.$data.timeid = setTimeout(() => {
          this.$data.loading = false;
          shell.openExternal(`http://${this.$data.managerkey['address']}/minio/login`);
          this.$data.passwordModal = false;
        }, 3000);
        result = await ipc.callMain('runlambdastorage', {
          password: this.$data.walletPassword
        });
        console.log(result);
      } catch (ex) {
        console.log(ex);

        this.$data.loading = false;
        console.log(ex.errormsg.indexOf('Got a signal from the OS'));
        if (ex.errormsg.indexOf('Got a signal from the OS') == -1) {
          this.$Notice.error({
            title: 'error',
            desc: ex.errormsg
          });
          clearTimeout(this.$data.timeid);
        }
      }
    },
    async getmanagerkey() {
      let res = await ipc.callMain('lambdastoragemanagerkey', {});
      if (res.state) {
        this.$data.managerkey = res.data.gateway;
        this.$data.formInline.user = this.$data.managerkey['access-key'];
        this.$data.formInline.password = this.$data.managerkey['secret-key'];
        this.$data.formInline.port = this.$data.managerkey.address.split(':')[1] || '';
        this.$data.formInline.port = parseInt(this.$data.formInline.port);
      }
    },
    Datacollection: async function() {
      this.$data.passwordModal = true;
    },
    UserOrdersListPage(page) {
      console.log(page);
      this.getUserOrderslist(page);
    },
    SellOrderListPage(page) {
      console.log(page);
      this.getSellOrderslist(page);
    },
    orderListPage(page) {
      console.log(page);
      this.getOrderList(page);
    },
    async getmarketlist() {
      console.log('getmarketlist');
      let res = await ipc.callMain('marketlist', {});
      if (res.state) {
        this.$data.marketList = res.data.data;
        this.$data.selectmarket = this.$data.marketList[0];
        this.getOrderList();
      }
    },
    async   getmarketinfo(name) {
      let res = await ipc.callMain('marketinfo', {
        name
      });
      if (res.state) {
        this.$data.marketinfo = res.data.data;
      }
    },
    async  getOrderList(page) {
      console.log('- -');
      let res = await ipc.callMain('marketOrderList', {
        marketName: this.$data.selectmarket.name,
        orderType: 'premium', // premium all
        page: page || 1,
        limit: 10,
        marketAddress: this.$data.selectmarket.marketAddress,
        islocal: this.$data.islocal,
        orderSortinfo: this.$data.orderSortinfo,
        islocalfilter: this.$data.islocalfilter
      });
      if (res.state) {
        this.$data.OrderList = res.data.data || [];
      }
    },
    async  getSellOrderslist(page) {
      let res = await ipc.callMain('marketSellOrderslist', {
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.SellOrderslist = res.data.data || [];
      }
    },
    async getUserOrderslist(page) {
      let res = await ipc.callMain('marketUserOrderslist', {
        page: page || 1,
        limit: 10
      });
      if (res.state) {
        this.$data.UserOrderslist = res.data.data || [];
      }
    },
    openBuyingspace(row) {
      this.$refs.Buyingspace.open(row, this.$data.selectmarket);
    },
    openSellingspace() {
      this.$refs.Sellingspace.open(this.$data.selectmarket);
    },
    openautoBuyingspace() {
      let spaceSize = parseInt(this.$data.autoSpaceSize);
      let spaceDuration = parseInt(this.$data.autoSpaceDuration);

      if (isNaN(spaceSize) || spaceSize <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.AutoBuy.action.needspacesize')
        });
        return;
      }
      if (isNaN(spaceDuration) || spaceDuration <= 0) {
        this.$Notice.warning({
          title: this.$t('Dialog.AutoBuy.action.needstime')
        });
        return;
      }

      this.$refs.autoBuyingspace.open({
        name: this.$data.selectmarket.name,
        marketAddress: this.$data.selectmarket.marketAddress,
        unitprice: this.$data.marketinfo.order_normal_price
      }, spaceSize, spaceDuration);
    },
    async  getlambdastoragecommandline() {
      console.log('getlambdastoragecommandline');
      let res = await ipc.callMain('lambdastoragecommandline', {

      });
      if (res.state) {
        this.$data.storagecommandline = res.data;
      }
    },
    orderinfo(item) {
      this.$router.push(`/orderinfo/${item.MatchOrder.orderId}`);
    },
    selectmarketClick(name) {
      console.log(name);
      var _this = this;
      this.$data.marketList.forEach(item => {
        if (name == item.name) {
          _this.$data.selectmarket = item;
        }
      });
      this.getmarketinfo(name);
      this.getOrderList();
    },
    amountFormat(item) {
      return this.bigNumTypeFormat(item.amount, item.denom);
    },
    typeFormat(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return this.$t('marketpage.payorder');
      } else {
        return this.$t('marketpage.sellorder');
      }
    },
    typeBuyType(addeess) {
      if (this.$store.getters.getaddress === addeess) {
        return false;
      } else {
        return true;
      }
    }

  },
  computed: {
    address: function() {
      return this.$store.getters.getaddress;
    }

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
    margin-top: 40px;
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
