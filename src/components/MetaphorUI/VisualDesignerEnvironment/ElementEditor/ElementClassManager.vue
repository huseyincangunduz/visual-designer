<template>
  <div>
    <v-col cols="12" sm="8">
      <v-combobox
        multiple outlined label="Classes"
        small-chips
        :items="allClasses()"
        v-model="selectedClasses"
        @change="classChanged"
      ></v-combobox>
    </v-col>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { Prop, Watch } from "vue-property-decorator";
@Component({})
export default class ElementClassManager extends Vue {
  @Prop({ default: null }) editingElement: HTMLElement;
  @Prop({ default: null }) internalVisualDesigner: InternalVisualDesigner;
  selectedClasses = [];
  @Watch("editingElement") onEditingElementChanged() {
    this.editingElementChange();
  }

  editingElementChange() {
    if (this.editingElement && this.editingElement.classList.length > 0)
      this.selectedClasses = this.editingElement.classList.value.split(" ");
    else this.selectedClasses = [];
  }
  classChanged() {
    if (this.editingElement){
      this.editingElement.classList.value = this.selectedClasses.join(" ");
    }
    
  }
  elementClasses() {
    let x = [];
    if (this.editingElement)
      this.editingElement.classList.forEach(value => x.push(value));
    return x;
  }
  mounted() {
    this.editingElementChange();
  }
  allClasses() {
    return [...this.getElementClassesAll(), ...this.elementClasses()];
  }
  getElementClassesAll() {
    return this.internalVisualDesigner.pageCore.styleOtomation.stylesheetRuleOperations.getOddClasses(
      null
    );
  }
}
</script>