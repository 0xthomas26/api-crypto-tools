import setupEnv from './env';
import setupMoralis from './moralis';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import express from 'express';
import * as http from 'http';

const app = express();
setupEnv();
setupMoralis();
setupMiddlewares(app);
setupRoutes(app);
const server = http.createServer(app);

export default server;
