<template>
    <div>
        <Modal
            loading
            v-model="sendModal"
            :title="$t('Pledgepopup.title')"
            :styles="{ top: '200px' }"
            @on-cancel="sendcancel"
        >
            <Form @keydown.native.enter.prevent="preSendLAMB">
                <p>
                    <Input :value="AssetName | assertdenomformat" readonly>
                        <span slot="prepend">{{ $t('Authorizedminingpop.AssetName') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <a @click="openLinkmarket(AssetName)">{{ $t('Pledgepopup.tip') }}</a>
                </p>
                <br />
                <p>
                    <Input v-model="mineraddress">
                        <span slot="prepend">{{ $t('Pledgepopup.Mineroperatingaddress') }}</span>
                    </Input>
                </p>
                <br />

                <p>
                    <Input v-model="amount">
                        <span slot="prepend">{{ $t('Pledgepopup.amount') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <RadioGroup v-model="delegateType">
                        <Radio label="delegate">{{ $t('Pledgepopup.pledge') }}</Radio>
                        <Radio label="undelegate">{{ $t('Pledgepopup.redeem') }}</Radio>
                    </RadioGroup>
                </p>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="preSendLAMB">{{ $t('home.Modal1.Submit') }}</Button>
            </div>
        </Modal>

        <ConfirmModal :goback="goback" ref="ConfirmModal" />
    </div>
</template>

<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
import { DAEMON_CONFIG } from '../../../config.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { shell } = require('electron');

export default {
    data() {
        return {
            sendModal: false,
            confirmModal: false,
            name: '',
            asset: '',
            AssetName: '',
            Pubkey: '',
            priceinfo: '',
            size: '',
            Duration: '',
            timeunit: 1000 * 1000 * 1000 * 60 * 60 * 24 * 30,
            mineraddress: '',
            price: '',
            delegateType: 'delegate',
            amount: '',
        };
    },
    components: {
        ConfirmModal,
    },
    methods: {
        open(data) {
            console.log('data', data);
            this.$data.AssetName = data.assetName;
            this.sendModal = true;
        },
        sendcancel() {
            this.sendModal = false;
        },
        preSendLAMB() {
            console.log('-----');
            var AssetName = this.$data.AssetName;

            var amount = parseInt(this.$data.amount);
            var delegateType = this.$data.delegateType;
            if (this.$data.mineraddress.length !== 54) {
                this.$Notice.warning({
                    title: this.$t('Purchasespace.action.need_miner_address'),
                });
                return;
            }

            if (isNaN(amount) || amount <= 0) {
                this.$Notice.warning({
                    title: '请输入金额',
                });
                return;
            }

            if (delegateType == '') {
                this.$Notice.warning({
                    title: '请选择质押、或取消质押',
                });
                return;
            }

            this.transfer(AssetName, this.$data.mineraddress, amount, delegateType);
        },
        openLinkmarket(name) {
            var explorer = DAEMON_CONFIG.explore();
            let url = `${explorer}#/assetMarket/${name}`;
            shell.openExternal(url);
        },
        async transfer(AssetName, address, amount, delegateType) {
            this.$data.transactiondata = null;

            // Size = String(Size);

            try {
                let res = await ipc.callMain('assertUserdelegate', {
                    AssetName,
                    address,
                    amount: this.toBigNumStr(amount),
                    delegateType,
                });
                // console.log(res);

                if (res.state) {
                    this.sendcancel();
                    this.$refs.ConfirmModal.open('assertUserdelegate', res.data, {
                        totalAmount: this.payamount,
                        denom: this.$data.AssetName,
                    });

                    // let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
                    // if (gasres.state) {
                    //   this.$data.gaseFee = gasres.data;
                    //   this.$data.transactiondata = res.data;
                    //   this.sendcancel();
                    //   this.confirmModal = true;
                    // }
                }
            } catch (ex) {
                this.$Notice.warning({
                    title: 'error',
                    desc: ex.errormsg,
                });
                console.log(ex);
            }
        },
        goback() {
            console.log('goback');
            this.sendModal = true;
            this.$refs.ConfirmModal.clase();
        },
    },
    computed: {
        address: function() {
            return this.$store.getters.getaddress;
        },
        balance: function() {
            return this.$store.getters.getblance;
        },
        balanceLamb: function() {
            return this.$store.getters.getblance;
        },
        isdegeTxt: function() {
            return this.$t('proposalsPage.Vote');
        },
        payamount: function() {
            var size = parseInt(this.$data.size);
            var Duration = parseInt(this.$data.Duration);
            var price = this.$data.price;

            var result = price * size * Duration;
            if (isNaN(result)) {
                return 0;
            } else {
                return result;
            }
        },
    },
    watch: {
        priceinfo: function(data) {
            if (data == '') {
                return;
            }
            try {
                var priceinfo = JSON.parse(data);
                // { "address": "lambdamineroper1g74gwkeq2py5zypv4l223p2s82gqlc28rsp826","price": 1000000 }
                this.$data.mineraddress = priceinfo.address;
                this.$data.price = priceinfo.price;
            } catch (error) {}
        },
    },
};
</script>

<style lang="less" scoped>
.modal-header {
    .item {
        margin-top: 20px;
        font-size: 14px;
    }
}
</style>
