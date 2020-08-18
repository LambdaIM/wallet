<template>
    <div id="a">
        <Col
            :md="md"
            :lg="lg"
            :xs="xs"
            v-for="(txItem, txIndex) in activityDataList"
            :key="txIndex"
            className="cardTable__content-activity"
        >
            <AddressLink :addressLength="addressLength" :to="txItem.from">{{ txItem.from }}</AddressLink>
            &nbsp;

            <Tag color="primary">{{ $t(`txType.${txItem.action}`) }}</Tag>
            <span v-if="isProposal(txItem)">
                <span class="value">{{ txItem.amount | formatAmount }}</span>
                <span v-if="txItem.to">
                    {{ getToWord(txItem) }}
                </span>
            </span>
            <span v-if="isAssettx(txItem)">
                <span v-if="txItem.action == 'MsgCreateDigitalAssetMarket'">
                    {{ txItem.to }}
                </span>
                <span v-if="txItem.action == 'MsgDigitalAssetPledge'">
                    {{ txItem.amount | BlanceValue }}{{ txItem.to | assertdenomformat }} {{ $t('txTable.to') }}
                    {{ $t('assetpage.authorizedMarket') }}
                </span>
                <span v-if="txItem.action == 'MsgAuthorizeMiningPubKey'">
                    {{ txItem.to | assertdenomformat }}
                </span>
                <span v-if="txItem.action == 'MsgDigitalAssetRefund'">
                    {{ txItem.to | assertdenomformat }}
                </span>
                <span v-if="txItem.action == 'MsgDismissDigitalAssetMarket'">
                    {{ txItem.to | assertdenomformat }}
                </span>
                <span v-if="txItem.action == 'MsgDeactivateMiner'">
                    {{ txItem.to }}
                </span>
                <span v-if="txItem.action == 'MsgActivateMiner'">
                    {{ txItem.to | assertdenomformat }}
                </span>
                <span v-if="txItem.action == 'MsgDamCreateBuyOrder'">{{ $t('txother.miner') }}:{{ txItem.to }}</span>
                <span v-if="txItem.action == 'MsgDamOrderRenewal'">{{ $t('txother.order') }}:{{ txItem.to }}</span>
                <span v-if="txItem.action == 'MsgDamMinerWithDrawCount'">
                    {{ $t('txother.assets') }}:{{ txItem.to | assertdenomformat }}
                </span>
                <span v-if="txItem.action == 'MsgAuthorizeUser'">
                    {{ txItem.to }}
                </span>
            </span>

            <AddressLink v-if="isAssettx(txItem) == false" :addressLength="addressLength" :to="txItem.to">
                {{ txItem.to }}
            </AddressLink>

            <p v-if="!txItem.valid && showError == true" class="error">
                {{ $t('Dialog.com.Reason') }} :
                <Tag color="error">{{ txItem.log }}</Tag>
            </p>
        </Col>
        <Col :md="md" :lg="lg" :xs="xs">
            <div style="text-align: right;    padding-right: 20px">
                <!-- <Icon size="24" v-if="more==false" @click="showmore" type="md-more" /> -->
                <Button type="primary" v-if="more == false" @click="showmore" shape="circle" icon="ios-more"></Button>
                <span v-else>&nbsp;</span>
            </div>
        </Col>
    </div>
</template>

