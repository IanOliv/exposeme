export interface iDispatcher {
    private id:number
    private  callbacks:{[name:string|number]}
    register(callback:Function):number
    unregister(id:number):void
    dispatch(payload:unknown):void
}


export interface iPayload{
    type:string
    data?:any
}

