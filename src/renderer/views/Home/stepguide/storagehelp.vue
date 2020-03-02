<template>
<div>
  在矿工管理程序中操作<br/>
  操作手册
  <a @click="openweb('http://docs.lambda.im/StorageManager-Guide/')"> http://docs.lambda.im/StorageManager-Guide/</a>
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
