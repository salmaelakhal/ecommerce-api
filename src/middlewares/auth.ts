 import type { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JWT_SECRET } from "../secrets";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    
    if (!token) {
        return next(new UnauthorizedException("No token provided", ErrorCode.UNAUTHORIZED, 1001));
    }
    
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await prisma.user.findFirst({ where: { id: payload.userId } });
        if (!user) {
            return next(new UnauthorizedException("User not found", ErrorCode.UNAUTHORIZED, 1002));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new UnauthorizedException("Invalid or expired token", ErrorCode.INVALID_TOKEN));
    }
};


 export default authMiddleware;