import { Router } from 'express';
import { AddAddress, deleteAddress, listAddress, updateAddress } from '../controllers/users';
import  authMiddleware  from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import { errorHandler } from '../error-handler';


const usersRoutes:Router = Router();

usersRoutes.post('/address', [authMiddleware, adminMiddleware, errorHandler(AddAddress)]);
usersRoutes.delete('/address/:id', [authMiddleware, adminMiddleware, errorHandler(deleteAddress)]);
usersRoutes.get('/address', [authMiddleware, adminMiddleware, errorHandler(listAddress)]);
// UsersRoutes.put('/address/:id', [authMiddleware, adminMiddleware, errorHandler(updateAddress)]);

export default usersRoutes;