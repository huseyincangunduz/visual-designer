<template>
  <div class="tab-content" v-if="internalVisualDesigner">
    <div>
      <h2 style="margin-bottom: 10px">Styles</h2>
      <v-btn-toggle v-model="internalVisualDesigner.styleState" style="margin-bottom: 20px" dense>
        <v-btn value="normal">Normal</v-btn>

        <v-btn value="hover">
          <v-icon size="small">mouse</v-icon>Hover
        </v-btn>

        <v-btn value="active">
          <v-icon size="small">mouse</v-icon>
          <v-icon size="small">touch_app</v-icon>Active
        </v-btn>
      </v-btn-toggle>
    </div>

    <StyleRuleList
      :cssStylesReactive="internalVisualDesigner.selectedElementStyle"
      :editingElement="internalVisualDesigner.pivot"
    ></StyleRuleList>

    <div
      v-if="internalVisualDesigner.pivot  && editingElementAncestors && editingElementAncestors.length > 0"
    >
      <h3>Style with parent state</h3>
      <v-select
        @input="i => onParentElementSelected(i)"
        v-model="selectedAncestor"
        :items="editingElementAncestors"
        item-text="id"
        style="max-width: 300px"
        label="Select a parent element"
        solo
      ></v-select>

      <div v-show="editingElementWithAncestorStyles && selectedAncestor">
        <v-btn-toggle v-model="ancestorStyleState" style="margin-bottom: 20px" dense>
          <v-btn value="hover">
            <v-icon size="small">mouse</v-icon>Hover
          </v-btn>
          <v-btn value="active">
            <v-icon size="small">mouse</v-icon>
            <v-icon size="small">touch_app</v-icon>Active
          </v-btn>
        </v-btn-toggle>
        <StyleRuleList
          :cssStylesReactive="editingElementWithAncestorStyles"
          :editingElement="internalVisualDesigner.pivot"
        ></StyleRuleList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import StyleRuleList from "@/components/MetaphorUI/Styler/StyleRuleList.vue";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { Observer } from "../../../../controller/REV/Base/Observer.class";
import { EventObserve } from "../../../../controller/REV/EventObverser";
import { ReactiveObject } from "../../../../controller/REV/ReactiveObject";
@Component({
  components: {
    StyleRuleList
  }
})
export default class ElementStyleManager extends Vue {
  @Prop() internalVisualDesigner: InternalVisualDesigner;
  editingElementAncestors: HTMLElement[] = [];
  selectedAncestor: string = null;
  ancestorStyleState: "hover" | "active" = "hover";
  editingElementWithAncestorStyles: ReactiveObject<
    CSSStyleDeclaration | any
  > = new ReactiveObject<CSSStyleDeclaration | any>({});

  mounted() {
    this.internalVisualDesigner.selectedElementStyle.subscribe(
      new EventObserve(() => {
        //console.info("Stil güncelleme")
        this.setParentsOfElements();
        this.selectedAncestor = null;
      })
    );
    this.setParentsOfElements();
    this.onParentElementSelected();
  }

  setParentsOfElements() {
    if (this.internalVisualDesigner.pivot) {
      let p1 = this.internalVisualDesigner.pivot.parentElement;
      let ancestors = [];
      while (p1 != null && p1.tagName != "BODY" && p1.id) {
        ancestors.push(p1);
        p1 = p1.parentElement;
      }
      ancestors = ancestors;
      this.editingElementAncestors = ancestors;
    }
  }

  @Watch("ancestorStyleState") onAncestorStateChanged() {
    this.onParentElementSelected();
  }

  onParentElementSelected() {
    let styleRule: CSSStyleRule = this.internalVisualDesigner.getElementStylesWithAncestor(
      this.internalVisualDesigner.editingIframeDocument.getElementById(
        this.selectedAncestor
      ),
      this.ancestorStyleState
    ) as CSSStyleRule;
    if (styleRule) {
      if (this.editingElementWithAncestorStyles) {
        // console.info(this.editingElementWithAncestorStyles);
        this.editingElementWithAncestorStyles.changeObject(styleRule.style);
      } else
        this.editingElementWithAncestorStyles = ReactiveObject.getFromObject(
          styleRule.style
        );
    }
  }
}
</script>
