<template>
  <div>
    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab v-for="(item, index) in tabPages" :key="index">{{ item.title }}</v-tab>
    </v-tabs>

    <v-tabs-items>
      <slot></slot>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import TabPage from "./TabPage.vue";

@Component
export default class ContinousTabCobtrol extends Vue {
  tabPages: Vue[];
  constructor() {
    super();
    this.tabPages = this.$children.filter(v => v instanceof TabPage);
  }
}
</script>