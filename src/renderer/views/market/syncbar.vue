<template>
<div>
  <div style="    display: inline-block;"  v-if="switchstate">
 {{$t('marketpage.selltable.unitprice')}} <Input @on-keyup="conditionChange"  v-model.number="condition.priceStart" size="small"  style="width: 70px" /> ~<Input @on-keyup="conditionChange"  v-model.number="condition.priceEnd" size="small"  style="width: 70px" />
 {{$t('marketpage.selltable.Odds')}} <Input @on-keyup="conditionChange" v-model.number="condition.rateStart" size="small"  style="width: 70px" /> ~<Input  @on-keyup="conditionChange" v-model.number="condition.rateEnd" size="small"  style="width: 70px" />
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
        rateEnd: ''
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
        this.$Message.info('结束价格不能小于开始价格');
        return;
      }

      if (this.$data.condition.rateStart != '' && this.$data.condition.rateEnd != '' &&
      this.$data.condition.rateEnd < this.$data.condition.rateStart) {
        this.$Message.info('结束赔率不能小于开始赔率');
        return;
      }

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
      let res = await ipc.callMain('marketOrderListsync', {
        marketName: this.$props.marketName,
        orderType: 'premium', // premium all
        page: this.$data.page,
        limit: 10
      });
      if (res.data == 10) {
        this.$data.page += 1;
        this.fetchData();
      } else {
        this.$data.loading = false;
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
