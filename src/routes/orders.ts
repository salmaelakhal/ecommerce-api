import {Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { cancelOrder, changeOrderStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/orders";

const orderRoutes : Router = Router();


orderRoutes.post('/', [authMiddleware, errorHandler(createOrder)]);
orderRoutes.get('/', [authMiddleware, errorHandler(listOrders)]);
orderRoutes.put('/:id/cancel', [authMiddleware, errorHandler(cancelOrder)]);
//
orderRoutes.get('/index', [authMiddleware, errorHandler(listAllOrders)]);
orderRoutes.get('/users/:id', [authMiddleware, errorHandler(listUserOrders)]);
orderRoutes.put('/:id/status', [authMiddleware, errorHandler(changeOrderStatus)]);
orderRoutes.get('/:id', [authMiddleware, errorHandler(getOrderById)]);


// list des routes est tres important


export default orderRoutes;