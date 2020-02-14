<template>
<div>
   <storagehelp/>
   <br/>
   <div>
       <p>1添加成功后点击初始化</p>
       <img width="600" :src="miner3" />
       <p>2打开初始化弹窗完成矿工服务初始化操作</p>
       <img width="600" :src="miner4" />
       <p>3点击配置节点按钮，打开配置窗口，进行必要配置后，启动矿工服务</p>
       <img width="600" :src="miner3" />
   </div>
</div>
</template>
<script>

import miner3 from '@/assets/miner3.png';
import miner4 from '@/assets/miner4.png';
import storagehelp from './storagehelp.vue';

export default {
  data() {
    return {

      miner3,
      miner4


    };
  },
  components: {
    storagehelp
  }

};
</script>