<script>
export default {
    components: {
        AddressLink: () => import('./AddressLink.vue'),
    },
    props: {
        activityData: {
            type: Array,
        },
        addressLength: {
            type: Number,
            default: 15,
        },
        md: {
            type: Number,
        },
        lg: {
            type: Number,
            default: 13,
        },
        xs: {
            type: Number,
            default: 24,
        },
        showError: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            more: !(this.$props.activityData.length > 2),
        };
    },
    methods: {
        getToWord(txItem) {
            if (
                txItem.action == 'MsgWithdrawDelegationReward' ||
                txItem.action == 'MsgWithdrawValidatorCommission' ||
                txItem.action == 'MsgUndelegate'
            ) {
                return this.$t('txTable.Withdraw');
            } else {
                return this.$t('txTable.to');
            }
        },
        isProposal(txItem) {
            console.log('isProposal');

            return (
                txItem.action !== 'MsgSubmitProposal' &&
                txItem.action !== 'MsgUnjail' &&
                txItem.action !== 'MsgCreateValidator' &&
                txItem.action !== 'MsgCreateMarket' &&
                txItem.action !== 'MsgEditMarket' &&
                txItem.action !== 'MsgWithDrawMarket' &&
                txItem.action !== 'MsgCreateMachine' &&
                txItem.action !== 'MsgEditMachine' &&
                txItem.action !== 'MsgCreateMiner' &&
                txItem.action !== 'MsgMinerWithDraw' &&
                txItem.action !== 'MsgCreateSellOrder' &&
                txItem.action !== 'MsgCancelSellOrder' &&
                txItem.action !== 'MsgCreateBuyOrder' &&
                txItem.action !== 'MsgEditMiner' &&
                txItem.action !== 'MsgMaintain' &&
                txItem.action !== 'MsgUnMaintain' &&
                txItem.action !== 'MsgUnjailMiner' &&
                txItem.action !== 'MsgEditValidator' &&
                txItem.action !== 'MsgModifyWithdrawAddress' &&
                txItem.action !== 'MsgOrderRenewal' &&
                txItem.action !== 'MsgCreateDigitalAssetMarket' &&
                txItem.action !== 'MsgDigitalAssetPledge' &&
                txItem.action !== 'MsgAuthorizeMiningPubKey' &&
                txItem.action !== 'MsgDigitalAssetRefund' &&
                txItem.action !== 'MsgDismissDigitalAssetMarket' &&
                txItem.action !== 'MsgWithdrawMinerRewards' &&
                txItem.action !== 'MsgDeactivateMiner' &&
                txItem.action !== 'MsgActivateMiner' &&
                txItem.action !== 'MsgDamCreateBuyOrder' &&
                txItem.action !== 'MsgDamOrderRenewal' &&
                txItem.action !== 'MsgDamMinerWithDrawCount' &&
                txItem.action !== 'MsgDamMinerWithDraw' &&
                txItem.action !== 'MsgAuthorizeUser'
            );
        },
        isAssettx(txItem) {
            var list = [
                'MsgCreateDigitalAssetMarket',
                'MsgDigitalAssetPledge',
                'MsgAuthorizeMiningPubKey',
                'MsgDigitalAssetRefund',
                'MsgDismissDigitalAssetMarket',
                'MsgDeactivateMiner',
                'MsgActivateMiner',
                'MsgDamCreateBuyOrder',
                'MsgDamOrderRenewal',
                'MsgDamMinerWithDrawCount',
                'MsgDamMinerWithDraw',
                'MsgAuthorizeUser',
            ];
            if (list.indexOf(txItem.action) > -1) {
                return true;
            } else {
                return false;
            }
        },
        showmore() {
            this.$data.more = true;
        },
        denomFormat(denom) {
            return denom.substr(1);
        },
    },
    computed: {
        activityDataList() {
            // .from   .to
            if (this.$props.activityData.length == 1) {
                return this.$props.activityData;
            }
            var me = this.$store.getters.getaddress;
            var meList = [];
            var otherList = [];
            this.$props.activityData.forEach(item => {
                if ((item.to == me || item.from == me) && meList.length < 2) {
                    meList.push(item);
                } else {
                    otherList.push(item);
                }
            });

            if (this.more) {
                return meList.concat(otherList);
            } else {
                return meList;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.cardTable__content-activity {
    margin-bottom: 15px;
    .value {
        // font-weight: 600;
        color: #ff9800;
    }
    .error {
        margin-top: 10px !important;
    }
}

.successc {
    color: #2d8cf0;
}
.errorc {
    color: #ed4014;
}
</style>
