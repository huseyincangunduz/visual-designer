<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
@Component({
  name: "tab-page"
})
export default class TabPage extends Vue {
  @Prop({ required: true }) title: string;
  @Prop({ default: false }) selected: boolean;
  @Prop() u_id;
  @Prop() key;
  @Prop() name;
  isActive: boolean = false;

  constructor() {
    super();
  }

  mounted(): void {
    this.isActive = this.selected;
    // super.mounted();
  }
}
</script>

<template>
  <v-tab-item :key="key">
    <slot></slot>
  </v-tab-item>
</template>

<style scoped>
</style>