import { HttpError } from "@/error/http";
import { JWT_SECRET } from "@/settings";
import { NextFunction, Request, Response } from "express";
import * as jose from "jose";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new HttpError(401, "0001, Token not provided");
  }

  const token = authorization.replace("Bearer", "").trim();


  try {
    await jose.jwtVerify(token, Buffer.from(JWT_SECRET));
    return next();
  } catch (error) {
    return next(new HttpError(401, "0002, Unauthorized"));
  }
};

export default authMiddleware;
