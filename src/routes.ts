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
  createInvoice,
  updatePaymentsDB
} = AsaasController
const {
  documentWebhook,
  getDocument
} = ClickSignController

routes.post('/', documentWebhook, getDocument, fetchClients, checkIfClientExists, createCharge)

routes.post('/invoices', paymentWebhook, savePaymentToDB)

routes.get('/test', checkIfPaymentIsProcessed, checkPaymentDate, createInvoice, updatePaymentsDB)

routes.get('/status', (_, res) => res.status(200).json(
  { message: 'Server is up and running' })
)

export default routes
