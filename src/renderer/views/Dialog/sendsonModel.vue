<template>
    <div>
        <Modal loading v-model="sendModal" :title="denomtitleShow" :styles="{ top: '200px' }" @on-cancel="sendcancel">
            <Form @keydown.native.enter.prevent="preSendLAMB">
                <p>
                    <Input class="address" v-model="Tovalue" readonly>
                        <span slot="prepend">{{ $t('home.Modal1.From') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input class="address" v-model="address" :placeholder="$t('home.Modal1.LAMB_address')">
                        <span slot="prepend">{{ $t('home.Modal1.To') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input v-model="LAMBvalue">
                        <span slot="prepend">{{ $t('home.Modal1.Amount') }}</span>
                        <span slot="append">{{ denomShow }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Button @click="openmemo" v-if="editmemo == false" type="dashed">
                        {{ $t('Dialog.com.EditMemo') }}
                    </Button>
                    <Input
                        v-else
                        v-model="memo"
                        type="textarea"
                        :rows="4"
                        placeholder="Enter something..."
                        :maxlength="memoNum"
                    />
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
import isaddress from '../../../utils/isaddress';

import ConfirmModal from './confirmModal.vue';

const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    props: {},
    data() {
        return {
            sendModal: false,
            confirmModal: false,
            denom: 'lamb',
            LAMBvalue: '',
            to: '',
            Tovalue: '',
            denomBlance: '',
            gaseFee: 0,
            editmemo: false,
            memo: '',
            memoNum: 255,
        };
    },
    components: {
        ConfirmModal,
    },
    methods: {
        openmemo() {
            this.$data.editmemo = true;
        },
        preSendLAMB() {
            console.log('preSendLAMB');
            let from = this.trim(this.Tovalue);
            let to = this.address;

            let value = this.toBigNumStr(this.LAMBvalue);
            if (to == from) {
                this.$Notice.warning({
                    title: this.$t('home.action.not_transfer_LAMB_to_yourself'),
                });
                return;
            }
            // if (this.bigLess0OrGreater(value, this.$data.denomBlance)) {
            //     // need to alert
            //     this.$Notice.warning({
            //         title: this.$t('home.action.check_balance_amount_transfer'),
            //     });
            //     return;
            // }
            // value = wUtils.numberToBig(value) ;
            // 还需要新的校验地址方法
            if (isaddress(to) == false) {
                // need to alert
                this.$Notice.warning({
                    title: this.$t('home.action.Check_forwarding_address'),
                });

                return;
            }

            if (isNaN(value)) {
                this.$Notice.warning({
                    title: this.$t('home.action.Check_the_amount'),
                });
                return;
            }
            this.LAMBvalue = parseFloat(this.LAMBvalue).toFixed(6);
            this.transfer(value);
        },
        async transfer(amount) {
            let to = this.trim(this.address);
            let from = this.trim(this.Tovalue);
            // let amount = this.LAMBvalue;
            let gas = 1;
            // amount = amount * 10000;
            let denom = this.$data.denom;
            let memo = this.$data.memo;
            this.$data.transactiondata = null;
            try {
                let res = await ipc.callMain('sontransfer', {
                    to,
                    amount,
                    gas,
                    denom,
                    memo,
                    from,
                });
                // console.log(res);
                if (res.state) {
                    this.sendcancel();
                    this.$refs.ConfirmModal.open('sonsend', res.data);
                }
            } catch (ex) {
                this.$Notice.warning({
                    title: 'error',
                    desc: ex.errormsg,
                });
                console.log(ex);
            }
        },
        sendcancel() {
            this.sendModal = false;
            // this.confirmModal=true;
        },
        open(amountBlance, coinType, Tovalue) {
            this.$data.denomBlance = amountBlance || this.balance;
            this.$data.denom = coinType || 'ulamb';
            this.sendModal = true;
            this.confirmModal = false;
            this.editmemo = false;
            this.$data.LAMBvalue = '';
            this.$data.Tovalue = Tovalue || '';
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
        denomShow: function() {
            return this.$data.denom.substr(1).toUpperCase();
        },
        denomtitleShow: function() {
            return this.$t('home.Modal1.Send_LAMB', [this.$data.denom.substr(1).toUpperCase()]);
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

.address {
    font-family: Consolas, Monaco, monospace;
}
</style>
