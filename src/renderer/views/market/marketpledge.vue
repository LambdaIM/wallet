<template>
    <div class="customer-container">
        <div class="tableContainer" style="font-size: 16px;">
            <Row v-if="selectmarket" class-name="card-item mt20">
                <Col>
                    {{ $t('head.market') }}
                    <Dropdown @on-click="selectmarketClick">
                        <a href="javascript:void(0)">
                            {{ selectmarket.name }}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu v-if="marketList" slot="list">
                            <DropdownItem :name="item.name" :key="item.marketAddress" v-for="item in marketList">
                                {{ item.name }}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    &nbsp;
                    {{ $t('marketpage.Pending-order-fee') }}：{{ selectmarket.feeRate | Percentformat }}
                    {{ $t('marketpage.Single-fee') }}：{{ selectmarket.commissionRate | Percentformat }}
                </Col>
            </Row>
            <Row>
                <Col class-name="title-wrapper">
                    <div>
                        <Button :disabled="Permittedpledge" @click="openDelegateMarket" type="primary">
                            {{ $t('Marketoperation.marketpledge') }}
                        </Button>
                    </div>
                    <br />
                    <div v-if="delegationinfo != null">
                        {{ $t('Marketoperation.Mypledgeamount') }} {{ delegationinfo.delegateAmount | Lambformat }}，
                        {{ $t('Marketoperation.Mypledgeincome') }} {{ Pledgeincome(delegationinfo) | Lambformat }}
                    </div>
                </Col>
            </Row>
            <Row>
                <br />
                {{ $t('Marketoperation.Explain1') }}
                <br />
                {{ $t('Marketoperation.Explain2') }}
                <br />
                {{ $t('Marketoperation.Explain3') }}
                <br />
                <br />

                {{ $t('Marketoperation.Explain4') }}：
                <br />

                {{ $t('Marketoperation.Explain5') }}
                <br />
                {{ $t('Marketoperation.Explain6') }}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </Row>
        </div>
        <DelegateMarketModal ref="DelegateMarket" />
    </div>
</template>
<script>
import DelegateMarketModal from '@/views/Dialog/DelegateMarketModal.vue';
import eventhub from '../../common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
    components: {
        DelegateMarketModal,
    },
    data() {
        return {
            selectmarket: null,
            marketList: [],
            delegationinfo: null,
        };
    },
    mounted() {
        this.getmarketlist();
        eventhub.$on('TransactionSuccess', data => {
            console.log('TransactionSuccess');
            this.getmarketlist();
        });
    },
    methods: {
        async getmarketlist() {
            console.log('getmarketlist');
            try {
                let res = await ipc.callMain('marketlist', {});
                if (res.state) {
                    this.$data.marketList = res.data.data;
                    this.$data.selectmarket = this.finddefaultmarket(this.$data.marketList);
                    this.getmarketdelegationinfo();
                }
            } catch (error) {
                this.$Message.error(this.$t('foot.linkerror'));
            }
        },
        finddefaultmarket(list) {
            var defaultaddress = this.$store.getters.getselectMarket;
            var result = list[0];
            list.forEach(item => {
                if (item.marketAddress == defaultaddress) {
                    result = item;
                }
            });

            return result;
        },
        async getmarketdelegationinfo() {
            console.log('getmarketdelegationinfo');
            let res = await ipc.callMain('marketdelegationinfo', {
                marketName: this.$data.selectmarket.name,
            });
            if (res.state && res.data.data.error == undefined) {
                this.$data.delegationinfo = res.data.data;
            } else {
                this.$data.delegationinfo = null;
            }
        },
        Pledgeincome(data) {
            var list = [];
            var result = 0;
            if (data.inCome.commissionInCome instanceof Array) {
                list = list.concat(data.inCome.commissionInCome);
            }

            if (data.inCome.feeInCome instanceof Array) {
                list = list.concat(data.inCome.feeInCome);
            }

            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                var amount = Number(element.amount);
                result += amount;
            }

            return result;
        },
        async selectmarketClick(name) {
            console.log(name);
            var _this = this;
            this.$data.marketList.forEach(item => {
                if (name == item.name) {
                    _this.$data.selectmarket = item;
                }
            });

            //   this.getmarketinfo(name);
            //   this.getOrderList();
            this.$store.dispatch('setselectMarket', this.$data.selectmarket.marketAddress);
            await this.getmarketdelegationinfo();
        },
        openDelegateMarket() {
            this.$refs.DelegateMarket.open(this.$data.selectmarket.name);
        },
    },
    computed: {
        Permittedpledge() {
            if (this.$data.selectmarket == null || this.$data.selectmarket.name == 'lambdamarket') {
                return true;
            } else {
                return false;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.customer-container {
    .container {
        margin-top: 40px;
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
.tableContainer {
    width: 94%;
    margin: 0 auto;
    margin-top: 10px;
}
</style>
