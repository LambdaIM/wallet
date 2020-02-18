<template>
    <Modal
        title="请选择使用钱包的主要角色"
        v-model="showrole"
        :closable="false"
        :mask-closable="false"
        @on-ok="setrole"
        >
        <div class="roleselect">
            <div @click="selectitem('simple')"   :class="{item:true, active:activeitem=='simple'}">
            <h3> 普通用户 </h3>
            <p>查看资产，转账，质押挖矿，提案投票，提取质押奖励 </p>
            </div>
            <div @click="selectitem('order')"    :class="{item:true, active:activeitem=='order'}">
            <h3>  订单用户</h3>
            <p>查看资产，转账，质押挖矿，提案投票，购买空间，使用lambdas3，提取质押奖励 </p>
            </div>
            <div @click="selectitem('miner')"     :class="{item:true, active:activeitem=='miner'}">
            <h3>矿工</h3>
            <p>查看资产，转账，质押挖矿，提案投票，市场买卖空间，挖矿向导，提取质押奖励，提取存储挖矿奖励 </p>
            </div>
            <div @click="selectitem('validator')" :class="{item:true, active:activeitem=='validator'}">
            <h3>验证节点</h3>
            <p>查看资产，转账，质押挖矿，提案投票 ，提取质押奖励，提取节点收益</p>
            </div>

        </div>
    </Modal>
</template>
<script>
export default {
  data() {
    return {
      showrole: false,
      activeitem: this.$store.getters.role

    };
  },
  mounted() {
    this.$data.activeitem = this.$store.getters.role;
  },
  methods: {
    open() {
      this.$data.showrole = true;
    },
    selectitem(value) {
      this.$data.activeitem = value;
    },
    setrole() {
      console.log('Submit');

      console.log(this.$data.activeitem);
      this.$store.dispatch('setrole', this.$data.activeitem);
      setTimeout(function() {
        window.location.reload();
      }, 10);
    }

  }
};
</script>
<style lang="less" scoped>
.roleselect{
      .item{
          border: 2px solid white;
          &:hover{
            border: 2px solid #2d8cf0;
          }
          margin-bottom: 10px;
          padding: 5px;


      }
      .active{
              border: 2px solid #2d8cf0;
              border-radius:5px;
      }


    }
</style>
