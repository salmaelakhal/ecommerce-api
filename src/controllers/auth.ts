import type { Request, Response } from 'express-serve-static-core';

export const login = (req: Request, res: Response) => {
  // Handle login logic here
  res.send('Login endpoint');
};