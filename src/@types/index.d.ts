import { static } from "express";
import { IncomingMessage, request } from "http";
import { Url } from "url";



export default interface iApp {
    middlewares(): void
    routes(): void
    errorhandler():void

}

export interface iRequest implements IncomingMessage {
    headers:{host:string}
    url:string
    [name:string]:any

}

export interface iResponse{
    [name:string]:any

}



export * from './server'
export * from './client'
export * from './dispatcher'
export * from './ducks'
