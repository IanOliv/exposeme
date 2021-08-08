import express from "express";
import {createServer} from "http"
import { Server } from 'socket.io'
import { Socket } from "socket.io-client";
const {PORT}=process.env
export default class ServerExpose {
    app: any;
    cons:any;
    httpServer: import("http").Server;
    constructor(){
        this.app= express()
        this.middleware()
        this.routes()
        this.cons={}
        const  httpServer = createServer(this.app)
        const io=new Server(httpServer)
        io.on('connection',(socket)=>{
            console.log(socket.id)
            socket.emit('id',socket.id)
            this.cons[socket.id]=socket
        })
        this.httpServer= httpServer
    }
    middleware(){
        this.app.use(express.json())
    }
    routes(){

        this.app.all('*',  (req, res)=> {
            const {url,headers,body} =req
            let regex = /^\/\w+/g;

            const id =regex.exec(url)[0].replace('/','')
            const {cons}=this


            console.log('---------------------------')
            console.log(url)
            console.log(id)
            console.log(cons)
            console.log(cons[id])
            console.log('---------------------------')
            let newUrl= url.replace(`/${id}`,'')

            const json =JSON.stringify({url:newUrl,headers,body})
            if(!!cons[id]){
                cons[id].emit('data',json,(err,data)=>{
                console.log(err)
                console.log(data)
                res.send(data||'ssss')
            })
            }else{
                res.send('sszzzzzss')
            }
        })
    }

    realtime(socket){
        this.cons[socket.id]=socket
    }
}


// new ServerExpose()
//     .httpServer
//     .listen(PORT||8080,()=>{
//     console.log('Server is running')
//     console.log(`on the port ${PORT||8080}`)
// })
