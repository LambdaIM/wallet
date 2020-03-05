<template>
<div>
  <storagehelp/>
  <br/><br/>
  <div>
    <p>1点击配置存储节点按钮，打开配置对话框</p>
    <img width="600" :src="storage1" />
    <p>2进行配置后</p>
    <img width="600" :src="storage5" />
    <p>3选择需要启动的存储节点,点击启动按钮启动存储服务</p>
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
