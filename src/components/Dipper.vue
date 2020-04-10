<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Megalo from "../controller/Megalo"
@Component
export default class Dipper extends Vue {
  dinner: string = Megalo.write();
  mabelMode : boolean = false;
  obj = {}
  public toggleMabelMode(){
    this.mabelMode = !this.mabelMode;
  }
  @Watch("obj", {deep: true, immediate: true }) x(n,o){
    // console.info("obj değişti",{n, o} )
    this.$forceUpdate();
  }
  constructor () {
    super();
    let i = 0;
    setInterval(() => { i++; this.obj["a" + i % 10] = i},1000)
  }

}
</script>


<template>
  <div>
    <h4> {{ mabelMode ? "Mabel" : "Dipper"}} </h4>
    <div class="character" @click="toggleMabelMode()">
        <img v-if="!mabelMode" src="../assets/dipper.jpg" />
         <img v-else src="../assets/mabel.png" />
    </div>
    <div v-if="obj.a1">
      {{ obj.a1  }}
    </div>
  </div>
</template>

<style scopped>
  .character img{
    width: 300px;
  }
</style>
