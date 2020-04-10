import ColorChanger from "./ColorChanger.vue";
import Percent from "./Percent.vue";
import OneTypeFont from "./OneTypeFont.vue";
import Vue from 'vue';
export function getComponentByKey(key : string) {
    if (key === "color" || key == "background-color")
    {
        return ColorChanger.name;
    }
    else if(key === "opacity") {
        return Percent.name;
    }
    else if(key === "font") {
        return OneTypeFont.name;
    }
    else return "";
}

export const pluginComponents = {
    ColorChanger, Percent: Vue.component("Percent",Percent), OneTypeFont : Vue.component(OneTypeFont.name, OneTypeFont)
}


