<template>
<div>
{{$t('miningguide.guidepage.selectnode')}}
 <Select v-model="selectvalue" filterable>
                <Option v-for="item in validatorsList"
                 :value="item.operator_address"
                 :key="item.operator_address"
                 :label="item.description.moniker"
                 >
                    <span>{{ item.description.moniker }}</span>
                    <span style="float:right;color:red">
                        <Icon v-if="item.status==2" type="md-checkmark" />
                        <Icon v-if="item.status!=2" type="md-close" />

                    </span>
                    <p>
                        {{item.operator_address}}
                    </p>

                </Option>
            </Select>
<br/><br/>
<Button @click="openSend" type="primary">{{$t('miningguide.guidepage.pledge')}}</Button>
<StakingModelDialog ref="StakingModelDialog" />
</div>
</template>
<script>
import StakingModelDialog from '@/views/Dialog/stakingModel.vue';
const { ipcRenderer: ipc } = require('electron-better-ipc');

export default {
  components: {
    StakingModelDialog
  },
  data () {
    return {

      selectvalue: '',

      validatorsList: []
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    async getListData() {
      console.log('getListData');
      try {
        let res = await ipc.callMain('validatorsList', {});

        // console.log(res);
        console.log(res);

        if (res.state) {
          this.$data.validatorsList = res.data;
          console.log(this.$data.validatorsList);
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log('getListDataEnd');
    },
    openSend() {
      console.log(this.$data.selectvalue);
      this.$refs.StakingModelDialog.open(this.$data.selectvalue, true, 1);
    }
  }
};
</script>
