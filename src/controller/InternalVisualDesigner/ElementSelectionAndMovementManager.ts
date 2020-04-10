import { ElementMovementHandler } from './ElementMovementHandler';
import { ElementResizeHandler } from './ElementResizerHandler';

class ElementSelectionAndMovementManager {


  MainWinDocument: Document;
  designerIframeDocument: Document;
  designerIframeWindow: Window;
  iframeElement: Element;
  elementMovementHandler: ElementMovementHandler;
  selectedElements: Array<Element> = [];
  resizeHandler: ElementResizeHandler;
  movementEnabled = true;

  public constructor(designerIframe: HTMLIFrameElement, foregroundElement: HTMLDivElement) {
    this.designerIframeDocument = designerIframe.contentDocument;
    this.designerIframeWindow = designerIframe.contentWindow;
    this.elementMovementHandler = new ElementMovementHandler(designerIframe);
    this.elementMovementHandler.eventHandlerSetter.setOnMovedCallback(
      (elements: HTMLElement[], pivot: HTMLElement) => {
        this.eventHandlers.onMoved(elements, pivot);
      }
    )


    this.resizeHandler = new ElementResizeHandler(designerIframe, foregroundElement);
    this.resizeHandler.eventHandlerSetter.setOnResizedCallback((elements: HTMLElement[], pivot: HTMLElement) => {
      this.eventHandlers.onResized(elements, pivot)
    })


    this.addEventsOnDocument();
  }


  isIframeElementMovable(targetElement_: HTMLElement) {
    let targetElementComputedStyle = this.designerIframeWindow.getComputedStyle(targetElement_);
    return targetElement_ != this.designerIframeDocument.body && targetElement_ != this.designerIframeDocument.documentElement
      && targetElementComputedStyle.position != "static"
  }


  mouseDownEvent: (this: Document, ev: MouseEvent) => any = (ev) => {
    if (this.movementEnabled) {

      //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
      if (ev.target instanceof this.designerIframeWindow.HTMLElement && ev.target != this.designerIframeDocument.documentElement) {

        this.clearSelectedElements();
        //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
        let targetElement_: HTMLElement = ev.target;
       
        if (this.isIframeElementMovable(targetElement_)) {
          this.elementMovementHandler.hold(ev, this.selectedElements);
        }
        this.selectIFrameElement(targetElement_);
        this.resizeHandler.hideDots();
      }

    }

  };
  mouseMoveEvent: (this: Document, ev: MouseEvent) => boolean = (ev) => {
    if (this.elementMovementHandler.isHolded()) {
      let moved = this.elementMovementHandler.move(ev);
      if (moved) {
        this.resizeHandler.updateDots();
      }
      ev.preventDefault();
      return true; //Eğer moved ise true dönecek. text seçilebilmesi için false dönmesi gerekmekte. Text editing sıkıntı olmasın diye

    }
    return false;

  };
  mouseUpEvent: (this: Document, ev: MouseEvent) => any = (ev) => {

    this.elementMovementHandler.release();
    this.resizeHandler.updateDots();
  };


  eventHandlers = {
    onResized: (elements: HTMLElement[], pivot: HTMLElement) => {

    },
    onSelected: (element, pivot) => {

    },
    onMoved: (elements: HTMLElement[], pivot: HTMLElement) => {

    }
  }

  eventHandlerSetter = {
    setOnResizedCallback: (callback) => {
      this.eventHandlers.onResized = callback;
    },

    setOnMovedCallback: (callback) => {
      this.eventHandlers.onMoved = callback;
    },
    setOnSelectedCallback: (callback: (element, pivot) => any) => {
      this.eventHandlers.onSelected = callback;
    }
  }

  /** MovementHandler devre dışı bırakır
   * That makes Movement Handler disabled
   */
  public pause() {
    this.movementEnabled = false;
    this.resizeHandler.select(null);
  }

  /** MovementHandler'ı tekrar devreye girmesini sağlar
   * That makes Movement Handler enabled again
   */
  public continue() {
    this.movementEnabled = true;
  }




  clearSelectedElements() {
    while (this.selectedElements.length > 0) {
      this.selectedElements.pop();
    }
  }

  addEventsOnDocument() {

    this.designerIframeDocument.addEventListener("mousedown", this.mouseDownEvent);
    this.designerIframeDocument.addEventListener("mousemove", this.mouseMoveEvent);
    this.designerIframeDocument.addEventListener("mouseup", this.mouseUpEvent);
    this.designerIframeDocument.addEventListener("scroll", () => {
      this.resizeHandler.updateDots();
    });
  }


  selectIFrameElement(el: HTMLElement, ): void {
    this.selectedElements.push(el);
    const targetElement_ = el;
    
    let sadeceVurgulama = !this.isIframeElementMovable(el)

    this.resizeHandler.select(targetElement_, sadeceVurgulama);
    this.eventHandlers.onSelected(this.selectedElements, targetElement_);
  }


}

export { ElementSelectionAndMovementManager };
