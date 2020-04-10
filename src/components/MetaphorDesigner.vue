<template>
  <div>
    <!-- <div> <DelayedAnimationBox></DelayedAnimationBox></div> -->
    <div v-if="internalVisualDesigner">
      <v-app-bar dense dark>
        <v-toolbar-title>Page title</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu v-model="selectedWB" :close-on-content-click="true" :nudge-width="200" offset-x>
          <template v-slot:activator="{ on }">
            <v-btn dark v-on="on">
              <v-icon>desktop_windows</v-icon>
              {{ breakpointToString(val) }}
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item
                v-for="(val, index) in breakpoints"
                :key="index"
                @click="selectScreenResolution(val)"
              >
                <v-list-item-avatar>
                  <v-icon>desktop_windows</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{
                    breakpointToString(val)
                    }}
                  </v-list-item-title>
                  <!-- <v-list-item-subtitle>{{  val.getWidthApproach()  }} </v-list-item-subtitle> -->
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-btn
          icon
          :color="showingEditorTab == 'element' ? 'blue' : null"
          @click="() => showingEditorTab = 'element'"
          a
        >
          <v-icon>format_shapes</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="showingEditorTab == 'page'  ? 'blue' : null"
          @click="() => showingEditorTab = 'page'"
        >
          <v-icon>insert_drive_file</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="showingEditorTab == 'environment' ? 'blue' : null"
          @click="() => showingEditorTab = 'environment'"
        >
          <v-icon>apps</v-icon>
        </v-btn>
      </v-app-bar>
    </div>

    <div class="designer">
      <VisualDesignerEnvironment
        :rightElementEditor="showingEditorTab == 'element'"
        :rightPageEditor="showingEditorTab == 'page'"
        :rightEnvironmentEditor="showingEditorTab == 'environment'"
        @ivd-loaded="ivd_ => internalVisualDesigner = ivd_"
        ref="visualDesignerComponent"
      ></VisualDesignerEnvironment>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import VisualDesignerEnvironment from "./MetaphorUI/VisualDesignerEnvironment/VisualDesignerEnvironment.vue";
import { InternalVisualDesigner } from "../controller/InternalVisualDesigner/InternalVisualDesigner";
import {
  ResponsiveWidthBreakpoint,
  IWidthBreakpoint,
  DefaultWidthBreakpoint
} from "@/controller/InternalVisualDesigner/PageCore/Styles/WidthBreakpointsManager";
import { Component } from "vue-property-decorator";

@Component({
  components: { VisualDesignerEnvironment },
  name: "metaphor-designer"
})
export default class MetaphorDesigner extends Vue {

  showElementEditor = false;
  showPageEditor = false;
  showEnvironmentEditor = false;

  showingEditorTab : "element" | "page" | "environment" | "none" = "none";

  internalVisualDesigner: InternalVisualDesigner = null;
  items = ["min 320px", "min 400px", "min 450px"];
  selectedWB = "";
  breakpoints: IWidthBreakpoint[];
  updated() {
    this.setupScreenResolutions();
  }
  breakpointToString(a: IWidthBreakpoint) {
    if (a instanceof DefaultWidthBreakpoint) {
      return "Default (Desktop LG)";
    } else if (a instanceof ResponsiveWidthBreakpoint) {
      let flag = "Mobile XS";
      if (a.width >= 400) {
        flag = "Mobile SM";
      }
      if (a.width >= 450) {
        flag = "Mobile MD";
      }

      if (a.width >= 600) {
        flag = "Mobile LG";
      }

      if (a.width >= 768) {
        flag = "Tablet";
      }
      if (a.width >= 992) {
        flag = "Desktop";
      }
      if (a.width >= 1200) {
        flag = "Desktop LG";
      }
      return flag;
    }
  }
  setupScreenResolutions() {
    let ivd = this.internalVisualDesigner as InternalVisualDesigner;
    let breakpointManager = ivd.pageCore.widthBreakpointsManager;
    let breakpoints = breakpointManager.widthBreakpoints;
    this.breakpoints = breakpoints;
  }
  selectScreenResolution(w: IWidthBreakpoint) {

    this.internalVisualDesigner.pageCore.widthBreakpointsManager.selectBreakpoint(
      w
    );
  }
}
</script>


