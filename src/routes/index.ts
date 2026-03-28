
import {Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import usersRoutes from './users';
import cartRoutes from './cart';
import orderRoutes from './orders';
import { Role } from '../../generated/prisma/enums';

const rootRouter : Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/carts', cartRoutes);
rootRouter.use('/orders', orderRoutes );

export default rootRouter;


// 1. user management
//     a. list users
//     b. get users by id
//     c. change user role 

// 2. order management
//     a. list all orders (filter on status)
//     b. change order status
//     c. list all orders of given user
 
// 3. product management
//     a. search api for products (for both users ans admins) -> full text search
   

    