<template>
<div>
   <p>在矿工管理程序中操作 </p>
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


export default {
  data() {
    return {
      addminer,
      minerinti


    };
  }

};
</script>
