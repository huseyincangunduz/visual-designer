import { ReactiveObject } from '@/controller/REV/ReactiveObject';

export class ReactiveStyleDecleration extends ReactiveObject<CSSStyleDeclaration>{
    public constructor(dec : CSSStyleDeclaration){
        super(dec);
    }
}