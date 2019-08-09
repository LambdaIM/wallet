<template>
<Modal
        loading
        v-model="sendModal"
        :title="$t('home.Modal1.Send_LAMB')"
        :styles="{top: '200px'}"
        @on-cancel="sendcancel"
      >
        <p>
          <Input v-model="address" readonly>
            <span slot="prepend">{{$t('home.Modal1.From')}}</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="to" :placeholder="$t('home.Modal1.LAMB_address')">
            <span slot="prepend">{{$t('home.Modal1.To')}}</span>
          </Input>
        </p>
        <br>
        <p>
          <Input v-model="LAMBvalue">
            <span slot="prepend">{{$t('home.Modal1.Amount')}}</span>
            <span slot="append">{{$t('home.Modal1.LAMB')}}</span>
          </Input>
        </p>
        <div slot="footer">
          <Button type="primary" @click="preSendLAMB">{{$t('home.Modal1.Submit')}}</Button>
        </div>
      </Modal>

</template>
<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    denom: {
      type: String,
      required: true
    }
  },
  data(){
      return {
          sendModal:false,
          LAMBvalue:'',

      }

  },
  methods: {
      preSendLAMB(){
            let from = this.address;
            let to = this.Tovalue;
            let value = parseFloat(this.LAMBvalue);
            if (to == from) {
                this.$Notice.warning({
                title:this.$t('home.action.not_transfer_LAMB_to_yourself')
                });
                return;
            }
            if (value <= 0 || value > this.balance ) {
                // need to alert
                this.$Notice.warning({
                title: this.$t('home.action.check_balance_amount_transfer')
                });
                return;
            }
            // value = wUtils.numberToBig(value) ;
            // 还需要新的校验地址方法
            // if (Utils.isAddress(to) == false) {
            //   // need to alert
            //   this.$Notice.warning({
            //     title:this.$t('home.action.Check_forwarding_address') 
            //   });

            //   return;
            // }

            if (isNaN(value)) {
                this.$Notice.warning({
                title: this.$t('home.action.Check_the_amount')
                });
                return;
            }
            this.transfer(value);
      },
      async transfer(amount) {
      let to = this.Tovalue;
      // let amount = this.LAMBvalue;
      let gas = 1;
      // amount = amount * 10000;
      this.$data.transactiondata=null;
      try {
        let res = await ipc.callMain("transfer", {
          to,
          amount,
          gas
        });
        // console.log(res);
        if (res.state) {
          this.sendcancel();
          var  transactiondata=res.data
          //触发事件活着回掉函数
          
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    sendcancel() {
      this.sendModal = false;
    },
  },
  computed: {
      address: function() {
        return this.$store.getters.getaddress;
      },
  },
}
</script>
