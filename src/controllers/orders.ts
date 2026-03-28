import type { Request, Response } from "express";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

import { prisma, prismaBase } from "../lib/prisma";

const validStatuses = ['PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const;
type OrderEventStatus = typeof validStatuses[number];

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

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    await prismaBase.$transaction(async (tx) => {
      // ✅ Vérifie que c'est la commande de l'user
      const existingOrder = await tx.order.findFirstOrThrow({
        where: {
          id: +req.params.id,
          userId: req.user!.id, // ✅ ownership check
        },
      });

      // ✅ Vérifie que la commande n'est pas déjà annulée
      if (existingOrder.status === "CANCELLED") {
        return res.status(400).json({ message: "Order already cancelled" });
      }

      const order = await tx.order.update({
        where: { id: +req.params.id },
        data: { status: "CANCELLED" },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
          message: "Order cancelled",
        },
      });

      res.json(order);
    });
  } catch (error) {
    throw new NotfoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotfoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = (req.query.status as string) || undefined;

  if (status && !validStatuses.includes(status as OrderEventStatus)) {
    return res.status(400).json({ 
      message: `Invalid status '${status}'. Valid values: ${validStatuses.join(', ')}`,
      errorCode: 4001
    });
  }

  if (status) {
    whereClause = {
      status: status as OrderEventStatus,
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    skip: +req.query.skip || 0,
    take: 5,
  });
  res.json(orders);
};
export const changeOrderStatus = async (req: Request, res: Response) => {
  // wrap it inside transaction
  try {
    const order = await prisma.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });

    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
        message: "Order status changed",
      },
    });

    res.json(order);
  } catch (error) {
    throw new NotfoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: +req.params.id,
  };
  const status = (req.query.status as string) || undefined;

  if (status && !validStatuses.includes(status as OrderEventStatus)) {
    return res.status(400).json({ 
      message: `Invalid status '${status}'. Valid values: ${validStatuses.join(', ')}`,
      errorCode: 4001
    });
  }

  if (status) {
    whereClause = {
      ...whereClause,
      status: status as OrderEventStatus,
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    skip: +req.query.skip || 0,
    take: 5,
  });
  res.json(orders);
};
