<template>
    <Modal :title="$t('rolepage.title')" v-model="showrole" :closable="false" :mask-closable="false" @on-ok="setrole">
        <div class="roleselect">
            <div @click="selectitem('simple')" :class="{ item: true, active: activeitem == 'simple' }">
                <h3>{{ $t('rolepage.roletype.simpleuser') }}</h3>
                <p>{{ $t('rolepage.simpleuserbrief') }}</p>
            </div>
            <div @click="selectitem('order')" :class="{ item: true, active: activeitem == 'order' }">
                <h3>{{ $t('rolepage.roletype.orderuser') }}</h3>
                <p>{{ $t('rolepage.orderuserbrief') }}</p>
            </div>
            <div @click="selectitem('miner')" :class="{ item: true, active: activeitem == 'miner' }">
                <h3>{{ $t('rolepage.roletype.miner') }}</h3>
                <p>{{ $t('rolepage.minerbrief') }}</p>
            </div>
            <div @click="selectitem('validator')" :class="{ item: true, active: activeitem == 'validator' }">
                <h3>{{ $t('rolepage.roletype.validator') }}</h3>
                <p>{{ $t('rolepage.validatorbrief') }}</p>
            </div>
            <div @click="selectitem('marketmaker')" :class="{ item: true, active: activeitem == 'marketmaker' }">
                <h3>{{ $t('rolepage.roletype.marketmaker') }}</h3>
                <p>{{ $t('rolepage.marketmakerbrief') }}</p>
            </div>
        </div>
    </Modal>
</template>
<script>
export default {
    data() {
        return {
            showrole: false,
            activeitem: this.$store.getters.role || 'simple',
        };
    },
    mounted() {
        this.$data.activeitem = this.$store.getters.role || 'simple';
    },
    methods: {
        open() {
            this.$data.showrole = true;
        },
        selectitem(value) {
            this.$data.activeitem = value;
        },
        setrole() {
            console.log('Submit');

            console.log(this.$data.activeitem);
            // var rolelist=['simple','order','miner','validator'];

            this.$store.dispatch('setrole', this.$data.activeitem);
            setTimeout(function() {
                window.location.reload();
            }, 500);
        },
    },
};
</script>
<style lang="less" scoped>
.roleselect {
    .item {
        border: 2px solid white;
        cursor: pointer;
        &:hover {
            border: 2px solid #2d8cf0;
        }
        margin-bottom: 10px;
        padding: 5px;
    }
    .active {
        border: 2px solid #2d8cf0;
        border-radius: 5px;
    }
}
</style>
