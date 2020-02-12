<template>
<div>
    <div>
        <Button @click="openCreateMiner" type="primary">初始化矿工</Button>
    </div><br/>
    <div>初始化矿工所需要的dhtid 在矿工管理程序中可以获取到</div>
<CreateMinerModal ref="CreateMiner" />
</div>
</template>

<script>
import CreateMinerModal from '@/views/Dialog/CreateMinerModal.vue';

export default {
  components: {
    CreateMinerModal
  },
  methods: {
    openCreateMiner() {
      this.$refs.CreateMiner.open();
    }
  }
};
</script>
