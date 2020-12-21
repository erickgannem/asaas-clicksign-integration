import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'
import AsaasController from './controllers/AsaasController'

const routes = Router()

routes.post('/webhook', ClickSignController.listenWebhook)
routes.post('/documents', ClickSignController.createDocument)
routes.post('/client', AsaasController.fetchClients, AsaasController.checkIfClientExists, AsaasController.createPayment)
export default routes
