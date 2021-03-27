import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'
import AsaasController from './controllers/AsaasController'

const routes = Router()
const {
  fetchClients,
  checkIfClientExists,
  createCharge,
  paymentWebhook,
  savePaymentToDB,
  checkIfPaymentIsProcessed,
  checkPaymentDate,
  createInvoice
} = AsaasController
const {
  documentWebhook,
  getDocument
} = ClickSignController

routes.post('/', documentWebhook, getDocument, fetchClients, checkIfClientExists, createCharge)
routes.post('/payments', paymentWebhook, savePaymentToDB)
routes.get('/invoices', checkIfPaymentIsProcessed, checkPaymentDate, createInvoice)

routes.get('/status', (_, res) => res.status(200).json(
  { message: 'Server is up and running' })
)

export default routes
