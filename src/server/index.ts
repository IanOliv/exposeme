import { iRequest, iResponse,iServer } from '@types';
import{createServer,IncomingMessage} from 'http'
import tldjs from 'tldjs'
import debug from "debug";
import app from '@app/index'
import {hri}from 'human-readable-ids'
import clients,{ Clients,Client } from "./../store/ducks/clients";
import { URL } from 'url';
import { Socket } from 'net';
import { StringDecoder } from "string_decoder";
import { json } from 'express';




const log = debug('exposeme:server')


class Server  implements iServer {
    GetClientIdFromHostname(hostname: string) {
        throw new Error('Method not implemented.');
    }
    request(req: iRequest, res: iResponse): void {
        const {headers:{host:hostname},url} = req
        if('/api/channels'===url){
            const allCli = clients.getAll().map(({id})=>id)
            res.writeHead(201,{ 'Content-Type': 'application/json' });
            res.end(JSON.stringify(allCli))
            return
        }
        if(!hostname){
            res.statusCode = 400
            res.end('Host header is required')
            return
        }
        let clientId = Server.GetClientIdFromHostname(hostname,url)
       log(clientId)

        if(!clientId){
            log('No Client id')
            Server.isNewRequest(req,res)
        }
        const client =clients.getClient(clientId)
        try {
            if(client===undefined){
                throw new Error('clientId not valid')
            }
            const decoder = new StringDecoder('utf-8')
            let body ='';
            req.on('data',(data:Buffer)=>{
                body += decoder.write(data)
            })
            req.on('end',()=>{
                body+= decoder.end()
                const {url,method,headers}= req

            const httpReq =JSON.stringify({url,method,headers,body})
            const bufferHR = Buffer.from(httpReq, 'utf-8')

            client.socket.send(bufferHR)
            client.socket
                .on('message',(dataBuffer:Buffer)=>{
                    const data  =JSON.parse(dataBuffer.toString())
                    try {
                        res.writeHead(data.status);
                        let body  =JSON.stringify(data.data)
                        res.end(body);
                    } catch (error) {
                        res.writeHead(400);
                        res.end(error.message||'Sorry something went wrong ');
                    }
                })

            })
        } catch (error) {
            res.writeHead(400);
            res.end(error.message||'Sorry something went wrong ');
        }
    }
    upgrade(req:iRequest& IncomingMessage, res: iRequest& Socket, head:Buffer): void {
        const client =Server.getConnection(req)
        client.addConnection(req,res,head)
        // console.log(res)
        // console.log(head)
    }
    static isNewRequest(req:iRequest,res:iResponse){
        const newClientId = hri.random()


        res.writeHead(201,{ 'Content-Type': 'application/json' });
        clients.addClient(newClientId)
        res.end(JSON.stringify({newClientId}));
        // res.end(JSON.stringify("sdsdsd"));
    }
    static getClientId(url:string){
        const fakeUrl  = new URL(`http://fake${url}`)


        return fakeUrl.searchParams.get('clientId')
    }
    static getConnection(req:iRequest):Client{
        let pos = Server.getClientId(req.url)
        const ws = clients.getClient(pos)

        return ws
    }
    static existendClient(){

    }


    static GetClientIdFromHostname(host:string,url?:string){
        return tldjs
        .fromUserSettings({ validHosts:['localhost'] })
        .getSubdomain(host) ||Server.getClientId(url)
    }

}


const serverFunction = new Server()


export default function(){

    const server= createServer()
    server.on('request',serverFunction.request)
    server.on('upgrade',serverFunction.upgrade)

    return server
}


