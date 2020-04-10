<template>
 <div>

   <div v-if="editingElement">
     <h1>{{ standartSelector() }}</h1>
     <v-tabs hide-slider v-model="tab" dark height="30px">
       <v-tab key="element-general-info">General</v-tab>
       <v-tab key="styles">Styles</v-tab>
     </v-tabs>

     <v-tabs-items dark v-model="tab">
       <v-tab-item key="element-general-info" class="disable-transition">
         <h2>General</h2>
         <ElementIDChanger
           :internalVisualDesigner="internalVisualDesigner"
           :editingElement="editingElement"
         ></ElementIDChanger>

         <ElementClassManager
           :internalVisualDesigner="internalVisualDesigner"
           :editingElement="editingElement"
         ></ElementClassManager>
       </v-tab-item>
       <v-tab-item key="styles">
         <ElementStyleManager
           :internalVisualDesigner="internalVisualDesigner"
           :editingElement="editingElement"
         ></ElementStyleManager>
       </v-tab-item>
     </v-tabs-items>
   </div>
   <div v-else>
     Select a element will be edited.
   </div>
 </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { Ref, Prop, Watch } from "vue-property-decorator";
import Vue from "vue";
import { StyleObjectCollector } from "@/controller/UIHelper/StyleObjectCollection";
import { StyleRuleState } from "@/controller/InternalVisualDesigner/PageCore/Styles/StylesheetRuleOperations";
import StyleRuleList from "@/components/MetaphorUI/Styler/StyleRuleList.vue";
import ContinousTabControl from "@/components/MetaphorUI/Primitives/TabControl/ContinousTabControl.vue";
import ElementStyleManager from "./ElementStyleManager.vue";
import ElementIDChanger from "./ElementIDChanger.vue";
import ElementClassManager from "./ElementClassManager.vue";
@Component({
  name: "element-editor",
  components: {
    StyleRuleList,
    ContinousTabControl,
    ElementStyleManager,
    ElementIDChanger,
    ElementClassManager
  }
})
export default class ElementEditor extends Vue {

  @Prop({ default: null }) editingElement: HTMLElement;
  @Prop({ default: null }) internalVisualDesigner: InternalVisualDesigner;
  styleRule: CSSRule | CSSStyleRule = null;
  tab = null;
  toggle_exclusive = "";

  @Watch("editingElement.id") editingElementChanged() {
    this.$forceUpdate();
  }

  @Watch("internalVisualDesigner.styleState") toggleExc() {
    this.internalVisualDesigner.pivot.focus();
    this.internalVisualDesigner.updateElementStyleRule();
  }

  standartSelector(): string {
    if (this.editingElement) {
      return this.editingElement.tagName + "#" + this.editingElement.id;
    } else return "";
  }

}
</script>

<style scoped>
.tab-content {
  min-height: 300px;
}
.v-window.v-item-group {
  transition: none !important;
  transition-timing-function: none !important;
}
</style>
