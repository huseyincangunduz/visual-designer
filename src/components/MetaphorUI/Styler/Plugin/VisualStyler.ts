import Vue from 'vue';
import { Ref, Prop, Watch } from "vue-property-decorator";
import { StyleObject } from '@/controller/UIHelper/StyleObjectCollection';
export class VisualStyler extends Vue {
 @Prop() styleObject : StyleObject;
 
 emitNewValue(newValue : string) {
    this.$emit("style-updated", new StyleObject(this.styleObject.styleKey, newValue));
 }
 emitNewStyle(obj : StyleObject) {
   this.$emit("style-updated", obj);
}
}