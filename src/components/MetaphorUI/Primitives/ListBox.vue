<script lang="ts">
import { ViewIndex } from "@/controller/Utils";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "list-box"
})
export default class ListBox extends Vue {
  list: any[] = [];
  selectedItem = null;
  dataShowString: (list: [], index: number) => string = (list, index) => {
    return list[index];
  };

  selectItem(i: number) {
    this.selectedItem = this.list[i];
    this.$emit("item-selected", this.list, i);
  }
  setList(list: Array<any>) {
    this.list = list;
    this.selectedItem = null;
  }
  weightBySelection(item) {
    return this.selectedItem == item ? 700 : 400;
  }
  removeItemByIndex(index: number) {
    let list = this.list;
    let item = list[index];
    list.splice(index, 1);
    this.$emit("item-removed", item, index);
  }
  setDataToString(callback: (list: [], index: number) => string) {
    this.dataShowString = callback;
  }
}
</script>

<template>
  <div class="list-box">
    <ul v-if="list && list.length > 0">
      <li
        v-for="(item, index) in list"
        :key="index"
        @click="selectItem(index)"
        :style="{ fontWeight: weightBySelection(item) }"
      >
        {{ dataShowString(list,index) }}
        <button
          @click="removeItemByIndex(index)"
          class="mdl-button mdl-js-button mdl-button--icon"
        >
          <i class="material-icons">delete</i>
        </button>
      </li>
    </ul>
    <div v-else>There is no items</div>
  </div>
</template>
<style scoped>
.list-box ul {
  list-style-type: none;
  user-select: none;
  cursor: pointer;
  padding-left: 0px;
}

.list-box ul li {
  border: 1px solid rgba(255, 255, 255, 0);
}

.list-box ul li:hover {
  border: 1px solid white;
}
</style>