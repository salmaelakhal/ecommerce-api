import type { Request, Response } from "express";
import { changeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prisma } from "../lib/prisma";
import type { Product } from "../../generated/prisma/client";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);

  // Vérifier si le produit existe
  try {
    await prisma.product.findFirstOrThrow({
      where: { id: validatedData.productId },
    });
  } catch {
    throw new NotfoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND,
    );
  }

  // ✅ Vérifier si le produit est déjà dans le cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId: req.user!.id,
      productId: validatedData.productId,
    },
  });

  // ✅ Si déjà dans le cart → augmenter la quantité
  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + validatedData.quantity },
    });
    return res.json(updatedItem);
  }

  // Sinon → créer un nouvel item
  const cart = await prisma.cartItem.create({
    data: {
      userId: req.user!.id,
      productId: validatedData.productId,
      quantity: validatedData.quantity,
    },
  });

  res.status(201).json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  // check if user is deleting its own cart item
  await prisma.cartItem.delete({
    where: {
      id: +req.params.id,
      userId: req.user!.id, // more secure
    },
  });
  res.json({ message: "Item deleted" });
};

export const changeQuantity = async (req: Request, res: Response) => {
  // check if user is updating its own cart item

  const validatedData = changeQuantitySchema.parse(req.body);
  const updatedCart = await prisma.cartItem.update({
    where: {
      id: +req.params.id,
      userId: req.user!.id, // more secure
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedCart);
};

export const getCart = async (req: Request, res: Response) => {
  // check if the user get its own cart items
  const cart = await prisma.cartItem.findMany({
    where: {
      userId: req.user!.id,
    },
    include: {
      product: true,
    },
  });
  res.json(cart);
};
