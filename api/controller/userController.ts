import {
  _addUserAddress,
  _signupUser,
  _updateUser,
} from "../services/userServices";
import bcrypt from "bcrypt";
import passport from "passport";
import { sendMail } from "../services/nodeMailer";
import { generateToken, verifyToken } from "../services/jwt";
import { prismaErrorHandler } from "../utils/PrismaErrorHandler";

const hashPassword = async (password: string) => {
  const salt = 12;
  return await bcrypt.hash(password, salt);
};

const signupUser = async (req: any, res: any, next: any) => {
  const credentials = req.body;

  const hashPass = await hashPassword(req.body.password);

  credentials.password = hashPass;

  _signupUser(credentials)
    .then((data) => res.json(data))
    .catch((err) => {
      prismaErrorHandler(err, next);
      next(err);
    });
};

const signinUser = (req: any, res: any, next: any) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    req.logIn(user, (err: any) => {
      if (err) next(err);
      else res.send(req.user);
    });
  })(req, res, next);
};

const logoutUser = (req: any, res: any, next: any) => {
  req.logout((err: any) => {
    if (err) return next(err);
    res.send("logout successfully");
  });
};

const updateUser = async (req: any, res: any, next: any) => {
  let updates = req.body;

  if (updates.old_password) {
    const isValid = await bcrypt.compare(
      updates.old_password,
      req.user.password
    );

    if (isValid) {
      delete updates.old_password;
      updates.password = await hashPassword(updates.password);
    } else {
      return next({
        error: { field: "old_password", message: "Invalid password" },
        code: 401,
      });
    }
  }

  _updateUser(req.user.id, updates)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      prismaErrorHandler(err, next);
    });
};

const sendEmailVerification = async (req: any, res: any, next: any) => {
  // await deleteUserVerificationRecord(req.user.id);

  const payload = req.body;

  const token = generateToken({ ...payload, user_id: req.user.id });

  // await setUserVerificationRecord(user_id, token);
  sendMail(token);
};

const confirmVerification = async (req: any, res: any, next: any) => {
  try {
    const isVerified = await verifyToken(req.query.token);
    if (isVerified) {
      console.log("verified and calling next");
    } else {
      console.log(isVerified);
    }
  } catch (error) {
    next(error);
  }
};
const addUserAddress = async (req: any, res: any, next: any) => {
  const userId = req.user.id;
  const address = req.body;

  try {
    address["user_id"] = userId;
    _addUserAddress(address)
      .then((data) => res.json(data))
      .catch((err) => {
        prismaErrorHandler(err, next);
        next(err);
      });
  } catch (error) {
    next(error);
  }
};

export {
  signupUser,
  signinUser,
  logoutUser,
  sendEmailVerification,
  confirmVerification,
  updateUser,
};
