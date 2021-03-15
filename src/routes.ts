import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'
import AsaasController from './controllers/AsaasController'

const routes = Router()
const {
  fetchClients,
  checkIfClientExists,
  createCharge,
  createInvoice
} = AsaasController
const {
  listenWebhook,
  getDocument
  // createDocument
} = ClickSignController

routes.post('/', listenWebhook, getDocument, fetchClients, checkIfClientExists, createCharge)
routes.get('/invoices', createInvoice)

routes.get('/status', (_, res) => res.status(200).json(
  { message: 'Server is up and running' })
)

// routes.post('/documents', createDocument)

export default routes
