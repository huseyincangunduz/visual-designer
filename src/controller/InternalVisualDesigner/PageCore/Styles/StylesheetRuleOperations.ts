import { TextControlling } from "../../../Utils";

// export enum StyleRuleState {
//     normal, active, hover
// }
export type StyleRuleState = "normal" | "active" | "hover";

export class StylesheetRuleOperations {

    public constructor(public iframeWindow: Window,
        public editingStyleSheet: CSSStyleSheet) {

    }

    getRelatedStyleRule(editingElement: HTMLElement, enabledMediaRule: CSSMediaRule, ruleState: StyleRuleState) {
        let rulelist: CSSRuleList;
        let editingElementIdSel: string = `#${editingElement.id}`,
            selector: Array<string>;
        rulelist = (enabledMediaRule != null) ? enabledMediaRule.cssRules : this.editingStyleSheet.cssRules;
        selector = this.getRequiredSelectorsArray(editingElementIdSel, ruleState);
        let determinedRule: CSSStyleRule | CSSRule;


        for (let i = 0; i < rulelist.length; i++) {
            const currentRule = rulelist.item(i);
            // if (determinedRule != null) break;
            let currentStyleRule: CSSStyleRule;
            if (currentRule instanceof this.iframeWindow["CSSStyleRule"]) {
                //@ts-ignore
                currentStyleRule = currentRule;
                if (this.isSuitableStyleRule(currentStyleRule.selectorText, selector)) determinedRule = currentStyleRule;
            }
        }
        if (determinedRule == null) //Eğer öyle bir şey yoksa yeni ekle
        {
            determinedRule = this.insertNewRule(selector, enabledMediaRule, this.editingStyleSheet);
        }

        return determinedRule;
    }

    getRelatedStyleRuleWithParent(editingElement: HTMLElement, enabledMediaRule: CSSMediaRule, ruleState: StyleRuleState, parentElement: HTMLElement) {
        let rulelist: CSSRuleList;
        let editingElementIdSel: string = `#${editingElement.id}`, parentElementSel: string = `#${parentElement.id}`,
            selector: Array<string>;
        rulelist = (enabledMediaRule != null) ? enabledMediaRule.cssRules : this.editingStyleSheet.cssRules;
        selector = this.getRequiredSelectorsArray(parentElementSel, ruleState).map(v => v + ` ${editingElementIdSel}`);
        let determinedRule: CSSStyleRule | CSSRule;


        for (let i = 0; i < rulelist.length; i++) {
            const currentRule = rulelist.item(i);
            // if (determinedRule != null) break;
            let currentStyleRule: CSSStyleRule;
            if (currentRule instanceof this.iframeWindow["CSSStyleRule"]) {
                //@ts-ignore
                currentStyleRule = currentRule;
                if (this.isSuitableStyleRule(currentStyleRule.selectorText, selector)) determinedRule = currentStyleRule;
            }
        }
        if (determinedRule == null) //Eğer öyle bir şey yoksa yeni ekle
        {
            determinedRule = this.insertNewRule(selector, enabledMediaRule, this.editingStyleSheet);
        }

        return determinedRule;
    }

    getRuleIndexFromStylesheet(rule: CSSStyleRule, parent: CSSStyleSheet): number {
        for (let index = 0; index < parent.cssRules.length; index++) {
            const element = parent.cssRules.item(index);
            if (element == rule) return index;

        }
        return -1;
    }

    changeSelector(rule: CSSStyleRule, newSelector: string): number {

        let parentRule: {}
        if (rule.parentRule && (rule instanceof this.iframeWindow["CSSGroupingRule"])) {
            // let r : CSSGroupingRule = rule;
            // r.
            /* TODO: Sub rule editing*/
            return -1;
        }
        else if (rule.parentStyleSheet) {
            let parent = rule.parentStyleSheet;
            let text = rule.style.cssText;
            //let selector = rule.selectorText;
            let newIndex = parent.rules.length;
            if (rule instanceof this.iframeWindow["CSSStyleRule"]) {
                newIndex = this.getLastStyleRule(parent.rules);
            }
            let addedCorrect = parent.insertRule(newSelector + `{${text}}`, newIndex);
            parent.removeRule(this.getRuleIndexFromStylesheet(rule, parent));
            return addedCorrect;
        }
    }

