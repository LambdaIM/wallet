<template>
    <div>
        <storagehelp />
        <br />
        <div>
            <p>{{ $t('guidepage.addminer.p1') }}</p>
            <img width="600" :src="addminer" />
            <p>{{ $t('guidepage.addminer.p2') }}</p>
            <img width="600" :src="minerinti" />
            <p>{{ $t('guidepage.addminer.p3') }}</p>
            <img width="600" :src="miner3" />
            <p>{{ $t('guidepage.addminer.p4') }}</p>
            <img width="600" :src="miner4" />
        </div>
    </div>
</template>
<script>
import addminer from '@/assets/addminer.png';
import minerinti from '@/assets/minerinti.png';
import storagehelp from './storagehelp.vue';
import miner3 from '@/assets/Miner_initialization_btn.png';
import miner4 from '@/assets/miner4.png';

export default {
    data() {
        return {
            addminer,
            minerinti,
            miner3,
            miner4,
        };
    },
    components: {
        storagehelp,
    },
};
</script>
