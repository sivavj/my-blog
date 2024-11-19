import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/User";

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Middleware to authenticate users.
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Unauthorized: Token missing" });
        return;
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id : string} ;
      const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    req.user = { id: user._id as string, role: user.role }; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

/**
 * Middleware to authorize specific roles.
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Access denied" });
      return;
    }

    next();
  };
};
