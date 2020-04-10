<template>
  <div v-if="items">
    <v-row>
      <v-col cols="12" sm="12">
        <v-treeview :items="items"  activatable selection-type="independent" color="warning">
        <template slot="label" slot-scope="{ item }">
          <div @click="selectElement(item)" class="element-select" :class="{'font-bold': internalVisualDesigner.pivot == item.element}">
              {{ item.element ?  `${item.element.tagName}` + (item.element.id ? `#${item.element.id}` : "") : '' }}
          </div>

 
        </template>
      </v-treeview>
      </v-col>
    </v-row>
  </div>
</template>
<style>
.font-bold {
  font-weight: bold;
}
.element-select {
  user-select: none;
  cursor: pointer;;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import {IvdEvent} from "@/controller/InternalVisualDesigner/InternalVisualDesignerEvents";
let elementCount = 0;
function increaseElementCount() {
  elementCount = (elementCount % Number.MAX_VALUE) + 1;
  return elementCount;
}

interface IElementNestedMap {
  element: HTMLElement;
  children: IElementNestedMap[];
  name: string;
  id: number;
}

class ElementNestedMap implements IElementNestedMap {
  id: number = 0;
  children: IElementNestedMap[];
  name: string;
  public constructor(public element: HTMLElement, count = 0) {
    this.id = count;

    let x = [];
    for (let i = 0; i < this.element.children.length; i++) {
      const el = this.element.children.item(i);
      x.push(new ElementNestedMap(el as HTMLElement, increaseElementCount()));
    }
    this.children = x;
    this.name =   `${this.element.tagName}` + (this.element.id ? `#${this.element.id}` : "")
  }
}

@Component({})
export default class ElementOutlines extends Vue {
  @Prop({ default: null }) internalVisualDesigner: InternalVisualDesigner;
  items: IElementNestedMap[] = [];
  color = "primary";
  scrollToElementWhenSelect = true;

  mounted() {
    //TODO: If element added, notified as Element Added or removed or changed
    /*this.internalVisualDesigner.subscribe(updateInfo => {
      this.updateTree();
    });*/
    this.updateTree();
  }

  updateTree() {
    this.items = [
      new ElementNestedMap(
        this.internalVisualDesigner.editingIframeDocument.body,
        increaseElementCount()
      )
    ];
  }

  selectElement(x : ElementNestedMap) {
    this.internalVisualDesigner.selectElement(x.element);
    // if (this.scrollToElementWhenSelect) {
    //   x.element.scrollIntoView();
    // }
  }
}
</script>
