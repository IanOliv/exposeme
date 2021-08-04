/**
 *  TODO: Implement top level await
 *
 */
(async () => {
    const { PORT } = process.env;
    try {
        const server = await import('./server');
        server.default().listen(PORT || 8080, () => {
            console.log('Server is running');
        });
    } catch (error) {
        console.log(error);
    }
})();
