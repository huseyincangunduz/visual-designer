import { ReactiveObject } from './ReactiveObject';

export class ReactiveObjectStore {

    private raws = [];
    private reactives = [];


    public getReactiveObject <T extends Object> (obj : T) 
    {
        let i = this.raws.indexOf(obj);
        if (i == -1){
            i = this.raws.push(obj) - 1;
        }
        if (this.reactives[i] != null){
            this.reactives[i] = new ReactiveObject<T>(obj);
        }
        return this.reactives[i];
    }


    static instance: any;
    
    static generalInstance() {
        if (this.instance != null) this.instance = new ReactiveObjectStore();
        return this.instance;
    }
}