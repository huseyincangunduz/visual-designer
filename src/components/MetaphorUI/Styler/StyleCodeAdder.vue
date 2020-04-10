<template>
  <span class="full-text" @click="editingTxt.focus()">
    <span
      ref="editingTextbox"
      class="edit-area-textbox"
      contenteditable="true"
      @blur="styleValueOnBlur"
      @paste="pasteIntoEditText"
      @keydown="onStyleValueKeyDown"
    ></span>
  </span>
</template>


<script lang="ts">
import Vue from "vue";
import { Prop, Component, Ref } from "vue-property-decorator";
import { StyleObject } from "@/controller/UIHelper/StyleObjectCollection";

@Component({})
export default class StyleRuleCard extends Vue {
  @Prop() editingElement: HTMLElement;
  onSet = false;
  @Ref("editingTextbox")
  editingTxt: HTMLElement;
  placeholderShowable: boolean = true;
  styleValueOnBlur(e) {
    if (e.target instanceof HTMLElement) {
      if (!this.onSet) {
        let key = e.target.getAttribute("styleKey");
        e.target.textContent = "";
      }
    }
  }

  onStyleValueKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLElement) {
      if (e.keyCode == 13) {
        let innerText = e.target.innerText.replace(";", "");

        let key = "",
          value = "initial",
          important = false;
        let colonIndex = e.target.textContent.indexOf(":");
        if (colonIndex == -1) {
          key = e.target.innerText.trim();
          value = this.editingElement ?  getComputedStyle(this.editingElement).getPropertyValue(key) : "initial";
        } else {
          key = innerText.substring(0, colonIndex);
          value = innerText.substring(colonIndex + 1);
          if (value.endsWith("!important")) {
            important = true;
            value.replace("!important", "");
          }
        }
        this.$emit("style-updated", new StyleObject(key, value));

        e.target.blur();

        return true;
      }
    }
    this.placeholderShowable =
      this.editingTxt && this.editingTxt.innerText.length == 0;
  }

  pasteIntoEditText(e: ClipboardEvent) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    // insert text manually
    document.execCommand("insertHTML", false, text);
  }
}
</script>
<style scoped>
.edit-area-textbox::before {
  content: "Type style for add";
  opacity: 0.6;
}
.edit-area-textbox:focus::before {
  content: "";
}

.edit-area-textbox {
  display: inline-block;
  min-height: 10px;
  outline: 1px dotted white;
  min-width: 100px;
  user-select: initial;
}
/* .full-text {
  display: inline-block;
  min-width: 300px;
 
} */
</style>