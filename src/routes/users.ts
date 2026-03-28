import { Router } from 'express';
import { AddAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from '../controllers/users';
import  authMiddleware  from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import { errorHandler } from '../error-handler';


const usersRoutes:Router = Router();

usersRoutes.post('/address', [authMiddleware, errorHandler(AddAddress)]);
usersRoutes.delete('/address/:id', [authMiddleware, errorHandler(deleteAddress)]);
usersRoutes.get('/address', [authMiddleware, errorHandler(listAddress)]);
usersRoutes.put('/', [authMiddleware, adminMiddleware, errorHandler(updateUser)]);
//
usersRoutes.put('/:id/role', [authMiddleware, adminMiddleware, errorHandler(changeUserRole)]);
usersRoutes.get('/', [authMiddleware, adminMiddleware, errorHandler(listUsers)]);
usersRoutes.get('/:id', [authMiddleware, adminMiddleware, errorHandler(getUserById)])




export default usersRoutes;