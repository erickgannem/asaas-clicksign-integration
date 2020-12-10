import { Router } from 'express';

import ClickSignController from './controllers/ClickSignController.js';

const routes = Router();

routes.get('/get-documents', ClickSignController.getDocuments);

export default routes;
