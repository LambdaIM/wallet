<template>
    <div class="container">
        <Mybg>
            <div class="login-container" slot="content">
                <div class="login-wrapper">
                    <div class="form-title">
                        <div class="title-wrapper">
                            <p class="title">{{ $t('login.LAMBDA_Wallet') }} v{{ versionNumber }}</p>
                        </div>
                    </div>
                    <!-- <p v-for="(item,index) in walletList" :key="index">
            <span>{{item.name}}</span>
            <span>{{item.address}}</span>
          </p>-->
                    <Form
                        @submit.native.prevent
                        ref="formInline"
                        :model="formInline"
                        :rules="ruleInline"
                        class="form-container"
                    >
                        <FormItem prop="name">
                            <Select
                                :placeholder="$t('login.select_Wallet')"
                                v-model="value"
                                @on-change="selectName"
                                clearable
                                size="large"
                            >
                                <Option
                                    v-for="(item, index) in walletList"
                                    :value="item.address"
                                    :key="index"
                                    :label="item.name"
                                >
                                    <div>
                                        {{ item.name }}
                                    </div>
                                    <div class="address">
                                        {{ item.address }}
                                        <span @click="opendeleteuser(item)">
                                            <Icon type="md-close-circle" />
                                        </span>
                                    </div>
                                </Option>
                            </Select>
                        </FormItem>

                        <FormItem prop="password">
                            <Input
                                type="password"
                                v-model="formInline.password"
                                :placeholder="$t('login.Password')"
                                @on-enter="openWallet('formInline')"
                            >
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </Form>

                    <div class="button-wrapper">
                        <button
                            @keyup.enter="openWallet('formInline')"
                            class="btn login-button"
                            @click="openWallet('formInline')"
                        >
                            {{ $t('login.Login') }}
                        </button>
                        <!-- <button class="btn login-button"    @click="getwalletList">Login1</button> -->
                    </div>

                    <div class="bottom-wrapper tc">
                        <router-link class="bottom-wrapper-item" to="/register">
                            {{ $t('login.Create_Wallet') }}
                        </router-link>
                        <span class="line"></span>
                        <router-link class="bottom-wrapper-item" to="/import">
                            {{ $t('login.Import_Wallet') }}
                        </router-link>
                    </div>
                </div>
            </div>
        </Mybg>
        <DeleuserModal ref="DeleuserModal" />
    </div>
</template>

<script>
// import RPC from "../../rpc.js";
import { DAEMON_CONFIG } from '../../../config.js';

import Mybg from '@/components/common/useful/Mybg.vue';
import eventHub from '@/common/js/event.js';
import DeleuserModal from '@/views/Dialog/DeleuserModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const settings = require('electron-settings');

export default {
    data() {
        return {
            formInline: {
                password: '',
            },
            index: null,
            ruleInline: {
                password: [
                    {
                        required: true,
                        message: this.$t('login.action.Please_fill_in_the_password'),
                        trigger: 'blur',
                    },
                    {
                        type: 'string',
                        min: 1,
                        message: this.$t('login.action.password_cannot_less'),
                        trigger: 'blur',
                    },
                ],
            },
            walletList: [],
            name: '',
            value: null,
            address: null,
            selectplaceholder: this.$t('login.select_Wallet'),
            versionNumber: DAEMON_CONFIG.version,
        };
    },
    components: {
        Mybg,
        DeleuserModal,
    },
    mounted() {
        // var open = settings.get("isopenfile");
        // console.log(open);
        // if (open) {
        //   this.$router.push("/home");
        // }
        this.getwalletList();

        eventHub.$on('deleteaccountSuccess', data => {
            console.log('deleteaccountSuccess');
            this.getwalletList();
        });
    },
    methods: {
        selectName(value) {
            // console.log(value);
            for (let index = 0; index < this.walletList.length; index++) {
                if (value == this.walletList[index].address) {
                    this.address = this.walletList[index].address;
                    // console.log(this.address);
                    // this.$data.selectplaceholder = value;

                    this.setDefaultWallet();
                }
            }
        },
        openWallet(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.login();
                }
            });
        },
        async login() {
            console.log('loginDefaultWallet');
            let pass = this.formInline.password;
            try {
                var res = await ipc.callMain('loginDefaultWallet', {
                    password: pass,
                });
                console.log('login default wallet', res);
                if (res.state) {
                    this.$Notice.success({
                        title: this.$t('login.action.Login_success'),
                    });
                    let login = settings.set('isopenfilev1', true);
                    console.log(login);
                    this.$store.dispatch('setLogin', true);

                    this.$store.dispatch('readrole');

                    eventHub.$emit('login');
                    this.$router.push('/home');
                }
            } catch (ex) {
                this.$Notice.error({
                    title: ex.errormsg,
                });
            }
        },
        async setDefaultWallet() {
            try {
                var res = await ipc.callMain('setDefaultWallet', {
                    address: this.address,
                });
                // this.$store.dispatch("setaddress", this.address);
                // console.log("set default success", res);
                if (!res.state) return;

                // this.login();
            } catch (ex) {
                // console.log(ex);
                console.log('密码错误');
            }
        },
        getwalletList() {
            // console.log("- -");
            ipc.callMain('walletList', {})
                .then(res => {
                    // console.log(res);
                    if (!res.state) return;
                    this.walletList = res.data;
                })
                .catch(err => {
                    console.log('err');
                    console.log(err);
                });
        },
        opendeleteuser(item) {
            console.log('opendeleteuser');
            this.$refs.DeleuserModal.open(item);
        },
    },
};
</script>

<style lang="less" scoped>
.container {
    .login-wrapper {
        position: absolute;
        width: 55%;
        height: 80%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .form-title {
            width: 100%;
            margin-top: 90px;
            .title-wrapper {
                text-align: center;
                .title {
                    color: #fff;
                    font-size: 20px;
                    margin-bottom: 30px;
                }
            }
        }
        .form-container {
            width: 80%;
            margin: 0 auto;
        }
        .button-wrapper {
            width: 80%;
            margin: 0 auto;
            margin-bottom: 20px;
            .login-button {
                width: 100%;
                background-color: #6b9ebc;
            }
        }
        .bottom-wrapper {
            .bottom-wrapper-item {
                font-size: 14px;
                color: #fff !important;
            }
            .line {
                display: inline-block;
                margin: 0 22px;
                width: 2px;
                height: 14px;
                border-left: 2px solid rgb(83, 102, 128);
            }
        }
    }
}
.address {
    font-family: Consolas, Monaco, monospace;
}
</style>
