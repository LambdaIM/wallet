<template>
    <div>
        <Modal
            loading
            v-model="sendModal"
            :title="$t('sellpageinfo.Cancelsalesorder')"
            :styles="{ top: '200px' }"
            @on-cancel="sendcancel"
        >
            <Form v-if="sellorderinfo != null" @keydown.native.enter.prevent="preSendLAMB">
                <p>{{ $t('syncorderpage.orderID') }}：{{ sellorderinfo.orderId }}</p>
                <br />
                <p>{{ $t('marketpage.myselltable.Marketaddress') }}：{{ marketName }}</p>
                <br />
                <p>
                    {{ $t('marketpage.Status') }}：
                    <span style="color:green" v-if="sellorderinfo.status == '0'">
                        {{ $t('marketpage.Active') }}
                    </span>
                    <span style="color:red" v-if="sellorderinfo.status == '1'">
                        {{ $t('marketpage.Finish') }}
                    </span>
                </p>

                <br />
                <p>{{ $t('marketpage.myselltable.unitprice') }}：{{ sellorderinfo.price | Lambformat }}</p>
                <br />
                <p>{{ $t('marketpage.myselltable.amountspace') }}：{{ sellorderinfo.sellSize }}GB</p>
                <br />
                <p>{{ $t('marketpage.myselltable.remainingspace') }}：{{ sellorderinfo.unusedSize }}GB</p>
            </Form>
            <div slot="footer">
                <Button :goback="goback" type="primary" @click="preSendLAMB">{{ $t('home.Modal1.Submit') }}</Button>
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
            Tovalue: '',
            LAMBvalue: '',
            gaseFee: 0,
            voteType: 'Yes',
            title: '',
            sellorderinfo: null,
            marketName: '',
        };
    },
    components: {
        ConfirmModal,
    },
    methods: {
        open(data, marketName) {
            //   this.$data.Tovalue = toaddress;
            //   this.$data.title = title;
            console.log('data', data);
            this.$data.sellorderinfo = data;
            this.$data.marketName = marketName;

            this.sendModal = true;
        },
        sendcancel() {
            this.sendModal = false;
        },
        preSendLAMB() {
            console.log('-----');
            let from = this.address;
            let to = this.Tovalue;
            let value = this.toBigNumStr(this.LAMBvalue);

            var orderid = this.$data.sellorderinfo.orderId;

            this.transfer(orderid);
        },
        async transfer(OrderId) {
            this.$data.transactiondata = null;

            try {
                let res = await ipc.callMain('CancelSellOrder', {
                    OrderId,
                });
                // console.log(res);
                if (res.state) {
                    this.sendcancel();
                    this.$refs.ConfirmModal.open('CancelSellOrder', res.data);

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
