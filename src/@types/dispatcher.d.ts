export interface iDispatcher {
    id:number
    callbacks:{[name:string|number]}
    register(callback:Function):number
    unregister(id:number):void
    dispatch(payload:unknown):void
}


export interface iPayload{
    type:string
    data?:any
}

