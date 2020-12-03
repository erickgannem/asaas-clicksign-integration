import express from 'express';
import cors from 'cors';

import routes from './routes.js';

import errorMiddleware from './middlewares/errorMiddleware.js';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errors();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
  }

  errors() {
    this.server.use(errorMiddleware);
  }
}

export default new App().server;
