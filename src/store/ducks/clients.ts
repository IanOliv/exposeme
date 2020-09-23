import {Dispatcher,dispatch} from "../dispatcher";
import { iDispatchDucks , iPayload, iRequest } from "@types";
import WebSocket, { Server } from "ws";
import { Socket } from "net";
import { IncomingMessage } from "http";
import {  debug} from "debug";
const log = debug('exposeme:clients#redux')



export class Clients implements iDispatchDucks{

    emitter: Dispatcher ;
    clients: Array<Client>;
    constructor(){
        this.clients = Array<Client>();
        this.emitter =new Dispatcher() ;
        dispatch.register((payload:iPayload)=>{

            const {type}= payload
            switch(type){
                case eClients.CREATE:
                    this.clients.push(payload.data)
                    break;
                default:
                    return;
            }
            this.emitter.dispatch()
        })


    }
    addListener(cb:Function): void {
       this.emitter.register(cb)
    }
    removeListener(id:string): void {
      this.emitter.unregister(id)
    }
    getAll(){

        return this.clients
    }
    addClient(id:string){
        dispatch.dispatch( {
        type: eClients.CREATE,
        data:new Client(id)
        } )
    }
    getClient(id:string):Client{
        return this.clients.find(({id:clientId})=>id==clientId)
    }


}

export default new Clients()


enum eClients {
    CREATE="CLIENTS@CREATE",
    DELETE="CLIENTS@DELETE",
    UPDATE="CLIENTS@UPDATE",
}

export class Client {
    id:string
    title?:string|""
    server:Server
    socket:WebSocket
    constructor(id:string){
        this.id = id
        this.server = new Server({noServer:true})
        this.server
            .on('connection',(ws:WebSocket)=>{
                log(`has some connection ${id}`)
                this.socket = ws
            })
        this.server.on('message',()=>{
            log('message response')
        })

    }

    addConnection(request:IncomingMessage, socket:Socket, head:Buffer){
        // console.log('SSSSS')
        // console.log(this)
        // console.log('SSSSS')
           this.server
            .handleUpgrade(request,socket,head, (ws)=>{
                this.server.emit('connection',ws,request)
            })
    }


}
