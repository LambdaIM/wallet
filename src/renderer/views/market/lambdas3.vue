<template>
    <div class="customer-container">
        <div class="tableContainer">
            <!-- <Row class-name="card-item">
        <Col span="4" class-name="title-wrapper">
          <span class="title">{{ $t('orderinfo.operating') }}:</span>
        </Col>
        <Col span="20" class-name="content-wrapper">
          <Button @click="Datacollection" type="primary">{{ $t('orderinfo.Viewlambdastorage') }}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Col>
      </Row> -->
            <Row class-name="card-item mt20">
                <Col span="8" class-name="title-wrapper">
                    <span class="title">{{ $t('orderinfo.lambdastorageConsole') }}:</span>
                </Col>
                <Col span="8" class-name="content-wrapper">
                    {{ $t('orderinfo.Username') }}：{{ managerkey['access-key'] }}， {{ $t('orderinfo.Password') }}：{{
                        managerkey['secret-key']
                    }}
                    <br />
                    <!-- 访问地址：{{managerkey['address']}}<br/> -->
                </Col>
                <Col span="8" class-name="title-wrapper">
                    <Button @click="editS3user" icon="md-person" type="default">
                        {{ $t('marketpage.edits3userinfo') }}
                    </Button>
                </Col>
            </Row>
            <div>lambda S3 {{ $t('orderinfo.Version') }}： {{ S3Version }}</div>

            <!-- <Row class-name="card-item">
        <Col span="24">
          <span style="cursor: pointer;" @click="opencmd" class="title">
            {{ $t('marketpage.Openfailure') }}？
            <Icon v-if="cmdstate == true" type="ios-arrow-dropdown-circle" />
            <Icon v-if="cmdstate == false" type="ios-arrow-dropup-circle" />
          </span>
        </Col>
        <Col v-if="cmdstate" span="24" class-name="content-wrapper">
          {{ $t('marketpage.Openfailuretip') }}
          <Button
            v-clipboard:copy="storagecommandline"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="primary"
            shape="circle"
            icon="ios-copy"
          ></Button>
          <br />

          <Input readonly v-model="storagecommandline" type="textarea" :rows="4" />
        </Col>
      </Row> -->
        </div>
        <!-- <Modal v-model="passwordModal" :title="$t('Sign.Enter_password')" :styles="{ top: '200px' }">
      <p>
        <Input v-model="walletPassword" type="password"></Input>
      </p>
      <div slot="footer">
        <Button :loading="loading" type="primary" @click="s3authorization">{{ $t('Sign.submit') }}</Button>
      </div>
    </Modal> -->

        <Modal v-model="editpassword" :title="$t('marketpage.edits3userinfotitle')" footer-hide>
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
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
                    <Input type="text" v-model.number="formInline.port" :placeholder="$t('orderinfo.Portnumber')">
                        <Icon type="ios-disc" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formInline')">{{ $t('seting.Submit') }}</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');

export default {
    data() {
        return {
            managerkey: {},
            formInline: {
                user: '',
                password: '',
                port: 0,
            },
            ruleInline: {
                user: [
                    { required: true, message: this.$t('marketpage.action.fillaccesskey'), trigger: 'blur' },
                    { type: 'string', min: 3, message: this.$t('marketpage.action.accesskeytip'), trigger: 'blur' },
                ],
                password: [
                    { required: true, message: this.$t('marketpage.action.fillsecretkey'), trigger: 'blur' },
                    { type: 'string', min: 8, message: this.$t('marketpage.action.secretkeytip'), trigger: 'blur' },
                ],
                port: [{ type: 'integer', message: this.$t('marketpage.action.portip'), trigger: 'blur' }],
            },
            storagecommandline: '',
            cmdstate: false,
            editpassword: false,
            passwordModal: false,
            walletPassword: '',
            loading: false,
            S3Version: '',
        };
    },
    async mounted() {
        await this.getmanagerkey();
        this.getlambdaS3Version();
        // await this.getlambdastoragecommandline();
    },
    methods: {
        async getmanagerkey() {
            let res = await ipc.callMain('lambdastoragemanagerkey', {});
            if (res.state) {
                this.$data.managerkey = res.data.gateway;
                this.$data.formInline.user = this.$data.managerkey['access-key'];
                this.$data.formInline.password = this.$data.managerkey['secret-key'];
                this.$data.formInline.port = this.$data.managerkey.address.split(':')[1] || 0;
                this.$data.formInline.port = parseInt(this.$data.formInline.port);
            }
        },
        async getlambdastoragecommandline() {
            console.log('getlambdastoragecommandline');
            let res = await ipc.callMain('lambdastoragecommandline', {});
            if (res.state) {
                this.$data.storagecommandline = res.data;
            }
        },
        Datacollection: async function() {
            this.$data.passwordModal = true;
        },
        editS3user() {
            this.$data.editpassword = true;
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
                    password: this.$data.walletPassword,
                });
                console.log(result);
            } catch (ex) {
                console.log(ex);

                this.$data.loading = false;
                console.log(ex.errormsg.indexOf('Got a signal from the OS'));
                if (ex.errormsg.indexOf('Got a signal from the OS') == -1) {
                    this.$Notice.error({
                        title: 'error',
                        desc: ex.errormsg,
                    });
                    clearTimeout(this.$data.timeid);
                }
            }
        },
        handleSubmit(name) {
            this.$refs[name].validate(async valid => {
                if (valid) {
                    // editlambdastoragemanagerkey
                    try {
                        var result = await ipc.callMain('editlambdastoragemanagerkey', {
                            accesskey: this.$data.formInline.user,
                            secretkey: this.$data.formInline.password,
                            port: this.$data.formInline.port,
                        });

                        console.log(result.state);

                        if (result.state) {
                            this.$Message.success(this.$t('seting.action.Modified_success'));
                            this.$data.editpassword = false;
                            this.getmanagerkey();
                            this.getlambdastoragecommandline();
                        } else {
                            this.$Message.error(this.$t('seting.action.Modification_failed'));
                        }
                    } catch (error) {
                        console.log(error);
                        // this.$Message.error(this.$t('seting.action.Modification_failed'));
                        this.$Notice.error({
                            title: this.$t('seting.action.Modification_failed'),
                            desc: error.errormsg,
                        });
                    }
                } else {
                    this.$Message.error(this.$t('seting.action.Modification_failed'));
                }
            });
        },
        async getlambdaS3Version() {
            console.log('getlambdaS3Version');
            let res = await ipc.callMain('lambdaS3Version', {});
            if (res.state) {
                this.$data.S3Version = res.data;
                if (res.data[0] != undefined) {
                    this.$data.S3Version = res.data[0];
                }
            }
        },
    },
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
