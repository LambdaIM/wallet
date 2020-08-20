<template>
    <div>
        <Modal
            loading
            v-model="sendModal"
            :title="$t('Authorizedminingpop.Authorization-MinerMining')"
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
                    <Input v-model="user">
                        <span slot="prepend">{{ $t('assetnewtxt.lambdaaddress') }}</span>
                    </Input>
                </p>
                <br />
                <p>
                    <RadioGroup v-model="isAllowed">
                        <Radio label="1">{{ $t('assetnewtxt.Addauthorization') }}</Radio>
                        <Radio label="2">{{ $t('assetnewtxt.Cancelauthorization') }}</Radio>
                    </RadioGroup>
                </p>

                <br />
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
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            sendModal: false,
            confirmModal: false,
            name: '',
            asset: '',
            AssetName: '',
            Pubkey: '',
            pubkeyType: '1',
            user: '',
            isAllowed: '',
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
            var user = this.$data.user;
            var isAllowed = this.$data.isAllowed;
            var jsonObj = {};

            if (user.length != 45) {
                this.$Notice.warning({
                    title: this.$t('assetnewtxt.need_lambdaaddress'),
                });
                return;
            }
            if (isAllowed == '') {
                this.$Notice.warning({
                    title: this.$t('assetnewtxt.need_category'),
                });
                return;
            }

            this.transfer(user, AssetName, isAllowed);
        },
        async transfer(user, AssetName, isAllowed) {
            this.$data.transactiondata = null;

            try {
                let res = await ipc.callMain('AuthorizeMiningPubKey', {
                    user,
                    AssetName,
                    isAllowed,
                });
                // console.log(res);
                if (res.state) {
                    this.sendcancel();
                    this.$refs.ConfirmModal.open('AuthorizeMiningPubKey', res.data);

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
