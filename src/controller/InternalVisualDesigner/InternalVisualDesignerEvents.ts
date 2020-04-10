export type EventType =  "selected" | "resized" | "moved" | "updated" | "enter-text-edit" | "exit-text-edit"

export interface IIvdEvent {
    eventType : EventType;
    pivotSelectedElement : HTMLElement;
    selectedElements : HTMLElement[];
}

export class IvdEvent implements IIvdEvent {
    public constructor(
        public eventType : EventType,
        public pivotSelectedElement : HTMLElement,
        public selectedElements : HTMLElement[],
        
    ){

    }
}