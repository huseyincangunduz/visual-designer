import { InternalVisualDesigner } from '../InternalVisualDesigner';
import { StyleOtomator } from './Styles/StyleOtomator';
import { WidthBreakpointsManager } from './Styles/WidthBreakpointsManager';
import { StylesheetRuleOperations, StyleRuleState } from './Styles/StylesheetRuleOperations';
import { TextUtils, cssSelectorPunctation, TextControlling } from '@/controller/Utils';

const EDITING_STYLESHEET_ID = "metaphor-main-editing-stylesheet";



/**
 * PageCore sınıfı, döküman düzenlemekten çok dökümanın
 * tam olarak genel görünümünü düzenleyen (Width Breakpoints)
 * CSS sınıf kuralları, değişken ekleme çıkarma gibi angarya işler ile
 * ilgilenen sınıftır
 */
export class PageCore {



    public internalVisualDesigner: InternalVisualDesigner;
    protected editingIframeDocument: HTMLDocument;
    protected editingIframeWindow: Window;
    protected mainEditingStyleSheet: CSSStyleSheet;

    /** Stilleri ekleme, çıkarma, işlemek(committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) işleri için kullanılan sınıf */
    public styleOtomation: StyleOtomator;
    public widthBreakpointsManager : WidthBreakpointsManager;
    protected stylesheetRuleOps: StylesheetRuleOperations;

    public constructor(ivd: InternalVisualDesigner, defaultWidth = 1200) {
        this.internalVisualDesigner = ivd;
        this.editingIframeDocument = ivd.editingIframeDocument;
        this.editingIframeWindow = ivd.editingIframeWindow;

        this.mainEditingStyleSheet = this.getMainEditingStyleSheet();
        this.stylesheetRuleOps = new StylesheetRuleOperations(this.editingIframeWindow,this.mainEditingStyleSheet);
        this.styleOtomation = new StyleOtomator(this.editingIframeWindow, this.mainEditingStyleSheet,        this.stylesheetRuleOps,this);
        this.widthBreakpointsManager = new WidthBreakpointsManager(this.editingIframeWindow, this.mainEditingStyleSheet,this, defaultWidth);
    }


    /**
     * Stil kurallarını gezen ve gezerken gezdiği kuralı callback'i o kuralla çalıştıran fonksiyon
     * @param stlSheet Düzenlenen stilşit
     * @param callback Her iterasyonda çalışan fonksiyon. Döngünün devamı için false döndürtün, durdurmak için true döndürtün
     */
    styleRuleCirculation( stlSheet : CSSStyleSheet, callback : (rule : CSSStyleRule) => boolean) {
        let rules = stlSheet.rules;
        for (let i = 0; i < rules.length; i++)
        {
            let rule = rules.item(i);
            //@ts-ignore
            if (rule instanceof this.editingIframeWindow["CSSStyleRule"] && callback(rule)) break;
            //else if (rule instanceof this.editingIframeWindow["CSSMediaRule"] && callback(rule))
        }
    }


    setIDRequest(element : HTMLElement,newElementId : string) : { success: boolean; message: string; } {

        //gelen id geçerlimi diye bakmak

        let isValidId = newElementId.match(new RegExp("(^(([a-z]+)([-_][a-z]+)*)$)"));
        if (isValidId)
        {
            let newIdSelector = "#" + newElementId;
            let idSelector = "#" + element.id;
            let oldIDexpression = new RegExp(`#+(${element.id})(.+?[^A-Za-z0-9-_])`);
            //let newIDexpression = new RegExp(`#+(${newElementId})+[\s*]`,"igm");



            if (this.editingIframeDocument.querySelector(newIdSelector))
            {
                return {success: false, message: "There is same ID in document. So, no."};
            }
            else{
                this.styleRuleCirculation(this.mainEditingStyleSheet, (r) => {
                    let selectorText = r.selectorText;

                    let i = selectorText.indexOf(idSelector);
                    if (i > -1)
                    {
                        //Gerçekten burada element id'si olan bir şey istiyoruz.
                        //yani #mabel ararken #mabel-matiz ya da #mabelxsd bulmayalım
                        //o nedenle amele gibi burada uğraşacağız, orospu çocuğu regex


                        let flag = true;


                        if (flag && i + idSelector.length < selectorText.length)
                        {
                           flag = selectorText.indexOf(idSelector + " ") > -1 || selectorText.indexOf(idSelector + "{") > -1 || selectorText.indexOf(idSelector + "[") > -1
                           || selectorText.indexOf(idSelector + ":") > -1 || selectorText.indexOf(idSelector + "\n") > -1 || selectorText.indexOf(idSelector + ",") > -1 ||
                           selectorText.endsWith(idSelector);

                            //flag = TextUtils.charEqualAllOfOne(selectorText[i + idSelector.length],cssSelectorPunctation);
                        }
                        if (flag)
                        {

                            let newSel = selectorText;
                            let timeout = 0;
                            while(newSel.includes(idSelector) && timeout < 100){
                                newSel = newSel.replace(idSelector, newIdSelector);
                                timeout++;
                            }
                            // console.info(`timeout ${timeout}`)
                            if (newSel.endsWith(idSelector)) newSel = newSel.substring(0,newSel.length - idSelector.length) + newIdSelector;

                            this.stylesheetRuleOps.changeSelector(r,newSel);
                            // console.info(`${selectorText} => ${newSel}`)
                        }

                    }

                    return false;
                });
                element.id = newElementId;
                //this.internalVisualDesigner.onSelected(null,null);
                this.internalVisualDesigner.update();
                return {success: true, message: "Element ID is changed"};
            }


        }
        else{
            return {success: false, message: "Invalid ID"};
        }
    }



    /**
     * getMainEditingStyleSheet
     */
    public getMainEditingStyleSheet(): CSSStyleSheet {
        let stlsheets = this.editingIframeDocument.styleSheets;

        for (let i = 0; i < stlsheets.length; i++) {
            let stylesheet = stlsheets.item(i);
            //@ts-ignore FIXME: iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
            if (stylesheet instanceof this.editingIframeWindow.CSSStyleSheet && stylesheet.ownerNode["id"] == EDITING_STYLESHEET_ID) {
                //@ts-ignore FIXME: iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
                return stylesheet;
            }

        }
        //TODO: Add inserting stylesheet and save code
        throw new Error(`id='${EDITING_STYLESHEET_ID}' tagged sheet is not found`);
    }

    commitStyleElement(pivot: HTMLElement, ruleState: StyleRuleState) {
        this.styleOtomation.commitStyleElement(pivot,ruleState)
    }

    public automaticIDChange(editingElement : HTMLElement)
    {
        if (TextControlling.isEmpty(editingElement.id) && editingElement.ownerDocument != null) {
            let newID = "";
            let doc = editingElement.ownerDocument;
            let ellist = doc.querySelectorAll(editingElement.tagName).length,
                trig = ellist;
            do {
                newID = editingElement.tagName + "-" + trig;
                trig++;
            } while (doc.querySelectorAll(`#${newID}`).length > 0);
            editingElement.id = newID;

        }

    }


}
