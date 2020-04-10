<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { PageCore } from "@/controller/InternalVisualDesigner/PageCore/PageCore";
import TabControl from "@/components/MetaphorUI/Primitives/TabControl/TabControl.vue";
import TabPage from "@/components/MetaphorUI/Primitives/TabControl/TabPage.vue";
import { Ref, Prop } from "vue-property-decorator";
import InternalVisualDesignerComponent from "./InternalVisualDesignerComponent.vue";
import ElementEditor from "@/components/MetaphorUI/VisualDesignerEnvironment/ElementEditor/ElementEditor.vue";
import PageEditor from "@/components/MetaphorUI/VisualDesignerEnvironment/PageEditor/PageEditor.vue";
@Component({
  name: "visual-designer",
  components: {
    TabControl,
    TabPage,
    InternalVisualDesignerComponent,
    ElementEditor,
    PageEditor
  }
})
export default class VisualDesignerEnvironment extends Vue {

  rightPanelVisibility = false;
  internalVisualDesigner: InternalVisualDesigner = null;
  pageCore: PageCore = null;
  initialized: boolean = false;
  @Ref("elementEditor") elementEditor: Vue | any;
  @Ref("pageEditor") pageEditor: Vue | any;
  selectedElement: HTMLElement = null;
  @Prop({ default: false }) rightElementEditor;
  @Prop({ default: false }) rightPageEditor;
  @Prop({ default: false }) rightEnvironmentEditor;
  @Prop({ default: false }) toolbox;



  toggleOptionsToggleBtnClicked() {
    this.rightPanelVisibility = !this.rightPanelVisibility;
  }

  registerInternalVisualDesigner(ivd: InternalVisualDesigner) {
    this.internalVisualDesigner = ivd;
    this.internalVisualDesigner.subscribe((x) => {
      this.selectedElement = x.pivotSelectedElement;
    })
    this.$emit("ivd-loaded", ivd);
  }
}
</script>

<template>
  <div class="metaphor-designer">
    <div class="internal-designer-area">
      <InternalVisualDesignerComponent
        ref="ivsComponent"
        initialSrc="/editortests/anchoring.html"
        @ivd-created="registerInternalVisualDesigner"
      />
    </div>

    <div v-if="internalVisualDesigner" v-show="rightElementEditor" class="element right-panel">
      <!-- <PageEditor ref="pageEditor"></PageEditor> -->
      <v-sheet class="right-panel-content" dark min-height="100%">
        <h2>Element editor</h2>
        <ElementEditor
          ref="elementEditor"
          :editingElement="selectedElement"
          :internalVisualDesigner="internalVisualDesigner"
        />
      </v-sheet>
    </div>

    <div v-if="internalVisualDesigner" v-show="rightPageEditor" class="page right-panel">
      <v-sheet class="right-panel-content" dark min-height="100%">
        <h2>Page editor</h2>

        <PageEditor :internalVisualDesigner="internalVisualDesigner"></PageEditor>
      </v-sheet>
    </div>
    <div v-if="internalVisualDesigner" v-show="rightEnvironmentEditor" class="environment right-panel">
      <v-sheet class="right-panel-content" dark min-height="100%">
        <!-- <PageEditor ref="pageEditor"></PageEditor> -->
        <h2>Environment editor</h2>Çok yakında
      </v-sheet>
    </div>
  </div>
</template>


<style scoped>
.metaphor-designer {
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
}
.internal-designer-area {
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
}

.right-panel {
  position: relative;
  display: block;
  flex-grow: 0;
  width: 500px;
  overflow: overlay;
}

.right-panel .right-panel-content {
  padding: 15px;
}
.right-panel::-webkit-scrollbar {
  width: 0.7em;
  background-color: #1e1e1e;
}
</style>
