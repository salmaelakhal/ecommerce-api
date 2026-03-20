import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.status(201).json(user);
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
