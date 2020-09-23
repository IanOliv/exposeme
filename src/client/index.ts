import http,{ IncomingMessage, request  } from "http";
import { iClient, iClientIdResponse } from "@types";
import  WebSocket ,{Server} from "ws";
import { Url, URL } from "url";
import { debug } from "debug";
import { Console } from "console";
import   axios, { AxiosInstance } from "axios";
import { json } from "express";

const log  = debug('exposeme@client')


export class Client implements iClient {
    private urlParsed: URL;
    clientId: string;
    private apiParsed:URL;
    axios: AxiosInstance;
    constructor(private url:string,private api:string){
        const urlParsed = new URL(url)
        this.urlParsed = urlParsed
        if(api){
            this.api =api
            this.apiParsed = new URL(api)
             this.axios =axios.create({baseURL:this.api})
        }
    }
    httpRequest(): Promise<string> {
     return new Promise((resolve,rejects)=>{

        try {
            // console.log(this.urlParsed)
        request(this.urlParsed,(res:IncomingMessage)=>{

            let data : string;
            res.on('data',(chunk:unknown)=>{

                try {
                    data =Buffer.from(chunk).toString()
                } catch (error) {
                    rejects(error)
                }
            })
            res.on('end',(d)=>{
                resolve(data)
            })

         }).on("error",(e)=>rejects(e))
         .end()

        } catch (error) {
            rejects(error)
        }
     })
    }
    wsConnection(clientId?:string){
        const {protocol,host,pathname}= this.urlParsed
        const wsUrl  =`${protocol==='http:'?'ws':'wss'}://${host}${pathname}?clientId=${clientId||this.clientId}`
        log(wsUrl)
        const wsConn = new WebSocket(wsUrl)
        wsConn.on('open', ()=>{
        log('OPEN')
        });
        wsConn.on('ping', ()=>{
            log('PING')
        });
        wsConn.on('message',(dataBuffer:Buffer)=>{
            const httpReq  =JSON.parse(dataBuffer.toString())

            let httResponse={}

            const url  = new URL(`${this.api}${httpReq.url}`)
            url.searchParams.delete('clientId')

            this.axios({...httpReq,url:url.href})
                .then(r=>{
                    const {status,statusText,data,headers}=r
                    httResponse={status,statusText,data,headers}
                    const bufferData=Buffer.from(JSON.stringify(httResponse), 'utf-8')
                    wsConn.send(bufferData)
                })
                .catch(r=>{
                    const {status ,statusText,headers,data}=r.response
                    httResponse={status,statusText,data,headers}
                    const bufferData=Buffer.from(JSON.stringify(httResponse), 'utf-8')
                    wsConn.send(bufferData)
                })
        })

        wsConn.on('close', function clear() {
          log('CLOSE')
        });

    }



    async requestId(): {} {
        const response  = await this.httpRequest()
        const responseJson:iClientIdResponse = JSON.parse(response)
        if((typeof responseJson)!=='object'){
            new Error('The response from the server inst  a object')
        }
        this.clientId =responseJson.newClientId
        this.wsConnection()

        return responseJson
    }


    hostname(hostname: any) {
        throw new Error("Method not implemented.");
    }
    connect(): void {
        throw new Error("Method not implemented.");
    }



}


