import { Router } from 'express'

import ClickSignController from './controllers/ClickSignController'

const routes = Router()

routes.get('/documents', ClickSignController.getDocuments)
routes.get('/documents/:document_key', ClickSignController.getDocument)
routes.get('/signers/:signer_key', ClickSignController.getSigner)

export default routes
