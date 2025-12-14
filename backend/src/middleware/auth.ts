import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

//interface JWT payload
interface JWTPayload {
  userId: string;
  role: string;
}

//auth middleware function
export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  try {
    //get the token from the auth header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "No auth header" });
    }
    //extract token
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided!" });
    }

    //verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;

    //attahc the user info to the request opbejct
    req.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    console.error("auth moddlewar error", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
