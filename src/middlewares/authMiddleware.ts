import { HttpError } from "@/error/http";
import { JWT_SECRET } from "@/settings";
import { NextFunction, Request, Response } from "express";
import * as jose from "jose";

const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new HttpError(401, "0001, Token not provided");
  }

  const token = authorization.replace("Bearer", "").trim();  

  try {
    const verified = await jose.jwtVerify(token, Buffer.from(JWT_SECRET));

    if (!verified) {
      throw new HttpError(401, "0002, Invalid token");
    }

    req.id = verified.payload.id

    
    return next();
  } catch (error) {
    return next(new HttpError(error.status, error.message));
  }
};

export default authMiddleware;
