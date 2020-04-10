<template>
  <v-container fluid dark>
    <div class="area">
      <div class="d-flex">
        <div class="flex-grow-1">
          <v-combobox solo :items="fonts" v-model="selectedFont" @input="fontChanged"></v-combobox>
        </div>
        <div class="flex-grow-0 flex-shrink-0" style="width: 100px; margin-left: 20px">
          <v-combobox solo :items="size" v-model="selectedSize" @input="fontChanged"></v-combobox>
        </div>
      </div>
      <v-btn-toggle v-model="fontStyleToggle" dense @change="ch" dark multiple>
        <v-btn small value="bold">
          <v-icon small>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn small value="italic">
          <v-icon small>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn value="underline" small>
          <v-icon small>mdi-format-underline</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
  </v-container>
</template>

<script lang="ts">
import { VisualStyler } from "./VisualStyler";
import { StyleObject } from "../../../../controller/UIHelper/StyleObjectCollection";
import Component from "vue-class-component";
@Component
export default class OnlyTypeFont extends VisualStyler {
  fonts = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Segoe UI",
    "Roboto",
    "Poppins"
  ];
  selectedFont: string = "";
  fontStyleToggle = [];
  size = ["2em", "1.5em", "1.3em", "1em", "0.8em", "0.7em"];
  selectedSize: string = "";

  mounted() {
    for (let index = 0; index < this.styleObject.subModifiers.length; index++) {
      const subStyleObject = this.styleObject.subModifiers[index];
      switch (subStyleObject.styleKey) {
        case "font-size":
          this.selectedSize = subStyleObject.styleValue;
          break;
        case "font-family":
          this.selectedFont = subStyleObject.styleValue;
          break;
        case "font-weight":
          if (
            subStyleObject.styleValue == "bold" ||
            subStyleObject.styleValue == "700"
          )
            this.fontStyleToggle.push("bold");
          else
            this.fontStyleToggle.splice(this.fontStyleToggle.indexOf("bold"));
          break;
        case "font-style":
          if (
            subStyleObject.styleValue == "oblique" ||
            subStyleObject.styleValue == "italic"
          )
            this.fontStyleToggle.push("italic");
          else
            this.fontStyleToggle.splice(this.fontStyleToggle.indexOf("italic"));
          break;
      }
    }
  }

  fontChanged() {
    this.emitNewStyle(
      new StyleObject(
        "font-family",
        this.selectedFont.replace("Futura", "Helvetica Neue")
      )
    );
    this.emitNewStyle(new StyleObject("font-size", this.selectedSize));
  }
  ch() {
    this.emitNewStyle(
      new StyleObject(
        "font-weight",
        this.fontStyleToggle.indexOf("bold") > -1 ? "bold" : "normal"
      )
    );

    this.emitNewStyle(
      new StyleObject(
        "font-style",
        this.fontStyleToggle.indexOf("italic") > -1 ? "italic" : "normal"
      )
    );
  }
}
</script>

<style scoped>
.area {
  width: 300px;
}
</style>