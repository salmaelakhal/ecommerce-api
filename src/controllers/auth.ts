import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { UnprocessableEntity } from "../exceptions/validation";
import { signUpSchema } from "../schema/users";
import { NotfoundException } from "../exceptions/not-found";

export const signup = async (req: Request,res: Response,next: NextFunction,) => {
  signUpSchema.parse(req.body);
  const { name, email, password } = req.body;

  let user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
      new BadRequestsException(
        "User already exists",
        ErrorCode.USER_ALREADY_EXISTS,
      )}

  user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.status(201).json(user);
};

////////////////////////////////////////////////////////////////
// login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new NotfoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ user, token });
};



///////////////////
//me -> return the logged in user
export const me = async (req: Request, res: Response) => {


  res.json(req.user);
};   