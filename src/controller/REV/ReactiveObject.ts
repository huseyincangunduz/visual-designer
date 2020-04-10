import { Subject } from './Base/Subject.class';

export class ReactiveObject<T extends object> extends Subject {

    public object: T;
    public proxy;
    public raw: T;

    constructor(object: T) {
        super();
        this.changeObject(object);
    }

    changeObject(object: T) {
        if (this.raw != null)
            this.raw["____reactiveObject"] = null;
        this.raw = object;

        const prox = new Proxy(object, {
            get: function (target, prop) {
                return Reflect.get(target, prop);
            },
            set: (target, prop, value) => {
                let sonuc = Reflect.set(target, prop, value);
                this.notify(prop);
                return sonuc;
            }
        });
        this.proxy = prox;
        this.object = prox as T;
        this.raw["____reactiveObject"] = this;
        this.notify("object reference change");

    }

    static getFromObject(object) {
        let objectHasRO: IReactiveObjectInjected = object;
        if (objectHasRO.____reactiveObject != null) {
            return objectHasRO.____reactiveObject;
        }
        else {
            return new ReactiveObject(object);
        }
    }
}

export interface IReactiveObjectInjected {
    ____reactiveObject: ReactiveObject<any>;
}