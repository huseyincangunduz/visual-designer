<template>
  <div class="percent">
    <v-slider dark min="0" max="100" style="width: 300px" :value="valMaximized" thumb-color="blue" thumb-label @input="valueChanged"></v-slider>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { VisualStyler } from "./VisualStyler";
import Component from "vue-class-component";

@Component({
    name: "Percent"
})
export default class Percent extends VisualStyler {
  value: number;
  valMaximized: number = 0;
  mounted() {
    this.value = parseFloat(this.styleObject.styleValue) || 1;
    this.valMaximized = this.value * 100;
  }
  valueChanged(newValueInPerc) {
    this.value = newValueInPerc / 100;
    this.emitNewValue(this.value.toString());
  }
}
</script>

<style scoped>
</style>