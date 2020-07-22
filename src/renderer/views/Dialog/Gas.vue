<template>
    <div>
        <Input ref="gasinput_" autofocus @on-change="changegase" v-model="gaseFee">
            <span slot="prepend">{{ $t('Dialog.com.gasfee') }}</span>
            <span slot="append">LAMB</span>
        </Input>
    </div>
</template>
<script>
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            gaseFee: '',
        };
    },
    mounted() {
        eventhub.$on('GetGase', transactiondata => {
            console.log('GetGase');
            this.getgase(transactiondata);
        });
    },
    methods: {
        async getgase(transactiondata) {
            try {
                let res = await ipc.callMain('Simulate', { transactiondata: transactiondata });
                if (res.state) {
                    this.$data.gaseFee = res.data;
                    eventhub.$emit('gaseValue', res.data);
                }
            } catch (ex) {
                this.$Notice.warning({
                    title: 'error',
                    desc: ex.errormsg,
                });
                console.log(ex);
            }
        },
        changegase(data) {
            console.log(data);

            eventhub.$emit('gaseValue', this.$data.gaseFee);
        },
        focus() {
            console.log('focus');
            var _this = this;
            setTimeout(() => {
                _this.$refs.gasinput_.focus();
            }, 100);
        },
    },
};
</script>
<style lang="sass" scoped></style>
