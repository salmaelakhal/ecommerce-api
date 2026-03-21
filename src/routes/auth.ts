import express from 'express';
import type { Router } from 'express';
import { login, signup } from '../controllers/auth';
import { errorHandler } from '../error-handler';

const authRoutes: Router = express.Router();

authRoutes.post('/signup', errorHandler(signup));
authRoutes.post('/login', errorHandler(login));

export default authRoutes;