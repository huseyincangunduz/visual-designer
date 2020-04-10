<template>
  <div class="style-modifiers">
    <div class="icon">
      <v-btn
        v-if="styleObject.subModifiers && styleObject.subModifiers.length"
        text
        icon
        @click="expanded = !expanded"
      >
        <v-icon>{{ expanded ? 'expand_more' : 'chevron_right' }}</v-icon>
      </v-btn>
    </div>

    <span class="monospace-area">
      <span>
        {{styleObject.styleKey}} :
        <span
          contenteditable="true"
          :styleKey="styleObject.styleKey"
          @focus="(e) => editingTxt = e.target"
          @blur="styleValueOnBlur"
          @paste="pasteIntoEditText"
          @keydown="onStyleValueKeyDown"
        >{{ styleObject.styleValue }}</span>
        <!-- <input type="text" :value="cssStylesReactive.object[item.styleKey]"/>  -->
      </span>
      ;
    </span>

    <v-btn
      v-if="getComponentByKey_(styleObject.styleKey)"
      @click="showVisualStyler = !showVisualStyler"
      x-small
    >
      <v-icon x-small>mdi-pencil</v-icon>
    </v-btn>
    <v-btn color="red" text icon @click="() => removeStyle(styleObject.styleKey)">
      <v-icon>close</v-icon>
    </v-btn>
    <div style="position: relative; left: 54px;" v-if="getComponentByKey_(styleObject.styleKey)">
      <component
        :is="getComponentByKey_(styleObject.styleKey)"
        v-show="showVisualStyler"
        :styleObject="styleObject"
        @style-updated="onStyleUpdated"
      ></component>
    </div>

    <div
      class="sub-modifiers"
      v-if="expanded && styleObject.subModifiers && styleObject.subModifiers.length > 0"
    >
      <StyleCode
        v-for="(value, index) in styleObject.subModifiers"
        :key="index"
        :styleObject="value"
        @style-updated="onStyleUpdated"
      ></StyleCode>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { StyleObject } from "../../../controller/UIHelper/StyleObjectCollection";
import ColorChanger from "./Plugin/ColorChanger.vue";
import StyleRuleSubList from "./StyleRuleSubList.vue";
import { getComponentByKey, pluginComponents } from "./Plugin/PluginService";

@Component({
  components: {
    ColorChanger,
    StyleRuleSubList
  },
  name: "StyleCode"
})
export default class StyleCode extends Vue {
  @Prop() styleObject: StyleObject;
  expanded = false;
  showVisualStyler = false;
  editingTxt: HTMLElement = null;
  onSet = false;
  visualStylerComponentName: string;

  styleValueOnBlur(e) {
    if (e.target instanceof HTMLElement) {
      if (!this.onSet) {
        let key = e.target.getAttribute("styleKey");
        e.target.textContent = this.styleObject.styleValue;
      }
    }
  }

  onStyleValueKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLElement) {
      if (e.keyCode == 13) {
        let key = e.target.getAttribute("styleKey");

        this.onStyleUpdated(new StyleObject(key, e.target.innerText));
        this.onSet = true;
        e.target.blur();
        return true;
      } else {
        this.onSet = false;
      }
    }
  }

  pasteIntoEditText(e: ClipboardEvent) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    // insert text manually
    document.execCommand("insertHTML", false, text);
  }

  removeStyle(key: string) {
    // console.info("remove " + key);
    this.onStyleUpdated(new StyleObject(key, ""));
  }
  getComponentByKey_(key: string) {
    if (!this.visualStylerComponentName)
      this.visualStylerComponentName = getComponentByKey(key);
    return this.visualStylerComponentName;
  }
  onStyleUpdated(s: StyleObject) {
    this.$emit("style-updated", s);
    // this.styleObject = s;
  }
}
</script>
<style scoped>
:root {
  --metaphor-left: 50px;
  --metaphor-left-minus: -50px;
}
.icon {
  display: inline-block;
  left: var(--metaphor-left-minus);
  width: 46px;
}
.style-modifiers {
  width: 400px;

}
.sub-modifiers {
  width: 400px;
  position: relative;

  opacity: 0.9;

  width: 100%;
}
.monospace-area {
  font-family: monospace;
}
</style>
