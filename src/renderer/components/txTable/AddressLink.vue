<template>
  <span>

      <Poptip word-wrap trigger="hover" width="400" :content="to" placement="left-start">
                <a >{{to.slice(0,addressLength)}}</a>
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
      default: 10
    }
  }
};
</script>

<style lang="less" scoped></style>
