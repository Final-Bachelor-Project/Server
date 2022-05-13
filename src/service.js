import express from 'express';
import config from 'config';
import bodyparser from 'body-parser';
import cors from 'cors';
import session from 'express-session';

import databaseService from './services/databaseService';
import userRouter from './routes/userRoutes';
import loginRouter from './routes/loginRoutes';
import requestRouter from './routes/requestRoutes';
import verifyAccessToken from './middleware/verifyAccessToken';

let service;
const start = async () => {
  // Setting up express
  const app = express();
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(express.static('public'));
  app.use(cors({
    origin: config.get('clientRedirectUri'),
    credentials: true
  }));

  // Setting up the session
  app.use(session({
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: false
  }));

  // Database connection
  await databaseService.connect();

  // Routes
  app.use('/api/users', userRouter.router);
  app.use('/api/requests', requestRouter.router);
  app.use('/api/login', loginRouter.router);

  // Start server
  const port = config.get('port');
  service = app.listen(port);
  console.log('Now listening to port', port);
};

const stop = async () => {
  await service.close();
};

export default {
  start, stop
};
