



import { ElementSelectionAndMovementManager } from './ElementSelectionAndMovementManager';
import { ElementTextEditHandler } from "./ElementTextEditHandler";
import { PageCore } from './PageCore/PageCore';
import { StyleRuleState } from './PageCore/Styles/StylesheetRuleOperations';
import { ResponsiveWidthBreakpoint, DefaultWidthBreakpoint, IWidthBreakpoint } from './PageCore/Styles/WidthBreakpointsManager';
import InternalVisualDesignerComponent from "@/components/MetaphorUI/InternalVisualDesignerComponent.vue"
import { ReactiveObject } from '../REV/ReactiveObject';
import {Observable, Subject} from "rxjs";
import { IvdEvent,IIvdEvent, EventType } from './InternalVisualDesignerEvents';

const EDITING_STYLESHEET_ID = "metaphor-main-editing-stylesheet";
export class InternalVisualDesigner extends Subject<IIvdEvent> {

    /** Internal Visual Designer (İç görsel tasarımcı) başlatıldı mı? */
    initialized: boolean = false;
    /** Bağlı olunan Vue Componenti */
    internalDesignerComponent: InternalVisualDesignerComponent | any;
    /** İçerisinde IVD(İGT) saklanan element */
    containerHTMLElement: HTMLDivElement;
    /**Varsayılan olarak düzenlenen CSS Sayfası dosyası.  */
    mainEditingStyleSheet: CSSStyleSheet;
    /** Düzenlenen Iframe Dökümanı */
    editingIframeDocument: HTMLDocument;
    /** Düzenlenen Iframe globalleri */
    editingIframeWindow: Window;
    /** Element seçimleri ve hareket ettirme, yeniden boyutlandırma gibi olaylarla ilgili olan özel sınıftır. Bu sınıfın içerisinde; Iframe'de açılan elementlere bir takım görev
     * yükleyerek bazı eventlara sahip olacaktır.
     */
    styleState: StyleRuleState = "normal";

    elementSelectionMovementHandler: ElementSelectionAndMovementManager;
    /** HTML İçindeki metinleri düzenlemek ile görevli sınıftır. Bu Iframe içerisindeki elementlere event ekleyerek çalışmaktadır. */
    textEditingHandler: ElementTextEditHandler;
    /** PageCore */
    pageCore: PageCore;
    /** Yeniden boyutlandığında */
    selectedElementStyle: ReactiveObject<CSSStyleDeclaration | {}>;



    pivot: HTMLElement;
    allSelectedElements : HTMLElement[];
    defaultWidth: number;

    public constructor(bckgDivisionElement: HTMLDivElement, iframeElement: HTMLIFrameElement, frgDivisionElement: HTMLDivElement) {
        super();
        if (frgDivisionElement != null && iframeElement != null)
            this.initialize(bckgDivisionElement, iframeElement, frgDivisionElement);
    }

    private onResized = (element, pivot) => {
        //console.info("resized: ");
        //console.info(pivot);
        //Resize'dan sonra işleme (committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) gerçekleştirilir
        this.pageCore.commitStyleElement(pivot, "normal");

        //onResized olarak emit edilir (üst sınıflar tarafından ayarlanan onResized eventi çalıştırılır)
        this.update("resized");
    }
    /**Haraket ettirildiğinde */
    private onMoved = (element, pivot) => {
        // console.info("moved: ");
        // console.info(pivot);
        //Haraket ettirmeden sonra işleme (committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) gerçekleştirilir
        this.pageCore.commitStyleElement(pivot, "normal");
        this.update("moved");
    }
    private onSelected = (elements, pivot) => {
        //onSelected olarak emit edilir (üst sınıflar tarafından ayarlanan onSelected eventi çalıştırılır)

        this.pivot = pivot;
        this.styleState = "normal";
        this.allSelectedElements = elements;
        this.updateElementStyleRule();
        this.update("selected");
    }



    updateElementStyleRule() {
        // console.info(this.styleState);
      if (this.pivot) {
        const currentMediaRule = this.relatedMediaRule();
        let x = this.pageCore.styleOtomation.findRule(
          this.pivot,
          currentMediaRule,
          this.styleState
        );
        if (x instanceof this.editingIframeWindow["CSSStyleRule"]) {
          //@ts-ignore
          let styleDecleration : CSSStyleDeclaration = x.style;
          this.selectedElementStyle.changeObject(styleDecleration);
        }
      }

    }
    relatedMediaRule() {
        const wb =  this.pageCore.widthBreakpointsManager.getSelectedBreakpoint();
        let relatedMediaRule : CSSMediaRule
        if (wb && wb instanceof ResponsiveWidthBreakpoint){
         relatedMediaRule = wb.relatedRule
        }
        return relatedMediaRule;
    }

