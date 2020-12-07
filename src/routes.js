import { Router } from 'express';

import ClickSignController from './controllers/ClickSignController.js';

const routes = Router();

routes.post('/create-document', ClickSignController.createDocument);

export default routes;
