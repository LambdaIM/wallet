<template>
<div>
   <storagehelp/>
   <br/>
   <div>
       <p>1点击添加服务器，通过用密码或私钥方式添加服务器</p>
       <img width="600" :src="addminer" />
       <p>2密码方式</p>
       <img width="600" :src="minerinti" />
    </div>

</div>
</template>
<script>
import addminer from '@/assets/addminer.png';
import minerinti from '@/assets/minerinti.png';
import storagehelp from './storagehelp.vue';


export default {
  data() {
    return {
      addminer,
      minerinti


    };
  },
  components: {
    storagehelp
  }

};
</script>
