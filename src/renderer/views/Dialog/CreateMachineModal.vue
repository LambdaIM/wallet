<template>
    <div>
        <Modal
            loading
            v-model="withdrawalModal"
            :title="$t('sellpageinfo.Createstoragenode')"
            :styles="{ top: '200px' }"
            @on-cancel="sendcancel"
        >
            <p>
                {{ $t('sellpageinfo.Createstoragenodetip') }}
            </p>
            <br />
            <p>
                <Input v-model="address" readonly>
                    <span slot="prepend">{{ $t('home.Modal1.From') }}</span>
                </Input>
            </p>
            <br />
            <p>
                <Input v-model="name" :placeholder="$t('sellpageinfo.action.needtip')">
                    <span slot="prepend">{{ $t('sellpageinfo.Storagenodename') }}</span>
                </Input>
            </p>
            <br />
            <p>
                <Input v-model="DhtId" placeholder="">
                    <span slot="prepend">DhtId</span>
                </Input>
            </p>
            <br />
            <p>
                <Input v-model="pubKey" placeholder="">
                    <span slot="prepend">pubKey</span>
                </Input>
            </p>
            <div slot="footer">
                <Button type="primary" @click="prewithdrawalLAMB">{{ $t('home.Modal1.Submit') }}</Button>
            </div>
        </Modal>
        <Modal v-model="confirmModal" :styles="{ top: '200px' }">
            <div class="modal-header" slot="header">
                <h2>{{ $t('sellpageinfo.Createstoragenode') }}</h2>
                <Row class-name="item">
                    <Col span="4" class-name="key">{{ $t('home.Modal1.From') }}:</Col>
                    <Col span="20" class-name="value">{{ address }}</Col>
                </Row>
                <Row class-name="item">
                    <Col span="4" class-name="key">{{ $t('sellpageinfo.Storagenodename') }}:</Col>
                    <Col span="20" class-name="value">{{ name }}</Col>
                </Row>
                <Row class-name="item">
                    <Col span="4" class-name="key">DhtId:</Col>
                    <Col span="20" class-name="value">{{ DhtId }}</Col>
                </Row>
                <Row class-name="item">
                    <Col span="4" class-name="key">pubKey:</Col>
                    <Col span="20" class-name="value"><Input readonly v-model="pubKey" type="textarea" /></Col>
                </Row>

                <Row class-name="item">
                    <Input v-model="gaseFee">
                        <span slot="prepend">{{ $t('Dialog.com.gasfee') }}</span>
                        <span slot="append">LAMB</span>
                    </Input>
                </Row>
            </div>
            <!-- <p>
          <Input v-model="walletPassword" type="password"></Input>
      </p>-->
            <div slot="footer">
                <Button type="primary" @click="confirm">{{ $t('home.Modal1.Confirm') }}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');
export default {
    data() {
        return {
            withdrawalModal: false,
            confirmModal: false,
            gaseFee: 0,
            name: '',
            DhtId: '',
            pubKey: '',
        };
    },
    methods: {
        open() {
            console.log('- -');
            this.$data.withdrawalModal = true;
            this.$data.confirmModal = false;
        },
        prewithdrawalLAMB() {
            console.log('- -');
            if (this.$data.name == '') {
                this.$Notice.warning({
                    title: this.$t('sellpageinfo.action.needname'),
                });
                return;
            }

            if (this.$data.DhtId == '') {
                this.$Notice.warning({
                    title: this.$t('sellpageinfo.action.needdhtid'),
                });
                return;
            }

            if (this.$data.pubKey == '') {
                this.$Notice.warning({
                    title: this.$t('sellpageinfo.action.needpubKey'),
                });
                return;
            }

            this.$data.withdrawalModal = false;
            this.transfer(
                {
                    name: this.$data.name,
                    dhtId: this.$data.DhtId,
                    pubKey: this.$data.pubKey,
                    peerId: '',
                },
                'CreateMachine'
            );
        },
        async transfer(txdata, txType) {
            this.$data.transactiondata = null;
            try {
                let res = await ipc.callMain(txType, txdata);
                // console.log(res);
                if (res.state) {
                    console.log(res.data);
                    let gasres = await ipc.callMain('Simulate', { transactiondata: res.data });
                    if (gasres.state) {
                        this.$data.gaseFee = gasres.data;
                        this.$data.transactiondata = res.data;
                        this.sendcancel();
                        this.confirmModal = true;
                    }
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
            this.withdrawalModal = false;
            // this.confirmModal=true;
        },
        confirm() {
            var comparedNum = this.bigNum(this.toBigNumStr(this.$data.gaseFee)).comparedTo(
                this.$store.getters.balanceLamb
            );
            if (comparedNum == 1 || comparedNum == null) {
                this.$Notice.warning({
                    title: 'error',
                    desc: this.$t('Dialog.com.Lesscommission'),
                });
                return;
            }
            this.confirmModal = false;
            console.log(this.$data.transactiondata);
            eventhub.$emit('TxConfirm', this.$data.transactiondata, this.toBigNumStr(this.$data.gaseFee));
        },
    },
    computed: {
        DistributionReward() {
            return this.bigNumType(this.$store.getters.getDistributionReward);
        },
        address: function() {
            return this.$store.getters.getaddress;
        },
        balance: function() {
            return this.$store.getters.getblance;
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
