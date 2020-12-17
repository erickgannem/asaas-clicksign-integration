import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

import routes from './routes'

import errorMiddleware from './middlewares/errorMiddleware'

dotenv.config({})
class App {
  server: Application
  constructor () {
    this.server = express()
    this.middlewares()
    this.routes()
    this.errors()
  }

  middlewares () {
    this.server.use(helmet())
    this.server.use(express.json())
    this.server.use(cors())
  }

  routes () {
    this.server.use(routes)
  }

  errors () {
    this.server.use(errorMiddleware)
  }
}

export default new App().server
