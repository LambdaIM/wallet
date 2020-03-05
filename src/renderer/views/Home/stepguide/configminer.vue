<template>
<div>
   <storagehelp/>
   <br/>
   <div>

       <p>3点击配置节点按钮，打开配置窗口，进行必要配置后，启动矿工服务</p>
       <img width="600" :src="miner3" />
       <br/>
       <img width="600" :src="miner4" />
   </div>
</div>
</template>
<script>

import miner3 from '@/assets/Miners_config_btn.png';
import miner4 from '@/assets/Miners_config_view.png';
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
