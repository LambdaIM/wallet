<template>
<div>
  {{$t('guidepage.storagehelper.p1')}}<br/>
  {{$t('guidepage.storagehelper.p2')}}
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
