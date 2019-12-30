<template>
<div>
  <div style="    display: inline-block;"  v-if="switchstate">
 <!-- {{$t('marketpage.myselltable.Storagedevice')}}<Input @on-keyup="conditionChange"  v-model="condition.storagenode" size="small"  style="width: 70px" /> -->
 {{$t('marketpage.selltable.unitprice')}} <Input @on-keyup="conditionChange"  v-model.number="condition.priceStart" size="small"  style="width: 50px" /> ~<Input @on-keyup="conditionChange"  v-model.number="condition.priceEnd" size="small"  style="width: 50px" />
 {{$t('marketpage.selltable.Odds')}} <Input @on-keyup="conditionChange" v-model.number="condition.rateStart" size="small"  style="width: 50px" /> ~<Input  @on-keyup="conditionChange" v-model.number="condition.rateEnd" size="small"  style="width: 50px" />
  </div>
 <Button :loading="loading" @click="switchfn"  type="primary">{{stateTxt}}</Button>

</div>
</template>

<script>
import { DAEMON_CONFIG } from '../../../config.js';
import eventHub from '@/common/js/event.js';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  data() {
    return {
      searchkey: '',
      switchstate: false,
      page: 1,
      loading: false,
      condition: {
        priceStart: '',
        priceEnd: '',
        rateStart: '',
        rateEnd: '',
        storagenode: '',
        'statusType': '0'
      }
    };
  },
  props: {
    marketName: {
      type: String
    }
  },
  mounted() {

  },
  methods: {
    conditionChange() {
      if (this.$data.condition.priceStart != '' && this.$data.condition.priceEnd != '' &&
      this.$data.condition.priceEnd < this.$data.condition.priceStart) {
        this.$Message.info(this.$t('marketpage.Localsorting4'));
        return;
      }

      if (this.$data.condition.rateStart != '' && this.$data.condition.rateEnd != '' &&
      this.$data.condition.rateEnd < this.$data.condition.rateStart) {
        this.$Message.info(this.$t('marketpage.Localsorting4'));
        return;
      }
      this.$data.condition['statusType'] = this.$store.getters.statusType == 'active' ? '0' : '1';

      eventHub.$emit('marketconditionfilter', this.$data.condition);
    },
    switchfn() {
      console.log('=====');

      this.$data.switchstate = !this.$data.switchstate;
      eventHub.$emit('marketsellordersync', this.$data.switchstate);
      if (this.$data.switchstate) {
        this.$data.loading = true;
        this.fetchData();
      }
    },
    async fetchData() {
      console.log('-----');
      let res = await ipc.callMain('marketOrderListsync', {
        marketName: this.$props.marketName,
        orderType: 'premium', // premium all
        page: this.$data.page,
        limit: 10,
        statusType: this.$store.getters.statusType
      });
      if (res.data == 10) {
        this.$data.page += 1;
        this.fetchData();
      } else {
        this.$data.loading = false;
        eventHub.$emit('marketconditionfilter', this.$data.condition);
      }
    }
  },
  computed: {
    stateTxt() {
      if (this.$data.switchstate) {
        return this.$t('marketpage.Localsorting2');
      } else {
        return this.$t('marketpage.Localsorting1');
      }
    }
  }

};

</script>
