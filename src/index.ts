import server from './config/app';

const launchServer = () => {
    server.listen(process.env.PORT, () => {
        console.log('Express server listening on port ' + process.env.PORT);
    });
};

launchServer();
