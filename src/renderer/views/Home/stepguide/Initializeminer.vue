<template>
    <div>
        <div>
            <Button @click="openCreateMiner" type="primary">{{ $t('miningguide.guidepage.Initializeminer') }}</Button>
        </div>
        <br />
        <div>{{ $t('miningguide.guidepage.Initializeminerhelp') }}</div>

        <img width="600" :src="storage2" />

        <CreateMinerModal ref="CreateMiner" />
    </div>
</template>

<script>
import CreateMinerModal from '@/views/Dialog/CreateMinerModal.vue';
import storage2 from '@/assets/phtid.png';

export default {
    components: {
        CreateMinerModal,
    },
    data() {
        return {
            storage2,
        };
    },
    methods: {
        openCreateMiner() {
            this.$refs.CreateMiner.open();
        },
    },
};
</script>
