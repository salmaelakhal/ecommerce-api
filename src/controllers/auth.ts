import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { UnprocessableEntity } from "../exceptions/validation";

export const signup = async (req: Request, res: Response, next:NextFunction) => {

  try {
  const { name, email, password } = req.body;

  let user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    next(new BadRequestsException("User already exists", ErrorCode.USER_ALREADY_EXISTS));
    return;
  }

  user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.status(201).json(user);
} catch (err:any) {
  next(new UnprocessableEntity(err?.issues, "Unprocessable Entity", ErrorCode.Unprocessable_Entity));
}
};

// login

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw Error("User not found");
  }

  if (!compareSync(password, user.password)) {
    throw Error("Invalid password");
  }

  const token = jwt.sign({
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
    
  );

  res.json({ user, token });
};
