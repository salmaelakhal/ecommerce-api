import type { Request, Response } from "express";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

import { prisma, prismaBase } from "../lib/prisma";

export const createOrder = async (req: Request, res: Response) => {
  return await prismaBase.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.json({ message: "Cart is empty" });
    }

    const price = cartItems.reduce((prev, curr) => {
      return prev + curr.quantity * +curr.product.price;
    }, 0);

    // ✅ utilise prisma (étendu) pour avoir formattedAddress
    const address = await prisma.address
      .findFirstOrThrow({
        where: { id: req.body.addressId },
      })
      .catch(() => {
        throw new NotfoundException(
          "Address not found",
          ErrorCode.ADDRESS_NOT_FOUND,
        );
      });

    const order = await tx.order.create({
      data: {
        userId: req.user!.id,
        netAmount: price,
        address: address.formattedAddress,
        products: {
          create: cartItems.map((cart) => ({
            productId: cart.productId,
            quantity: cart.quantity,
          })),
        },
      },
    });

    await tx.orderEvent.create({
      data: { orderId: order.id, message: "Order created" },
    });

    await tx.cartItem.deleteMany({
      where: { userId: req.user!.id },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {};

export const cancelOrder = async (req: Request, res: Response) => {};

export const getOrderById = async (req: Request, res: Response) => {};
