 import type { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JWT_SECRET } from "../secrets";

// Middleware d'authentification pour protéger les routes nécessitant une authentification
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 1. extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    // 2. if token is missing, throw an error of type UnauthorizedException with message "No token provided", error code ErrorCode.UNAUTHORIZED and custom error code 1001
    if (!token) {
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, 1001));
    }
    
    try {
        // 3.if the tokwn is present, verify that token and extract the payload
        const payload = jwt.verify(token, JWT_SECRET) as any;
        // 4. to get the user from the payload
        const user = await prisma.user.findFirst({ where: { id: payload.userId } });
        if (!user) {
            return next(new UnauthorizedException("User not found", ErrorCode.UNAUTHORIZED, 1002));
        }
        // 5. add the user to the request object and call next()
        req.user = user;
        next();
    } catch (error) {
        return next(new UnauthorizedException("Invalid or expired token", ErrorCode.INVALID_TOKEN));
    }
};


 export default authMiddleware;