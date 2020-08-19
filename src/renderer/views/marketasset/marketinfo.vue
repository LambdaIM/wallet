<template>
    <div>
        <div class="customer-container">
            <div class="tableContainer">
                <Breadcrumb>
                    <BreadcrumbItem to="/marketindexmenu/marketlist">市场列表</BreadcrumbItem>
                    <BreadcrumbItem>{{ marketname }}</BreadcrumbItem>
                    <BreadcrumbItem>授权用户列表</BreadcrumbItem>
                </Breadcrumb>
                <div>
                    <br />
                </div>
                <Table :columns="columns" :data="list"></Table>
                <br />
                <div style="text-align: center;">
                    <Page @on-change="orderListPage" :total="allCount" simple />
                </div>
                <br />
                <br />
            </div>
            <s3 ref="s3Modal" :orderid="orderid"></s3>
        </div>
    </div>
</template>
<script>
import _ from 'underscore';

import eventhub from '../../common/js/event.js';
import { DAEMON_CONFIG } from '../../../config.js';

const { shell } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    components: {
        s3: () => import('../../components/s3/S3.vue'),
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: '账户',
                    key: 'address',
                },
            ],
            orderid: '',
            allCount: 1,
            pageCount: {},
            marketname: '',
            assetName: '',
        };
    },
    mounted() {
        this.$data.marketname = this.$route.params.name;
        this.$data.assetName = this.$route.params.assetName;
        console.log('初始化');
        this.getlist(1);
    },
    methods: {
        async getlist(page) {
            // assetAll
            console.log('getlist');
            try {
                let res = await ipc.callMain('damauthorized_users', {
                    page: page,
                    asset: this.$data.assetName,
                });
                if (res.state && res.data.data.error == undefined) {
                    // .tx.value.msg[0].value
                    var data = res.data.data || [];
                    var result = [];
                    data.forEach(element => {
                        result.push({
                            address: element,
                        });
                    });
                    this.$data.list = result;
                    if (this.$data.pageCount[page] == undefined) {
                        this.$data.pageCount[page] = 1;
                        this.$data.allCount += result.length;
                    }
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        openS3(row) {
            this.$data.orderid = row.orderID;

            this.$refs.s3Modal.openDialog();
        },
        orderListPage(number) {
            this.getlist(number);
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
        margin-top: 40px;
    }
}
</style>
