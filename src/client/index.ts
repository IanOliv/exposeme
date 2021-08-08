import { io } from "socket.io-client";
import axios from "axios";
class ClientExpose{
    constructor(private server:string,private service:string){

    }

    connect(){
        const {server,service}=this
        const socket =io(server)
        socket.on('id',(id)=>{
            console.log(id)
        })
        socket.on('data',async (req,cb)=>{
            try {
                const {url,headers,body} =JSON.parse(req)
                const {data} =await axios.get(`${service}${url}`)
                cb(null,data)
            } catch (e) {
                cb(e,null)
            }


        })
    }
}

new ClientExpose('http://localhost:8080','http://localhost:5500')
    .connect()
