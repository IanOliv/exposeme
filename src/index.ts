/**
 *  TODO: Implement top level await
 *
 */
(async()=>{

    try {
        const server = await import('./server')
        server
        .default()
        .listen(8080,()=>{
            console.log('Server is running')
        })
    } catch (error) {
        console.log(error)
    }

})()
