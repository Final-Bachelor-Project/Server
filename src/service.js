import express from 'express';
import config from 'config';
import bodyparser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import redis from 'ioredis';
import connectRedis from 'connect-redis';

import databaseService from './services/databaseService';
import chatService from './services/chatService';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import requestRouter from './routes/requestRoutes';
import chatRouter from './routes/chatRoutes';
import messageRouter from './routes/messageRoutes';
import verifyAccessToken from './middleware/verifyAccessToken';

let service;
const start = async () => {
  // Setting up express
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({ host: 'localhost', port: 6379 });

  // Setting up the session
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10,
      sameSite: 'lax'
    }
  }));

  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(express.static('public'));
  app.use(cors({
    origin: config.get('clientUri'),
    credentials: true
  }));

  // Database connection
  await databaseService.connect();

  // Routes
  app.use('/api/users', verifyAccessToken, userRouter.router);
  app.use('/api/requests', verifyAccessToken, requestRouter.router);
  app.use('/api/auth', authRouter.router);
  app.use('/api/chats', verifyAccessToken, chatRouter.router);
  app.use('/api/messages', verifyAccessToken, messageRouter.router);

  // Start server
  const port = config.get('port');
  service = app.listen(port);
  console.log('Now listening to port', port);

  // Sockets
  await chatService.socketConnection(service);
};

const stop = async () => {
  await service.close();
};

export default {
  start, stop
};
