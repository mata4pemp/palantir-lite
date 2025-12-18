//checks if user is an admin (runs after auth middleware)
import { Request, Response, NextFunction } from "express";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Check if user exists (should be set by auth middleware)
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only" });
  }

  // User is admin, proceed
  next();
};
