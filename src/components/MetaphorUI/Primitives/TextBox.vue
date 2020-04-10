<template>
  <input
    ref="inp"
    v-if="false /*changeByPressEnter*/"
    :value="text"
    class="text-box"
    type="text"
    xplaceholder="placeHolder"
    minlength="1"
    name="edit"
    @keydown="onKeyDown"
    @blur="lostFocus"
  />
  <!-- Her metin değiştiğinde text özelliği de  değişecek -->
  <input
    v-else
    class="text-box"
    type="text"
    v-model="text"
    xplaceholder="placeHolder"
    minsize="1"
    name="edit"
    ref="inp"
    @keydown="onKeyDown"
    @blur="lostFocus"
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "text-box"
})
export default class TextBox extends Vue {
  @Prop() text: string;
  @Prop({default: ""}) placeHolder: string;
  @Prop({default: false}) changeByPressEnter: boolean;
  contentEditable: any;

  constructor() { super(); }
  mounted() {
    this.setInputWidth();
    // super.mounted();
  }
  //FUNS
  setTextBoxMinWidth() {
    let editingSpan = this.$refs.textEditSpan;
    if (editingSpan instanceof HTMLSpanElement) {
      if (editingSpan != null) {
        if (this.contentEditable) {
          editingSpan.style.minHeight = getComputedStyle(editingSpan).fontSize;
        } else {
          editingSpan.style.minHeight = null;
        }
      }
    }
  }

  setText(newText) {
    this.text = newText;
    //Artık text değiştiğinde otomatik olark emitleniyor. this.emit burada yok
    //this.$emit("textchanged", newText, oldText);
  }
  //EVENTS
  lostFocus(e) {
    e.target.value = this.text;
    // this.exitTextEditing();
  }

  onKeyDown(e: KeyboardEvent) {
    let target: HTMLInputElement;
    if (e.target instanceof HTMLInputElement) {
      target = e.target;
      let oldText = this.text;
      if (this.changeByPressEnter) {
        if (e.keyCode == 13) {
          this.setText(target.value);
          this.$emit("user-textchanged", this.text, oldText);
        } else if (e.keyCode == 27) {
          target.value = this.text;
        }
      } else {
        this.$emit("user-textchanged", this.text, oldText);
        this.setInputWidth();
      }
    }
  }
  setInputWidth() {
    let target = this.$refs.inp;
    if (target instanceof HTMLInputElement) {
      target.size = 1 + (target.value.length > 5 ? target.value.length : 5);
    }
  }

  onDoubleClick(e: MouseEvent) {
    this.contentEditable = true;
    this.setTextBoxMinWidth();

    //this.$refs.textEditSpan.focus();
    e.preventDefault();
  }
  onFocusLost(e) {
    // this.exitTextEditing();
  }
}
</script>


<style scoped>
input.text-box {
  display: inline;
  background: inherit;
  color: inherit;
  border: 1px solid transparent;
  padding: 1px;
}
input.text-box:hover {
  border-color: rgba(255, 255, 255, 25);

  border-radius: 2px;
}
</style>