<template>
<div>
  在矿工管理程序中操作<br/>
  操作手册
  <a @click="openweb('https://github.com/LambdaIM/launch/blob/master/StorageManager-Guide0.1.11.md')"> https://github.com/LambdaIM/launch/blob/master/StorageManager-Guide0.1.11.md</a>
</div>
</template>
<script>
const { shell } = require('electron');
export default {
  components: {

  },
  methods: {
    openweb(url) {
      shell.openExternal(url);
    }
  }


};
</script>
