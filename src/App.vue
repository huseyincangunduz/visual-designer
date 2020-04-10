<template>
  <div id="app">
    <v-app dark>
      <metaphor-designer />
    </v-app>

    <!-- <DipperNMabel></DipperNMabel> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import MetaphorDesigner from "./components/MetaphorDesigner.vue";
import DipperNMabel from "./components/Dipper.vue";

@Component({
  components: {
    DipperNMabel,
    HelloWorld,
    MetaphorDesigner
  }
})
export default class App extends Vue {}
</script>

<style lang="scss" >

// @import url("https://fonts.googleapis.com/css?family=Poppins:400,600&display=swap");

// $body-font-family: 'Barlow Condensed', sans-serif;
// $heading-font-family: 'Barlow Condensed', sans-serif;

</style>
