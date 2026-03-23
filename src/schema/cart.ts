import {z} from 'zod';
import { changeQuantity } from '../controllers/cart';


export const CreateCartSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
})

export const changeQuantitySchema = z.object({
    quantity: z.number(),
})