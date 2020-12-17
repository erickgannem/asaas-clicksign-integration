import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'

const routes = Router()

routes.post('/webhook', ClickSignController.listenWebhook)
routes.get('/documents', ClickSignController.getDocuments)
routes.get('/documents/:document_key', ClickSignController.getDocument)

export default routes
