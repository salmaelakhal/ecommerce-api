import type { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prisma } from "../lib/prisma";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import type { Address } from "../../generated/prisma/client";

export const AddAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prisma.address.create({
    data: {
      ...req.body,
      userId: req.user!.id,
    },
  });
  res.status(201).json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prisma.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(204).send();
  } catch (err) {
    throw new NotfoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND,
    );
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId: req.user!.id,
    },
  });
  res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address | null = null;
  let billingAddress: Address | null = null;

  if (validatedData.defaultShippingAddress !== undefined) {
    try {
      shippingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      });
    } catch (err) {
      throw new NotfoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND,
      );
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestsException(
        "Address doas not belong to the user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG,
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      });

    
    } catch (err) {
      throw new NotfoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND,
      );
    }

      if (billingAddress.userId != req.user.id) {
        throw new BadRequestsException(
          "Address does not belong to the user",
          ErrorCode.ADDRESS_DOES_NOT_BELONG,
        );
      }
  }

  const updateUser = await prisma.user.update({
    where: {
      id: req.user!.id,
    },
    data: validatedData,
  });
  res.json(updateUser);
};
