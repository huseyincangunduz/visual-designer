import { TextControlling } from "@/controller/Utils";
import { AbsoluteAnchorer } from "@/controller/InternalVisualDesigner/PageCore/Styles/AbsoluteAnchorer";
import { StylesheetRuleOperations, StyleRuleState } from "@/controller/InternalVisualDesigner/PageCore/Styles/StylesheetRuleOperations";
import { PageCore } from "@/controller/InternalVisualDesigner/PageCore/PageCore.js";
import { ResponsiveWidthBreakpoint } from './WidthBreakpointsManager';
import Vue from 'vue';
import { IReactiveObjectInjected, ReactiveObject } from '@/controller/REV/ReactiveObject';

/** İşleme parametresi - İnline stilleri belli bir şekilde derin kopyalama yapar. */
export class CommitParameter {
    public styleKeys: string[];
    public styleValues: { value: string; priority: string }[];
    public removeKeys: string[];
    constructor() {
        this.styleKeys = [];
        this.styleValues = [];
        this.removeKeys = [];

    }
    public addProperty(key: string, val: string, priority: string = "") {
        if (TextControlling.isNotEmpty(val)) {
            this.styleValues[key] = { value: val, priority: priority };
            this.addToKeys(key);
            this.removeFromWillBeRemovedArray(key);
        }
        else {
            this.styleValues[key] = null;
            this.addToKeys(key);
            this.addToWillBeRemoved(key);
        }
    }
    removeFromWillBeRemovedArray(key: string) {
        let removeFromWillRemovedIndex = this.removeKeys.indexOf(key);
        if (removeFromWillRemovedIndex > -1) {
            this.removeKeys.slice(removeFromWillRemovedIndex, removeFromWillRemovedIndex + 1)
        }
    }
    addToWillBeRemoved(key: string) {
        let removedKeys = this.removeKeys.indexOf(key);
        if (removedKeys == -1)
            this.removeKeys.push(key);
    }
    addToKeys(key: string) {

        if (this.styleKeys.indexOf(key) == -1) {
            this.styleKeys.push(key);
        }

    }
    public dontTouch(key: string) {
        this.removeFromWillBeRemovedArray(key);
    }
}



export class StyleOtomator {
    editingStyleSheet: CSSStyleSheet;
    editingIframeDocument: Document;
    editingIframeWindow: Window;
    stylesheetRuleOperations: StylesheetRuleOperations;
    pageCore: PageCore;


    constructor(editingIframeWindow_: Window, editingStyleSheet_: CSSStyleSheet, ops: StylesheetRuleOperations, pageCore: PageCore) {
        this.editingStyleSheet = editingStyleSheet_;
        this.editingIframeDocument = editingIframeWindow_.document;
        this.editingIframeWindow = editingIframeWindow_;
        this.stylesheetRuleOperations = ops;
        this.pageCore = pageCore;
    }


    commitStyleElement(editingElement: HTMLElement, ruleState: StyleRuleState) {
        const breakpoint = this.pageCore.widthBreakpointsManager.getSelectedBreakpoint();
        let medRul: CSSMediaRule | null = null;
        if (breakpoint instanceof ResponsiveWidthBreakpoint)
            medRul = breakpoint.relatedRule;


        let elementInlineStyle = editingElement.style,
            elementRelatedStyle = this.findRule(editingElement, medRul, ruleState),
            elementComputedStyles = this.editingIframeWindow.getComputedStyle(editingElement);
        //console.log({elementInlineStyle, relatedCSSRules: elementRelatedStyle.style});
        //TODO: Stylesheet'e işlenecek olan bir object yarat ve element inline style'i sıfırla

        let commitParam = new CommitParameter();
        for (let index = 0; index < elementInlineStyle.length; index++) {
            const key = elementInlineStyle[index];
            commitParam.styleValues[key] = { value: elementInlineStyle.getPropertyValue(key), priority: elementInlineStyle.getPropertyPriority(key) }
            commitParam.styleKeys.push(key);
        }


        //@ts-ignore
        this.adaptAnchoring(elementRelatedStyle, commitParam, editingElement, elementComputedStyles);
        //TODO: Convert measure units

        //@ts-ignore
        this.commitStyles(commitParam, elementRelatedStyle, editingElement);
        //
        // console.log({commitParam, relatedCSSRules: elementRelatedStyle.cssText});


    }
    commitStyles(commitParam: CommitParameter, elementRelatedStyle: CSSStyleRule, editingElement: HTMLElement) : void {
        const reactived = ReactiveObject.getFromObject(elementRelatedStyle.style);
        commitParam.styleKeys.forEach(key => {

            if (commitParam.styleValues[key] != null) {

                let styleVals = commitParam.styleValues[key];
                elementRelatedStyle.style.setProperty(key, styleVals["value"], styleVals["priority"]);
                if (reactived != null) {
                    reactived.object[key] = styleVals["value"];
                }
                //Vue.set(elementRelatedStyle.style, key, styleVals["value"]);

            }
            else if (commitParam.removeKeys.indexOf(key) > -1) {
                reactived.object[key] = null;
                //Vue.set(elementRelatedStyle.style, key, null);
            }
            editingElement.style.setProperty(key, null);
        });
    }



    //#region util functions for style editing, circulation

    /**
    * Function adaptAnchoring
    * TR: Satır içinde tanımlanmış element stillerinden oluşturulan CommitParam
    * objesini Stil sayfası içindeki
    * stillere sağ/sol uzanma uyarlaması yapmaktadır.
    * Rivayetlere göre bu fonksiyon, kullanıldığında +1 güç sağlar. &#x85;
    * EN-US: CommitParam object created from element styles defined in the line makes
    * adaptations such as right / left anchoring to the styles in the Style sheet.
    * According to rumors, this function provides +1 power when used.
    * @param elementRelatedStyle element that is being edited style rule contained at edited style sheet (by id)
    * @param commitParam Styles that will be commited to Style Rule contained at Style sheet
    * @param editingElement element that is being changed style
    */
    adaptAnchoring(elementRelatedStyle: CSSStyleRule, commitParam: CommitParameter, editingElement: HTMLElement, computedStyle: CSSStyleDeclaration) {
        //Sağa sola yaslanma olayına karar ver

        AbsoluteAnchorer.modify(elementRelatedStyle.style, computedStyle, commitParam, editingElement);
        return;

    }

    findRuleWithElementAncestor(editingElement: HTMLElement,parentElement : HTMLElement, enabledMediaRule: CSSMediaRule, ruleState: StyleRuleState) {
        // console.info("findRuleWithElementAncestor")
        this.pageCore.automaticIDChange(editingElement);
        return this.stylesheetRuleOperations.getRelatedStyleRuleWithParent(
            editingElement,enabledMediaRule,ruleState,parentElement
        );
    }

    findRule(editingElement: HTMLElement, enabledMediaRule: CSSMediaRule, ruleState: StyleRuleState) {
        //Eğer elementin ID'i yoksa yeni ID belirler. Bunun için ise te
        //ne kadar kendi taginde element varsa sonundaki sayı okadar olur
        //TODO: Element isimlendirmesini başka fonksiyonda yap
        this.pageCore.automaticIDChange(editingElement);
        return this.stylesheetRuleOperations.getRelatedStyleRule( editingElement, enabledMediaRule, ruleState)
    }


    //#endregion

}