    getElementStylesWithAncestor(parent : HTMLElement, state : "hover" | "active") {
      if (this.pivot) {
        const wb =  this.pageCore.widthBreakpointsManager.getSelectedBreakpoint();
        const relatedMediaRule = this.relatedMediaRule();
        return this.pageCore.styleOtomation.findRuleWithElementAncestor(this.pivot,
          parent,relatedMediaRule,state);
      }

    }

    private onEnteredTextChangeMode = (editingElement) => {
        this.elementSelectionMovementHandler.pause()
        this.next(new IvdEvent("enter-text-edit",this.pivot,this.allSelectedElements))
    }
    private onExitedTextChangeMode = (editingElement) => {
        this.elementSelectionMovementHandler.continue()
        this.next(new IvdEvent("exit-text-edit",this.pivot,this.allSelectedElements))
    }



    /** IVD'yi asıl başlatan fonksiyondur
     * inşa edilirken eğer foreground div ve background div null gelmediyse zaten otomatik olarak başlatılacaktır.
     */
    initialize(bckgDivisionElement: HTMLDivElement, iframeElement: HTMLIFrameElement, frgDivisionElement: HTMLDivElement, defaultWidth = 1200) {
        this.editingIframeWindow = iframeElement.contentWindow;
        this.editingIframeDocument = this.editingIframeWindow.document;

        this.elementSelectionMovementHandler = new ElementSelectionAndMovementManager(iframeElement, frgDivisionElement);
        this.elementSelectionMovementHandler.eventHandlerSetter.setOnMovedCallback(this.onMoved);
        this.elementSelectionMovementHandler.eventHandlerSetter.setOnResizedCallback(this.onResized);
        this.elementSelectionMovementHandler.eventHandlerSetter.setOnSelectedCallback(this.onSelected);

        this.textEditingHandler = new ElementTextEditHandler(iframeElement);
        this.textEditingHandler.eventHandlerSetter.setOnEnteredTextChangeMode(this.onEnteredTextChangeMode);
        this.textEditingHandler.eventHandlerSetter.setOnExitedTextChangeMode(this.onExitedTextChangeMode);
        this.defaultWidth = defaultWidth;
        this.pageCore = new PageCore(this, defaultWidth);

        this.selectedElementStyle = ReactiveObject.getFromObject({});

        this.initialized = true;

    }

    onBreakpointSelected(b: IWidthBreakpoint) {
        if (b instanceof ResponsiveWidthBreakpoint) {
            this.containerHTMLElement.style.setProperty("width", b.width + "px");
        }
        else if (b instanceof DefaultWidthBreakpoint) {
            this.containerHTMLElement.style.setProperty("width", `${this.defaultWidth}px`);
        }
        this.update();

    }

    public selectElement(pivot : HTMLElement, allSelectedElements : HTMLElement[] = []){
      this.elementSelectionMovementHandler.selectIFrameElement(pivot);
    }

    public update(mode : EventType = "updated"){
        this.updateElementStyleRule();
        this.next(new IvdEvent("updated",this.pivot,this.allSelectedElements))
    }

    public static createByDivAndCreate(containerElement: HTMLDivElement,
        internalDesignerComponent = null,
        secondarySrc = "about:blank",
        afterCreated: (ivd: InternalVisualDesigner) => any) {

        let setPositionAbs = (el) => {
            el.style.setProperty("position", "absolute");
        }
        let bckDivElement: HTMLDivElement = document.createElement("div")
        let iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.setAttribute("frameborder", "0");
        let foregroundDivElement: HTMLDivElement = document.createElement("div");
        foregroundDivElement.classList.add("visualdesigner_foreground");
        //applyStyle([bckDivElement]);
        setPositionAbs(foregroundDivElement);
        bckDivElement.style.setProperty("height", "0");
        bckDivElement.style.setProperty("width", "100%");
        iframeElement.style.setProperty("height", "100%");
        iframeElement.style.setProperty("width", "100%");
        containerElement.append(bckDivElement, iframeElement, foregroundDivElement);
        let src = (containerElement.getAttribute("src") != null) ? containerElement.getAttribute("src") : secondarySrc;
        iframeElement.setAttribute("src", src);
        let ivd = new InternalVisualDesigner(null, null, null);
        iframeElement.onload = () => {
            //ivd.refreshElementEditEvents();
            //Sayfa yüklenmeden kurulum yapılmaması daha iyi...

            const metaDefaultWidth = iframeElement.contentDocument.getElementsByName("metaphor-default-width").item(0) as HTMLMetaElement;
            // console.info(metaDefaultWidth)
            let defaultWidth = 1200;
            if (metaDefaultWidth){
                defaultWidth = parseInt(metaDefaultWidth.content, 10) || 1200;
                console.info(defaultWidth)
            }

            ivd.initialize(bckDivElement, iframeElement, foregroundDivElement, defaultWidth);
            ivd.internalDesignerComponent = internalDesignerComponent;
            ivd.containerHTMLElement = containerElement;
            internalDesignerComponent.internalVisualDesigner = ivd;
            afterCreated(ivd);
            ivd.pageCore.widthBreakpointsManager.selectDefault();
        }
    }

}
