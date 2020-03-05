<template>
<div>
  <storagehelp/>
  <br/><br/>
  <div>
    <p>1在矿工服务的详情页面，点击添加服务器，通过用密码或私钥方式添加服务器</p>
    <img width="600" :src="storage1" />
    <p>2密码方式</p>
    <img width="600" :src="storage4" />
    <p>3点击初始化按钮</p>
    <img width="600" :src="storage2" />
    <p>4打开初始化弹窗,完成存储服务初始化</p>
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
      storage2


    };
  },
  components: {
    storagehelp
  }

};
</script>
