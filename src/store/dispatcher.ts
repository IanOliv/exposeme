import { Singleton } from "@decorators/index";
import { iDispatcher } from "@types";
import {dispatch  } from "./../store/dispatcher";


export class Dispatcher implements iDispatcher{
    id:number
    callbacks:{[name:string]:Function}

    constructor(){
        this.id =0
        this.callbacks={}
    }

    register(callback: Function): number {
       this.callbacks[this.id]=callback
       return this.id++
    }
    unregister(id: number|string): void {
        delete this.callbacks[id]
    }
    dispatch(payload?: unknown): void {
        Object
        .keys(this.callbacks)
        .forEach(id=>{
            this.callbacks[id](payload)
        })
    }
    addClients(){

    }

}


export  const dispatch =new Dispatcher()
