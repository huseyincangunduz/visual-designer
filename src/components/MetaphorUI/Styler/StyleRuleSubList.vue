<script lang="ts">

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { StyleObject } from "@/controller/UIHelper/StyleObjectCollection";
import StyleCode from "./StyleCode.vue"
@Component({
components: {
  StyleCode
}
})
export default class StyleRuleSubList extends Vue {
  @Prop({default: []}) styleObjects: StyleObject[];
  
  styleUpdate(styleObj) {
    this.$emit("style-updated",styleObj);
  }
}
</script>

<template>
  <div>
   <StyleCode v-for="(value, key) in styleObjects" :key="key" :styleObject="value" @style-updated="styleUpdate"></StyleCode>
  </div>
</template>
<style scoped>
</style>
