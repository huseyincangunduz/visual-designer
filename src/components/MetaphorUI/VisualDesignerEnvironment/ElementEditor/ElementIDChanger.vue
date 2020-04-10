<template>
  <div class="id-changer" style="width: 400px">
    <v-snackbar v-model="snackbar" >
      {{ errMesage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-container>
    
      <v-row>
        <v-col cols="12" sm="12"><div>Element ID</div></v-col>
        <v-col cols="12" sm="8">
          <v-text-field dense solo single-line v-model="id" placeholder="Type new ID for element" 
          :error="isError" :success="isSuccess" style="width: 400px;"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn dark small @click="idChanged()">Change</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <div></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { InternalVisualDesigner } from "@/controller/InternalVisualDesigner/InternalVisualDesigner";
import { Prop, Watch } from "vue-property-decorator";
@Component({})
export default class ElementIDChanger extends Vue {
  @Prop({ default: null }) editingElement: HTMLElement;
  @Prop({ default: null }) internalVisualDesigner: InternalVisualDesigner;
  id: string = "";
  isError = false;

  errMesage: string = "";
  snackbar = false;
  isSuccess: boolean = false;

  @Watch("editingElement") editingElementChanged() {
    // this.$forceUpdate();
    this.id = this.editingElement.id;
  }


  idChanged() {
    const idChangeRequest = this.internalVisualDesigner.pageCore.setIDRequest(
      this.editingElement,
      this.id
    );

    this.errMesage = idChangeRequest.message;
    this.isError = !idChangeRequest.success;
    this.isSuccess = !this.isError;
    this.snackbar = true;
  }
}
</script>