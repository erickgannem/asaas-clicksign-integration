import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'
import AsaasController from './controllers/AsaasController'

const routes = Router()
const { fetchClients: asaasFetchClients, checkIfClientExists: asaasCheckIfClientExist, createCharge: asaasCreateCharge } = AsaasController
const { listenWebhook: clicksignWebhookListener, createDocument } = ClickSignController

routes.post('/', clicksignWebhookListener, asaasFetchClients, asaasCheckIfClientExist, asaasCreateCharge)
routes.post('/documents', createDocument)

export default routes
