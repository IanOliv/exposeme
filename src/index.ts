import  Server from "./server";
const {httpServer}=new Server()
const {PORT}=process.env

httpServer.listen(PORT||8080,()=>{
    console.log('Server is running')
    console.log(`on the port ${PORT||8080}`)
})
