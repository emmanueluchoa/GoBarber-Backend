import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './middleware/auth';
const routes = new Router();

routes.post(
  '/session',
  SessionController.checkIfUserNotExist,
  SessionController.checkIfUserPasswordIsCorrect,
  SessionController.store
);

routes.post('/user',  UserController.store);
routes.put('/user', authMiddleware, UserController.update);

export default routes;
