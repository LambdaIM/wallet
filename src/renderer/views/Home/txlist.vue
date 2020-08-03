<template>
    <div class="customer-container">
        <div class="tableContainer">
            <TxTable :txData="data" :loading="loading" />
        </div>
    </div>
</template>
<script>
import TxTable from '@/components/txTable/index.vue';
import txFormat from '@/common/js/txFormat.js';
import eventhub from '../../common/js/event.js';

const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    data() {
        return {
            data: [],
            pageNumber: 1,
            loading: true,
        };
    },
    mounted() {
        this.transactionList();

        this.$data.Interval = setInterval(() => {
            this.transactionList();
        }, 1000 * 15);

        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.transactionList();
        });
    },
    beforeDestroy() {
        clearInterval(this.$data.Interval);
    },
    components: {
        TxTable,
    },
    methods: {
        async transactionList(pagenum) {
            console.log('transactionList');

            // this.$data.loading=false;
            try {
                // txType: txPledgeNew
                let param = {
                    pageNum: this.$data.pageNumber,
                    showNum: 10,
                };
                // if (this.txType != null || this.txType != '') {
                //   param.txType = this.txType;
                // }

                let res = await ipc.callMain('transactionList', param);
                // console.log(res);
                if (!res.state) return;
                let tempData = res.data.data;
                this.$data.data = null;
                this.data = [];

                if (tempData) {
                    console.log(tempData);
                    tempData.forEach(item => {
                        if (item.error == undefined) {
                            try {
                                this.data.push(txFormat(item, this));
                            } catch (error) {
                                console.log('解析交易失败');
                            }
                        } else {
                            console.log('读取交易记录失败');
                            this.$Notice.warning({
                                title: 'error',
                                desc: item.error,
                            });
                        }
                    });
                }
                this.data.sort((item1, item2) => {
                    return item2.timestampSort - item1.timestampSort;
                });
                this.$data.loading = false;
            } catch (ex) {
                console.log(ex);
                this.data = [];
                this.$data.loading = false;
            }
        },
    },
};
</script>
<style lang="less" scoped>
.customer-container {
    padding-bottom: 100px;
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
