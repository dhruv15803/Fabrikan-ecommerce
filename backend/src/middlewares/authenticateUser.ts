import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            userId:string;
        }
    }
}

export const authenticateUser = async (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.accessToken) return res.json({"success":false,"message":"No auth token cookie"});
    const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET as string);
    const userId = (decodedToken as JwtPayload).userId;
    req.userId = userId;
    next();
}

