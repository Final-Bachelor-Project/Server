import express from 'express';
import config from 'config';
import bodyparser from 'body-parser';

import databaseService from './services/databaseService';
import userRouter from './routes/userRoutes';
import loginRouter from './routes/loginRoutes';

let service;
const start = async () => {
    // Setting up express
    const app = express();
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(express.static(`public`));

    // Database connection
    await databaseService.connect()

    // Routes
    app.use('/users', userRouter.router);
    app.use('/login', loginRouter.router);

    // Start server
    const port = config.get(`port`);
    service = app.listen(port);
    console.log(`Now listening to port`, port);
};

const stop = async () => {
    await service.close();
};

export default {
    start, stop
};