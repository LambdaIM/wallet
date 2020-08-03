<template>
    <div class="customer-container">
        <div class="tableContainer">
            <Row>
                <Col span="7">
                    <Steps :current="current" direction="vertical">
                        <Step :title="$t('miningguide.steptitle.title1')" :content="$t('miningguide.wallet')"></Step>
                        <Step :title="$t('miningguide.steptitle.title2')" :content="$t('miningguide.wallet')"></Step>
                        <Step :title="$t('miningguide.steptitle.title3')" :content="$t('miningguide.wallet')"></Step>
                        <Step
                            :title="$t('miningguide.steptitle.title4')"
                            :content="$t('miningguide.minermanagement')"
                        ></Step>
                        <Step
                            :title="$t('miningguide.steptitle.title5')"
                            :content="$t('miningguide.minermanagement')"
                        ></Step>
                        <Step :title="$t('miningguide.steptitle.title6')" :content="$t('miningguide.wallet')"></Step>

                        <Step
                            :title="$t('miningguide.steptitle.title7')"
                            :content="$t('miningguide.minermanagement')"
                        ></Step>
                        <Step
                            :title="$t('miningguide.steptitle.title8')"
                            :content="$t('miningguide.minermanagement')"
                        ></Step>
                        <Step :title="$t('miningguide.steptitle.title9')" :content="$t('miningguide.wallet')"></Step>
                    </Steps>
                </Col>
                <Col span="17">
                    <div style="    text-align: center;">
                        <Button :disabled="previousdisable" @click="previous" type="primary">
                            {{ $t('miningguide.previous') }}
                        </Button>
                        &nbsp;&nbsp;

                        <Button :disabled="nextdisable" type="primary" @click="next">
                            {{ $t('miningguide.next') }}
                        </Button>
                    </div>
                    <br />
                    <br />
                    <router-view></router-view>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            current: 0,
            previousdisable: false,
            nextdisable: false,
        };
    },
    mounted() {
        console.log('guide');
        console.log(this.$router);
        var pagename = this.$route.meta.path;
        switch (pagename) {
            case 'guide':
                break;
            case 'pledge':
                this.current = 1;
                break;
            case 'subaccount':
                this.current = 2;
                break;
            case 'miningmanagement':
                this.current = 3;
                break;
            case 'configminer':
                this.current = 4;
                break;
            case 'initializeminer':
                this.current = 5;
                break;

            case 'addstorage':
                this.current = 6;
                break;
            case 'configstorage':
                this.current = 7;
                break;
            case 'sellingspace':
                this.current = 8;
                break;
        }
        this.btndisable();
    },
    methods: {
        next() {
            if (this.current == 8) {
                // this.current = 0;
                return;
            } else {
                this.current += 1;
            }
            console.log('***next***');

            this.pageroute();
            this.btndisable();
        },
        previous() {
            if (this.current == 0) {
                // this.current = 8;
                return;
            } else {
                this.current -= 1;
            }

            this.pageroute();
            this.btndisable();
        },
        pageroute() {
            switch (this.current) {
                case 0:
                    this.$router.push('/guide');
                    break;
                case 1:
                    this.$router.push('/guide/pledge');
                    break;
                case 2:
                    this.$router.push('/guide/subaccount');
                    break;
                case 3:
                    this.$router.push('/guide/miningmanagement');
                    break;
                case 4:
                    this.$router.push('/guide/configminer');
                    break;
                case 5:
                    this.$router.push('/guide/initializeminer');
                    break;

                case 6:
                    this.$router.push('/guide/addstorage');
                    break;
                case 7:
                    this.$router.push('/guide/configstorage');
                    break;
                case 8:
                    this.$router.push('/guide/sellingspace');
                    break;
            }
        },
        btndisable() {
            if (this.current == 0) {
                this.$data.previousdisable = true;
                return;
            } else {
                this.$data.nextdisable = false;
            }

            if (this.current == 8) {
                this.$data.nextdisable = true;
            } else {
                this.$data.previousdisable = false;
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
</style>
