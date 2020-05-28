<template>
  <span>


                <a>{{getname(name)||id}}</a>


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
  methods: {
    getname(title) {
      if (title && title.length > 50) {
        return title.slice(0, 50) + '...';
      } else {
        return '';
      }
    }
  },

  computed: {

  }
};
</script>

<style lang="less" scoped></style>
