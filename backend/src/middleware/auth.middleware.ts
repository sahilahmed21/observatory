import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user as { userId: string; email: string };
        next();
    });
}