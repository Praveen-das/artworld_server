import { Request, Response, NextFunction } from "express";
import { _getUserByEmail, _getUserById, _updateUser } from "../services/userServices";
import { generateToken, verifyToken } from "../services/jwt";
import tokenServices from "../services/tokenServices";
import { JWTExpired } from "jose/errors";
import { prismaErrorHandler } from "../utils/PrismaErrorHandler";
import { hashPassword } from "../utils/password";
import { VerifyToken } from "../interfaces/types";
import bcrypt from "bcryptjs";
import { sendPasswordResetLinkMail } from "../services/nodeMailer";
import { CLIENT_URL } from "../utils/urls";

const _sendResetLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emailId = req.body.email;
    if (!emailId) return res.status(400).json("emailId not provided");

    const user = await _getUserByEmail(emailId);
    if (!user) throw Error("User not found");

    const token = await generateToken({ userId: user?.id });

    await tokenServices.saveToken(token, user.id);

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

    await sendPasswordResetLinkMail({ email: emailId, resetLink });
    res.json({ status: "success" });
  } catch (error) {
    if (error instanceof Error) res.status(401).json({ error: error.message });
  }
};

const _resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    if (body) {
      const { password, c_password, token } = body;

      if (password !== c_password) return next("Passwords does not match");

      const { payload } = await verifyToken<VerifyToken>(token);

      if (payload) {
        const [user, savedToken] = await Promise.all([
          _getUserById(payload.userId),
          tokenServices.fetchTokenByUserId(payload.userId),
        ]);

        if (!user) return res.status(401).json("User does not exist");
        if (!savedToken) return res.status(401).json("Token already used or doesn't exist");

        if (savedToken.token === token) {
          const samePassword = await bcrypt.compare(password, user.password!);

          if (samePassword)
            return res
              .status(400)
              .json({ field: "password", message: "New and current passwords cannot be the same." });

          const hashedPassword = await hashPassword(password);

          Promise.all([
            _updateUser(payload.userId, { password: hashedPassword }),
            tokenServices.deleteToken(savedToken.id),
          ]);
          res.json("Password reset successfully");
        } else {
          res.status(400).json("Tokens doesn't match");
        }
      }
    } else next("Request body is empty");
  } catch (error) {
    if (error instanceof JWTExpired) {
      return res.status(401).json("Token expired");
    }
    next(prismaErrorHandler(error));
  }
};

const _changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    if (body) {
      const { userId, old_password, password, c_password } = body;

      if (password !== c_password) return res.status(400).json("Passwords does not match");

      const user = await _getUserById(userId);

      if (!user) return res.status(404).json("User does not exist");

      const hashedPassword = await hashPassword(password);

      const currentPasswordIsValid = await bcrypt.compare(old_password, user.password!);
      const samePassword = await bcrypt.compare(password, user.password!);

      if (!currentPasswordIsValid)
        return res.status(400).json({ field: "old_password", message: "Incorrect password" });

      if (samePassword)
        return res.status(400).json({ field: "password", message: "New and current passwords cannot be the same." });

      await _updateUser(userId, { password: hashedPassword });
      res.json("Password changed successfully");
    } else next("Request body is empty");
  } catch (error) {
    next(prismaErrorHandler(error));
  }
};

export default {
  _sendResetLink,
  _resetPassword,
  _changePassword,
};
