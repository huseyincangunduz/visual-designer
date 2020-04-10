<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { ReactiveObject } from "../../../../controller/REV/ReactiveObject";
import StyleRuleList from "@/components/MetaphorUI/Styler/StyleRuleList.vue";
import { ResponsiveWidthBreakpoint } from "@/controller/InternalVisualDesigner/PageCore/Styles/WidthBreakpointsManager";
@Component({
  components: { StyleRuleList }
})
export default class ClassEditor extends Vue {
  @Prop() internalVisualDesigner: InternalVisualDesigner;
  selectedClass: string = "";
  classRule: CSSStyleRule;
  cssStylesReactive: ReactiveObject<any>;
  classMode: "normal" | "hover" | "active" = "normal";

  constructor() {
    super();
    this.cssStylesReactive = ReactiveObject.getFromObject({});
  }

  relatedRule() {
    const pageCore = this.internalVisualDesigner.pageCore;
    const selectedBreakpoint = pageCore.widthBreakpointsManager.getSelectedBreakpoint();
    const relatedRule =
      selectedBreakpoint instanceof ResponsiveWidthBreakpoint
        ? selectedBreakpoint.relatedRule
        : null;
    return relatedRule;
  }

  classList() {
    const pageCore = this.internalVisualDesigner.pageCore;
    return pageCore.styleOtomation.stylesheetRuleOperations.getOddClasses(
      null
    );
  }

  classSelect() {
    this.classRule = this.internalVisualDesigner.pageCore.styleOtomation.stylesheetRuleOperations.findClassRule(
      this.selectedClass,
      this.relatedRule(),
      this.classMode
    ) as CSSStyleRule;
    // console.info(this.classRule);
    this.cssStylesReactive.changeObject(this.classRule.style);
  }

  stateChanged() {
    this.classSelect();
  }
}
</script>
<template>
  <div style="padding: 10px">
    <div class="row">
      <div class="col-8">
        <v-combobox
          flat
          :items="classList()"
          v-model="selectedClass"
          @change="classSelect"
          placeholder="Pick a class or add new"
        ></v-combobox>
      </div>
      <div class="col-4"></div>
    </div>
    <v-btn-toggle v-model="classMode" @change="stateChanged" dense>
      <v-btn value="normal">Normal</v-btn>

      <v-btn value="hover">
        <v-icon size="small">mouse</v-icon>Hover
      </v-btn>

      <v-btn value="active">
        <v-icon size="small">mouse</v-icon>
        <v-icon size="small">touch_app</v-icon>Active
      </v-btn>
    </v-btn-toggle>
    <StyleRuleList v-show="classRule" :cssStylesReactive="cssStylesReactive" />
  </div>
</template>
