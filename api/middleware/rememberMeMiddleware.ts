import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwt";
import { _getUserById } from "../services/userServices";
import { VerifyToken } from "../interfaces/types";

const rememberMeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // If user is already authenticated via session, skip
  if (req.isAuthenticated()) {
    return next();
  }

  const token = req.cookies.remember_me;

  if (token) {
    console.log("Found remember_me cookie, attempting auto-login...");
    try {
      const verified = await verifyToken<VerifyToken>(token);
      const user = await _getUserById(verified.payload.userId);

      if (user) {
        req.logIn(user, (err) => {
          if (err) {
            console.error("Auto-login error:", err);
            return next();
          }
          console.log("Auto-login successful for user:", user.email);
          next();
        });
        return;
      }
    } catch (error: any) {
      console.log("Remember-me token verification failed:", error.message);
      // Optional: Clear invalid cookie
      res.clearCookie("remember_me");
    }
  }

  next();
};

export default rememberMeMiddleware;
