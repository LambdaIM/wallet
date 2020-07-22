<template>
    <div>
        <Modal
            loading
            v-model="sendModal"
            :title="$t('deleaccount.title')"
            :styles="{ top: '200px' }"
            @on-cancel="sendcancel"
        >
            <Form @keydown.native.enter.prevent="preSendLAMB">
                <p>
                    <Input v-model="address" readonly>
                        <span slot="prepend">{{ $t('deleaccount.address') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input readonly v-model="name">
                        <span slot="prepend">{{ $t('deleaccount.name') }}</span>
                    </Input>
                </p>

                <br />
            </Form>
            <div slot="footer">
                <Button type="primary" @click="preSendLAMB">{{ $t('home.Modal1.Submit') }}</Button>
            </div>
        </Modal>

        <Modal
            loading
            v-model="passwordModal"
            :title="$t('deleaccount.title2')"
            :styles="{ top: '200px' }"
            @on-cancel="sendcancel"
        >
            <Form @keydown.native.enter.prevent="preSendLAMB">
                <p>
                    <Input v-model="address" readonly>
                        <span slot="prepend">{{ $t('deleaccount.address') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input readonly v-model="name">
                        <span slot="prepend">{{ $t('deleaccount.name') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <Input type="password" v-model="password">
                        <span slot="prepend">{{ $t('deleaccount.password') }}</span>
                    </Input>
                </p>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="SubmitForm">{{ $t('home.Modal1.Submit') }}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
import ConfirmModal from './confirmModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            sendModal: false,
            passwordModal: false,
            confirmModal: false,
            Tovalue: '',
            LAMBvalue: '',
            gaseFee: 0,
            voteType: 'Yes',
            title: '',
            address: '',
            name: '',
            password: '',
        };
    },
    components: {
        ConfirmModal,
    },
    methods: {
        open(item) {
            this.$data.address = item.address;
            this.$data.name = item.name;
            this.sendModal = true;
            this.password = '';
            console.log('open');
        },
        sendcancel() {
            this.sendModal = false;
            this.passwordModal = false;
        },
        preSendLAMB() {
            console.log('-----');
            this.sendModal = false;
            this.passwordModal = true;
        },
        async SubmitForm() {
            var address = this.$data.address;
            var password = this.$data.password;
            if (password == '') {
                this.$Notice.warning({
                    title: 'error',
                    desc: this.$t('login.action.Please_fill_in_the_password'),
                });
                return;
            }

            try {
                let res = await ipc.callMain('deleteaccount', {
                    address,
                    password,
                });

                if (res.state) {
                    this.sendcancel();
                    this.$Notice.success({
                        title: this.$t('deleaccount.success'),
                        desc: this.$t('deleaccount.success'),
                    });
                    eventhub.$emit('deleteaccountSuccess');
                }
            } catch (ex) {
                this.$Notice.warning({
                    title: 'error',
                    desc: ex.errormsg,
                });
                console.log(ex);
            }
        },
    },
    computed: {
        balance: function() {
            return this.$store.getters.getblance;
        },
        balanceLamb: function() {
            return this.$store.getters.getblance;
        },
        isdegeTxt: function() {
            return this.$t('proposalsPage.Vote');
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
