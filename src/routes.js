import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import multer from 'multer';
import multerConfig from '../src/config/MulterConfig';
import authMiddleware from './middleware/auth';
const routes = new Router();

const uploader = multer(multerConfig);

routes.post(
  '/session',
  SessionController.checkIfUserNotExist,
  SessionController.checkIfUserPasswordIsCorrect,
  SessionController.store
);

routes.post(
  '/upload',
  authMiddleware,
  uploader.single('file'),
  FileController.store
);

routes.post('/user', UserController.store);
routes.put('/user', authMiddleware, UserController.update);

export default routes;
