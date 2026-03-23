import type { Request, Response } from "express";
import { AddressSchema } from "../schema/users";
import type { User } from "../../generated/prisma/client";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prisma } from "../lib/prisma";

export const AddAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  let user: User;
  try {
    user = await prisma.user.findFirstOrThrow({
      where: {
        id: req.body.userId,
      },
    });
  } catch (err) {
    throw new NotfoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  const address = await prisma.address.create({
    data: {
      ...req.body,
      userId: user.id,
    },
  });
  res.status(201).json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {};

export const listAddress = async (req: Request, res: Response) => {};

export const updateAddress = async (req: Request, res: Response) => {};
