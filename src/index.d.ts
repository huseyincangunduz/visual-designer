
/**
 * Jenerik obje türü, sadece tek tipte veri tutan esnek objeleri tanımlamak için kullanılır
 * @template T saklanacak veri türüdür
 */
declare type GenericObject<T> = {[key: string] : T};

// export interface VueComponent
// {
//     $refs : any;
// }
// export class Vue
// {
//     $refs: any;
//     public constructor(data : Object);
//     public static component(tagname : string, dataDecleration : {}) : VueComponent;
//     public static set(object : Array<any> | Object,key:string,value:string);
// }

