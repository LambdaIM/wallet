<template>
  <span>


                <a>{{name||id}}</a>


  </span>
</template>
<script>
export default {
  props: {
    id: {
      type: String
    },
    addressLength: {
      type: Number,
      default: 15
    },
    name: {
      type: String,
      default: ''
    }
  },

  computed: {

  }
};
</script>

<style lang="less" scoped></style>
