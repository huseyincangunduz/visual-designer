<style lang="scss" scoped>
@keyframes breath {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
      opacity: 0;
  }
}
.animated {
  height: 10px;
  width: 100%;
  animation-name: breath;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  background-color: aquamarine;
  border-radius: 50px
}

@for $delay from 0 to 100 {
  .delay-#{$delay} {
    animation-delay: $delay * 2  + ms;
  }
}

.container {
  display: flex;
  flex-direction: row;
}
</style>
<template>
  <div class="container">
    <div v-for="index in 80" :key="index" :class="'delay-' + index + ' animated'"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>