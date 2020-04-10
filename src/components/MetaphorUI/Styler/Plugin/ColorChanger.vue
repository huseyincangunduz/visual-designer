<template>
  <div class="color-picker">
    <div>  <v-btn @click="showDefinedColors = !showDefinedColors" x-small>{{ !showDefinedColors ? 'Show predefined colors' : 'Show picker' }}</v-btn></div>
    <v-color-picker
      dark
      flat
      :show-swatches="showDefinedColors"
      :hide-canvas="showDefinedColors"
      :value="this.colorObject"
      style="display: inline-block"
      @input="colorChanged"
    ></v-color-picker>
      
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { VisualStyler } from "./VisualStyler";
import Component from "vue-class-component";
interface rgb {
  r;
  g;
  b;
  a?;
}
interface hsv {
  h;
  s;
  v;
  a?;
}

@Component
export default class ColorChanger extends VisualStyler {
  showDefinedColors = true;
  colorObject: rgb | hsv | string;
  colorChanged(i) {
    if (this.colorObject == null) return
    if (i instanceof String && i.startsWith("#")) {
      this.emitNewValue(i.toString());
    } else if ((i as rgb) != null) {
      this.emitNewValue(
        `rgba(${i.r | 0}, ${i.g | 0} , ${i.b | 0} , ${i.a != null ? i.a : 1})`
      );
    } else if ((i as hsv) != null) {
      this.emitNewValue(
        `rgba(${i.h | 0}, ${i.s | 0} , ${i.v | 0} , ${i.a != null ? i.a : 1})`
      );
    }
  }
  colorToObject(stringColor) {
    var genericColor = stringColor.match(/\d+/g);
    if (stringColor.startsWith("rgba") || stringColor.startsWith("rgb")) {
      return {
        r: genericColor[0],
        g: genericColor[1],
        b: genericColor[2],
        a: genericColor[3] ? genericColor[3] : 1
      };
    }
    if (stringColor.startsWith("hsv") || stringColor.startsWith("hsva")) {
      return {
        h: genericColor[0],
        s: genericColor[1],
        v: genericColor[2],
        a: genericColor[3] ? genericColor[3] : 1
      };
    } else if (stringColor.startsWith("#")) {
      return stringColor;
    }
  }
  mounted() {
    this.colorObject = this.colorToObject(this.styleObject.styleValue);
  }
}
</script>

<style scoped>
.color-picker {
  margin: 10px 10px 20px 0px;
}
</style>