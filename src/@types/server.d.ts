
export interface iServer{
    request(req:iRequest,res:iResponse):void
    upgrade(req:iRequest,res:iResponse,head):void
    GetClientIdFromHostname(hostname:string):any
}


