import { Router } from 'express';
import { AddAddress, deleteAddress, listAddress, updateUser } from '../controllers/users';
import  authMiddleware  from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import { errorHandler } from '../error-handler';


const usersRoutes:Router = Router();

usersRoutes.post('/address', [authMiddleware, errorHandler(AddAddress)]);
usersRoutes.delete('/address/:id', [authMiddleware, errorHandler(deleteAddress)]);
usersRoutes.get('/address', [authMiddleware, errorHandler(listAddress)]);
usersRoutes.put('/', [authMiddleware, adminMiddleware, errorHandler(updateUser)]);

export default usersRoutes;