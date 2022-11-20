import express from "express";
import passport from "passport";

import {
  signupUser,
  signinUser,
  logoutUser,
  updateUser,
  sendEmailVerification,
  confirmVerification,
  addUserAddress,
} from "../controller/userController";
import { auth } from "../services/globalServices";

const userRouter = express.Router();

userRouter.get("/", auth, (req, res) => res.json(req.user));
userRouter.put("/", updateUser);
userRouter.post("/signup", signupUser);
userRouter.post("/signin", passport.authenticate("local"), signinUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/emailverification", sendEmailVerification);
userRouter.get("/verify", confirmVerification);
userRouter.post("/address", addUserAddress);
userRouter.put("/address", addUserAddress);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.log("ERROR HANDLER", err);
    res.status(err.code).send(err.error);
  }
});

export default userRouter;
