<template>
<div>

 <br/>
 <div>
      <Select @on-change="selectchange" :placeholder="$t('miningguide.guidepage.selectmarket')" v-model="marketaddress" style="width:200px">
        <Option v-for="item in marketList" :value="item.marketAddress" :key="item.marketAddress">{{ item.name }}</Option>
        </Select>
 </div>
 <br/>
 <div>
     <Button @click="openSellingspace" type="primary">{{$t('miningguide.guidepage.sellingspace')}}</Button>
 </div>
 <SellingspaceModal ref="Sellingspace" />
</div>
</template>
<script>

import SellingspaceModal from '@/views/Dialog/SellingspaceModal.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      marketList: [],
      selectmarket: '',
      marketaddress: ''
    };
  },
  components: {
    SellingspaceModal
  },
  mounted() {
    this.getmarketlist();
  },
  methods: {
    async getmarketlist() {
      console.log('getmarketlist');
      let res = await ipc.callMain('marketlist', {});
      if (res.state) {
        this.$data.marketList = res.data.data || [];
        this.$data.selectmarket = this.$data.marketList[0];
      }
    },
    selectchange(addr) {
      console.log(addr);
      this.$data.marketList.forEach(element => {
        if (element.marketAddress == addr) {
          this.$data.selectmarket = element;
        }
      });
    },
    openSellingspace() {
      this.$refs.Sellingspace.open(this.$data.selectmarket);
    }
  }
};
</script>
