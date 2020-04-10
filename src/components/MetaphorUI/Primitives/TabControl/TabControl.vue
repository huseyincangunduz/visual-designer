<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import TabPage from "./TabPage.vue";

@Component({
  name: "tab-control",
  components: {
    TabPage
  }
})
export default class TabControl extends Vue {
  tabs: Array<TabPage | Vue> = this.$children ? this.$children : [];
  selected: TabPage = null;
  selectTab(selectedTab) {
    this.tabs.forEach(tab => {
      if (tab instanceof TabPage) {
        if (tab.name == selectedTab.name) {
          this.selected = selectedTab;
        }
        tab.isActive = tab.name == selectedTab.name;
      }
    });
  }
}
</script>

<template>
  <div class="mdl-layout--fixed-tabs">
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
        <div class="mdl-tabs__tab-bar">
            <a v-for="(tab, index) in tabs" v-bind:key="index" @click="selectTab(tab)" class="mdl-tabs__tab" :class="{'is-active': tab.isActive}">
                {{ tab.name }}
            </a>
        </div>
    
        <slot></slot>
    </div>
</div>
</template>