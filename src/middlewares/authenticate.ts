import { RequestHandler } from "express";
import createHttpError from "http-errors";
import {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import { Config } from "../config";
import { Roles } from "../services/userTypes";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        username: string;
        email: string;
        image: string | null;
        role: string;
      };
    }
  }
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const token = authToken?.split(" ")[1] || req.cookies.accessToken;

    console.log("Token: ", token);

    if (!token) {
      throw createHttpError(401, "Unauthorized: Access token is missing");
    }

    const decoded = verify(token, Config.JWT_SECRET!);
    if (typeof decoded === "string") {
      throw createHttpError(403, "Forbidden: Invalid access token");
    }
    const payload: JwtPayload = decoded;

    console.log("Payload: ", payload);

    if (!payload) {
      throw createHttpError(403, "Forbidden: Invalid access token");
    }

    req.user = {
      id: Number(payload.sub),
      username: payload.username,
      email: payload.email,
      image: payload.image || null,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.log(error, "error");
    if (error instanceof TokenExpiredError) {
      throw createHttpError(401, "Unauthorized: Access token has expired");
    }

    if (error instanceof JsonWebTokenError) {
      throw createHttpError(403, "Forbidden: Invalid access token");
    }

    next(error);
  }
};

export const adminOnly: RequestHandler = (req, res, next) => {
  if (req.user.role !== Roles.ADMIN) {
    throw createHttpError(403, "Forbidden: Admin access required");
  }

  next();
};
