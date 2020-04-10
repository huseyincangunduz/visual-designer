<template>
  <div style="width:100%">
    <div @mouseleave="/*areaMouseLeave()*/">
      {
      <div class="metaphor-element-style-editor">
        <div class="style-modifiers">
          <div class="style-modifier" v-for="(item, index) in collectedStyles" :key="index">
            <StyleCode @style-updated="onStyleUpdated" :styleObject="item"></StyleCode>
          </div>
          <div class="style-adder">
            <StyleCodeAdder @style-updated="onStyleUpdated" :editingElement="editingElement"></StyleCodeAdder>
          </div>
        </div>
      </div>}
    </div>
  </div>
</template>

<style scoped>
:root {
  --metaphor-left: 50px;
  --metaphor-left-minus: -50px;
}

.style-modifiers {
  margin-left: var(--metaphor-left);
}
.style-adder {
  margin-left: 56px;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import StyleCode from "./StyleCode.vue";
import { Prop, Watch, PropSync } from "vue-property-decorator";
import {
  StyleObject,
  StyleObjectCollector
} from "@/controller/UIHelper/StyleObjectCollection";
import { ReactiveObject } from "../../../controller/REV/ReactiveObject";
import { Observer } from "../../../controller/REV/Base/Observer.class";
import { IObserver } from "@/controller/REV/Base/IObserver";
import { ISubject } from "@/controller/REV/Base/ISubject";
import ColorChanger from "./Plugin/ColorChanger.vue";
import StyleCodeAdder from "./StyleCodeAdder.vue";
import TextBox from "@/components/MetaphorUI/Primitives/TextBox.vue";
import tr from "vuetify/src/locale/tr";
@Component({
  components: {
    StyleCode,
    TextBox,
    StyleCodeAdder,
    ColorChanger
  }
})
export default class StyleRuleList extends Vue implements IObserver {
  @Prop({ default: null }) cssStylesReactive: ReactiveObject<
    CSSStyleDeclaration | {}
  >;

  @Prop() refreshFlag: boolean;
  @Prop() editingElement: HTMLElement;
  expanded: { [key: string]: boolean } = {};
  collectedStyles: StyleObject[] = [];
  disableReloadIntoNextUpdate: boolean;

  public constructor() {
    super();
  }

  created() {
    this.cssStylesReactive.subscribe(this);
    this.update(null, null);
  }

  reactiveObjToList() {
    let styleCollect = new StyleObjectCollector();
    //@ts-ignore
    styleCollect.transferFromStyleDecleration(this.cssStylesReactive.raw);
    this.collectedStyles = styleCollect.styleObjects;
    // console.info(this.collectedStyles);
  }

  styleRuleCollected() {}

  update(subject: ISubject, param: any): void {
    if (!this.disableReloadIntoNextUpdate) {
      this.expanded = {};
      this.reactiveObjToList();
      // console.info(this.disableReloadIntoNextUpdate)
    }

    this.disableReloadIntoNextUpdate = false;
  }

  onStyleUpdated(styleObject: StyleObject) {
    // this.disableReloadIntoNextUpdate = true;
    this.cssStylesReactive.object[styleObject.styleKey] =
      styleObject.styleValue;
  }
}
</script>
