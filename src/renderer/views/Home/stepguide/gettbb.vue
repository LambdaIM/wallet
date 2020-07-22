<template>
    <div>
        <Row>
            <Col span="12">
                <h4>{{ $t('guidepage.step1.title1') }}</h4>
                <br />
                <br />
                <Button @click="openAssert" type="primary">{{ $t('guidepage.step1.btnConvert') }}</Button>
                <br />
                <br />
            </Col>
            <Col span="12">
                <h4>{{ $t('guidepage.step1.title2') }}</h4>
                <br />
                <br />
                <span>
                    {{ $t('guidepage.step1.title2brief') }}
                    <a @click="openweb('https://kangbo.io/')">https://kangbo.io/</a>
                </span>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <h4>{{ $t('guidepage.step1.title3') }}</h4>
                <br />
                <br />
                <span>
                    {{ $t('guidepage.step1.title3brief') }}
                    <a @click="openweb('http://faucet.lambda.im/')">http://faucet.lambda.im/</a>
                </span>
            </Col>
        </Row>
        <AssetlModalDialog ref="AssetDialog" />
    </div>
</template>
<script>
import AssetlModalDialog from '@/views/Dialog/assetlModal.vue';
const { shell } = require('electron');

export default {
    methods: {
        openAssert() {
            this.$refs.AssetDialog.open(0, 'ulamb');
        },
        openweb(url) {
            shell.openExternal(url);
        },
    },
    components: {
        AssetlModalDialog,
    },
};
</script>
<style lang="less" scoped></style>
