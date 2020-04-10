import { PageCore } from "@/controller/InternalVisualDesigner/PageCore/PageCore";

export interface IWidthBreakpoint {

}
export class ResponsiveWidthBreakpoint implements IWidthBreakpoint {


    public getWidthApproach(): "min" | "max" {
        return this.width > 992 ? "min" : "max";
    }

    public constructor(public width: number, public relatedRule: CSSMediaRule, public secondWidth?: number) {

    }

    public toString() {
        return this.width + "px";
    }

}
export class DefaultWidthBreakpoint implements IWidthBreakpoint {

    public constructor(public initialWidth : number){

    }

    public toString() {
        return "default";
    }
}

export class WidthBreakpointsManager {
    defaultWidthBreakpoint: DefaultWidthBreakpoint;
    getSelectedBreakpoint() {
        return this.selectedBreakpoint;
    }


    public constructor(public editingIframeWindow: Window,
        public editingStylesheet: CSSStyleSheet,
        public pageCore: PageCore,
        public defaultWidth = 1200) {
        this.refreshBreakpoints();
    }
    protected selectedBreakpoint: IWidthBreakpoint;

    public widthBreakpoints: IWidthBreakpoint[];
    public refreshBreakpoints() {
        this.defaultWidthBreakpoint = new DefaultWidthBreakpoint(this.defaultWidth);
        let mediaRulesArray : IWidthBreakpoint[] = [this.defaultWidthBreakpoint];
        for (let index = 0; index < this.editingStylesheet.cssRules.length; index++) {
            const styleRule = this.editingStylesheet.cssRules[index];
            if (styleRule instanceof CSSMediaRule || styleRule instanceof this.editingIframeWindow["CSSMediaRule"]) {
                //@ts-ignore
                let mediaRule: CSSMediaRule = styleRule;
                let regexResult = mediaRule.conditionText.match(/\((.*?)\)[ ]*((and[ ]*\((.*?)\))|)/);
                if (regexResult && regexResult[1]) {
                    let ilkSonuc = regexResult[1];
                    let ilkSonucRegex = ilkSonuc.match(/(max|min)-(width)[\s]*:[\s]*([0-9]*)([A-Za-z]*)/);
                    if (ilkSonucRegex && ilkSonucRegex[2] == "width" && ilkSonucRegex[4] == "px") {
                        let widthInt = parseInt(ilkSonucRegex[3]);
                        if (!isNaN(widthInt))
                            mediaRulesArray.push(new ResponsiveWidthBreakpoint(widthInt, mediaRule));
                    }

                }

            }
        }
        this.widthBreakpoints = mediaRulesArray;
        
    }

    public selectBreakpoint(b: IWidthBreakpoint) {
        this.selectedBreakpoint = b;
        this.pageCore.internalVisualDesigner.onBreakpointSelected(b);
        //this.page
    }

    public selectDefault(){
        this.selectBreakpoint(this.defaultWidthBreakpoint);
    }
}
