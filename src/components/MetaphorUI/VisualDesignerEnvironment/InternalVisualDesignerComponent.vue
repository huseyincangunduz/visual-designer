<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { ResponsiveWidthBreakpoint } from "@/controller/InternalVisualDesigner/PageCore/Styles/WidthBreakpointsManager";
import { StyleRuleState } from "@/controller/InternalVisualDesigner/PageCore/Styles/StylesheetRuleOperations";
@Component({
  name: "internal-visual-designer-view"
})
export default class InternalVisualDesignerComponent extends Vue {
  @Prop() initialSrc: string;
  @Ref("ivsRootEl") ivsRootEl: HTMLDivElement;
  x = 0;
  y = 0;

  ctrlKeyDown: boolean;
  scale: number = 1;
  moveableThing: boolean;
  offset: { x: number; y: number };
  get _src() {
    return this.initialSrc;
  }
  _rootElement = document.createElement("div");
  internalVisualDesigner: InternalVisualDesigner;
  initialized = false;
  selectElement(element, pivot: HTMLElement, rule) {
    this.$emit("element-selected", element, pivot, rule);
  }

  selectedElementUpdate() {
    this.$emit("element-updated");
  }

  mounted() {
    let readyToGo = (ivd: InternalVisualDesigner) => {
      var select = (element, pivot) => {
        //Stil Mod Kontrolü
        let medRul: CSSMediaRule = null;
        let selectedBreakpoint = ivd.pageCore.widthBreakpointsManager.getSelectedBreakpoint();
        if (
          selectedBreakpoint instanceof ResponsiveWidthBreakpoint &&
          selectedBreakpoint.width &&
          selectedBreakpoint.relatedRule
        ) {
          medRul = selectedBreakpoint.relatedRule;
        }

        let rule = ivd.pageCore.styleOtomation.findRule(
          pivot,
          medRul,
          "normal"
        );

        this.selectElement(element, pivot, rule);
      };
      var update = (element, pivot) => {
        //let rule = ivd.styleOtomation.findRule(pivot,null,StyleRuleState.normal);
        this.selectedElementUpdate();
      };

      ivd.subscribe((e) => {
        console.info(e);
        if (e.eventType == "selected") {
          select(e.pivotSelectedElement,e.selectedElements);
        }
        update(e.selectedElements,e.pivotSelectedElement)
        
      });

      this.internalVisualDesigner = ivd;
      this.$emit("ivd-created", ivd);

      this.internalVisualDesigner.editingIframeWindow.addEventListener(
        "wheel",
        e => {
          this.playgroundWheel(e);
        },
        { passive: false }
      );

      this.initialized = true;
    };
    InternalVisualDesigner.createByDivAndCreate(
      this.ivsRootEl,
      this,
      this.initialSrc,
      readyToGo
    );
  }

  playgroundWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      let increase = e.deltaY < 0 ? 0.1 : -0.1;
      this.scale = Math.max(0.25, Math.min(this.scale + increase, 4));
      e.preventDefault();
    }
  }
}
</script>

<template>
  <div class="ivd-playground" @mousewheel="playgroundWheel">
    <div
      ref="ivsRootEl"
      :style="{'transform': 'scale(' + scale + ') translate(' + x + 'px ,' + y + 'px)'}"
      class="internal-designer-area-container"
    ></div>
  </div>
</template>

<style>
.ivd-playground {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
}
.internal-designer-area-container {
  background-color: white;
  height: calc(100vh - 50px);
  /* width: 100vw; */
}
</style>