<template>
<div>
  <storagehelp/>
  <br/><br/>
  <div>
    <p>{{$t('guidepage.configstorage.p1')}}</p>
    <img width="600" :src="storage1" />
    <p>{{$t('guidepage.configstorage.p2')}}</p>
    <img width="600" :src="storage5" />
    <p>{{$t('guidepage.configstorage.p3')}}</p>
    <img width="600" :src="storage4" />

  </div>
</div>
</template>
<script>
import storage1 from '@/assets/storage_config_btn.png';
import storage4 from '@/assets/storage_start.png';
import storage5 from '@/assets/storage5.png';
import storagehelp from './storagehelp.vue';


export default {
  data() {
    return {
      storage1,
      storage4,
      storage5

    };
  },
  components: {
    storagehelp
  }

};
</script>
