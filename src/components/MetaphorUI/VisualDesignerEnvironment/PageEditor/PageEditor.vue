

<template>
  <div>
    <v-tabs hide-slider v-model="tab" dark height="30px">
      <v-tab key="page-general-info">General</v-tab>
      <v-tab key="classes">Classes</v-tab>
       <v-tab key="outline">Outlines</v-tab>
    </v-tabs>
    <v-tabs-items dark v-model="tab">
      <v-tab-item key="page-general-info">
        <div class="tab-content">
          <h2>General</h2>
        </div>
      </v-tab-item>
      <v-tab-item key="classes">
        <ClassEditor :internalVisualDesigner="internalVisualDesigner"></ClassEditor>
      </v-tab-item>
      <v-tab-item key="outline">
        <ElementOutlines :internalVisualDesigner="internalVisualDesigner"></ElementOutlines>
      </v-tab-item>

    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import ClassEditor from "./ClassEditor.vue";
import ElementOutlines from "./ElementOutlines.vue";
@Component({
  components: {
    ClassEditor, ElementOutlines
  }
})
export default class PageEditor extends Vue {
  @Prop({ default: null }) internalVisualDesigner: InternalVisualDesigner;
  tab = "";
}
</script>

<style>
</style>