<template>
  <div class="card-container">
    <div class="card-wrapper">
      <Card dis-hover :title="cardtitle">
       <slot name="card-content"></slot>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    cardtitle:{
      type:String
    }
  }
};
</script>

<style>
</style>
