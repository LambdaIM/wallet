<template>
  <span>

      <Poptip word-wrap trigger="hover" width="400" :content="to" placement="left-start">
                <a v-if="isme">我</a>
                <a v-else>{{to.slice(0,addressLength)}}</a>
              </Poptip>

  </span>
</template>
<script>
export default {
  props: {
    to: {
      type: String
    },
    addressLength: {
      type: Number,
      default: 15
    }
  },

  computed: {
    isme: function() {
      return this.$store.getters.getaddress == this.$props.to;
    }
  }
};
</script>

<style lang="less" scoped></style>
