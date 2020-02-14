<template>
<div>
    <div>
        <Button @click="openCreateMiner" type="primary">{{$t('miningguide.guidepage.Initializeminer')}}</Button>
    </div><br/>
    <div>{{$t('miningguide.guidepage.Initializeminerhelp')}}</div>
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
