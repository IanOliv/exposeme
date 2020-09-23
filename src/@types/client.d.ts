export interface iClient{
            requestId():{[name]:any}
            connect():void
            httpRequest():Promise<{[name]:unknown}>
}
export interface  iClientIdResponse {
    newClientId:string
}



