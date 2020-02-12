<template>
<div>
  <p>配置存储服务</p>
  <br/><br/>
  <div>
    <p>1点击配置存储节点按钮，打开配置对话框</p>
    <img width="600" :src="storage1" />
    <p>2进行配置后</p>
    <img width="600" :src="storage5" />
    <p>3选择需要启动的存储服务器,点击启动按钮启动存储服务</p>
    <img width="600" :src="storage1" />

  </div>
</div>
</template>
<script>
import storage1 from '@/assets/storage2.png';
import storage4 from '@/assets/storage3.png';
import storage5 from '@/assets/storage5.png';


export default {
  data() {
    return {
      storage1,
      storage4,
      storage5

    };
  }

};
</script>
