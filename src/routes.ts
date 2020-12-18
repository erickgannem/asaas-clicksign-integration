import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'

const routes = Router()

routes.post('/webhook', ClickSignController.listenWebhook)
routes.post('/documents', ClickSignController.createDocument)

export default routes
