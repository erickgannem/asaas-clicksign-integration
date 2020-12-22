import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'
import AsaasController from './controllers/AsaasController'

const routes = Router()
const {
  fetchClients,
  checkIfClientExists,
  createCharge
} = AsaasController
const {
  listenWebhook,
  getDocument,
  createDocument
} = ClickSignController

routes.post('/', listenWebhook, getDocument, fetchClients, checkIfClientExists, createCharge)
routes.post('/documents', createDocument)

export default routes
