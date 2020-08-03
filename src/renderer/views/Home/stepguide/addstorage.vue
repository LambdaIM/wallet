<template>
    <div>
        <storagehelp />
        <br />
        <br />
        <div>
            <p>{{ $t('guidepage.addstorage.p1') }}</p>
            <img width="600" :src="storage1" />
            <p>{{ $t('guidepage.addstorage.p2') }}</p>
            <img width="600" :src="storage4" />
            <p>{{ $t('guidepage.addstorage.p3') }}</p>
            <img width="600" :src="storage2" />
            <p>{{ $t('guidepage.addstorage.p4') }}</p>
            <img width="600" :src="storage3" />
        </div>
    </div>
</template>
<script>
import storage1 from '@/assets/storage1.png';
import storage4 from '@/assets/storage4.png';
import storage3 from '@/assets/storage3.png';
import storage2 from '@/assets/Storage_initia_btn.png';
import storagehelp from './storagehelp.vue';

export default {
    data() {
        return {
            storage1,
            storage4,
            storage3,
            storage2,
        };
    },
    components: {
        storagehelp,
    },
};
</script>