    insertNewRule(selector: string[], enabledMediaRule: CSSMediaRule, editingStyleSheet: CSSStyleSheet): CSSStyleRule {
        var determinedRule;
        let cssRuleText = selector.join(", ") + " { }";
        let lastStyleRule = 0, ni = 0;
        let cssRules: CSSRuleList;
        let p: CSSMediaRule | CSSStyleSheet;

        if (enabledMediaRule != null) {
            cssRules = enabledMediaRule.cssRules;
            p = enabledMediaRule;
        } else if (editingStyleSheet != null) {
            cssRules = editingStyleSheet.cssRules;
            p = editingStyleSheet;
        }
        lastStyleRule = this.getLastStyleRule(cssRules)
        ni = p.insertRule(cssRuleText, lastStyleRule);
        // if (enabledMediaRule != null) {



        // }
        // else if (editingStyleSheet != null)
        // {
        //     ni = editingStyleSheet.insertRule(cssRuleText, lastStyleRule);

        // }
        determinedRule = cssRules.item(ni);
        return determinedRule;
    }

    getLastStyleRule(cssRules: CSSRuleList): number {
        let lastStyleRule = 0;
        for (let i = 0; i < cssRules.length; i++) {
            const el = cssRules.item(i);
            if (el instanceof CSSStyleRule) {
                lastStyleRule = i;
            }
        }
        return lastStyleRule;
    }

    isSuitableStyleRule(selectorText: string, selector: string[]): boolean {
        let determine: boolean;
        if (selector.length == 1) {
            var str = selector[0];
            determine = (selectorText == `${str}`);
        }
        else {
            selector.forEach(str => {
                determine = ((
                    selectorText.indexOf(`${str},`) > -1 || selectorText.indexOf(`, ${str},`) > -1 || selectorText.endsWith(`, ${str}`)
                ));
            });
        }
        return determine;
    }

    getRequiredSelectorsArray(editingElementIdSel: string, ruleState: StyleRuleState): string[] {
        let selector: string[];
        switch (ruleState) {
            case "active":
                selector = [`${editingElementIdSel}:active`, `${editingElementIdSel}[metaphor-internal-design-state="active"]`];
                break;
            case "hover":
                selector = [`${editingElementIdSel}:hover`, `${editingElementIdSel}[metaphor-internal-design-state="hover"]`];
                break;
            default:
                selector = [`${editingElementIdSel}`];
        }
        return selector;
    }

    findClassRule(styleClass: string, enabledMediaRule: CSSMediaRule, ruleState: StyleRuleState) {
        let rulelist: CSSRuleList;
        let editingElementIdSel: string = `.${styleClass}`,
            selector: Array<string>;
        rulelist = (enabledMediaRule != null) ? enabledMediaRule.cssRules : this.editingStyleSheet.cssRules;
        selector = this.getRequiredSelectorsArray(editingElementIdSel, ruleState);
        let determinedRule: CSSStyleRule | CSSRule;


        for (let i = 0; i < rulelist.length; i++) {
            const currentRule = rulelist.item(i);
            // if (determinedRule != null) break;
            let currentStyleRule: CSSStyleRule;
            if (currentRule instanceof this.iframeWindow["CSSStyleRule"]) {
                //@ts-ignore
                currentStyleRule = currentRule;
                if (this.isSuitableStyleRule(currentStyleRule.selectorText, selector)) determinedRule = currentStyleRule;
            }
        }
        if (determinedRule == null) //Eğer öyle bir şey yoksa yeni ekle
        {
            determinedRule = this.insertNewRule(selector, enabledMediaRule, this.editingStyleSheet);
        }

        return determinedRule;
    }

    getOddClasses( enabledMediaRule: CSSMediaRule) {
        let   rulelist = (enabledMediaRule != null) ? enabledMediaRule.cssRules : this.editingStyleSheet.cssRules;
        let classes : string[] = [];
        for (let i = 0; i < rulelist.length; i++) {
            const currentRule = rulelist.item(i);
            // if (determinedRule != null) break;
            let currentStyleRule: CSSStyleRule;
            if (currentRule instanceof this.iframeWindow["CSSStyleRule"]) {
                currentStyleRule = currentRule as CSSStyleRule;
                let selectorText = currentStyleRule.selectorText;
                if (selectorText.startsWith(".") && !selectorText.includes(" "))
                    classes.push(selectorText.substring(1));
            }
        }
        return classes;
    }
}