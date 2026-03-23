import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createProductSchema } from "../schema/products";
import { UnprocessableEntity } from "../exceptions/validation";
import productRoutes from '../routes/products';
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";


export const createProduct = async (req: Request, res: Response) => {
    const validatedData = createProductSchema.parse(req.body);
    
    const product = await prisma.product.create({
        data: {
           ...req.body,
           tags: req.body.tags.join(',')
        },
    });

    res.status(201).json(product);
};


export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: +req.params.id,
            },
            data: product,
        });

        res.json(updatedProduct);
    } catch (err) {
        throw new NotfoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
}
}



//////////////////////
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await prisma.product.delete({
            where: {
                id: +req.params.id,
            },
        });
        res.status(204).send();
    } catch (err) {
        throw new NotfoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const listProducts = async (req: Request, res: Response) => {
    // {
    //     count: 100,
    //     data: []
    // }

    const count = await prisma.product.count();
    const products = await prisma.product.findMany({
        skip: +req.query.skip || 0, // http://localhost:3000/products?skip=10
        take: 5
        
    });
    res.json({ count, data: products });
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findFirstOrThrow({
            where: {
                id: +req.params.id,
            },
        });
        res.json(product);

    } catch (err) {
        throw new NotfoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);

    }
}