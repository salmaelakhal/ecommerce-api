 import type { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";


// Middleware d'authentification pour protéger les routes nécessitant une authentification
const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user.role == 'ADMIN') {
        next();
    } else {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
};
 export default adminMiddleware; 