<template>
<div>
   <storagehelp/>
   <br/>
   <div>
       <p>1点击添加服务器，通过用密码或私钥方式添加服务器</p>
       <img width="600" :src="addminer" />
       <p>2例如密码方式</p>
       <img width="600" :src="minerinti" />
        <p>3添加成功后点击初始化</p>
       <img width="600" :src="miner3" />
       <p>4打开初始化弹窗完成矿工服务初始化操作</p>
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
      miner4


    };
  },
  components: {
    storagehelp
  }

};
</script>
