import express from "express";
import passport from "passport";

import {
  signupUser,
  signinUser,
  logoutUser,
  updateUser,
} from "../controller/userController";
import { auth } from "../services/global";

export const userRouter = express.Router();

userRouter.get("/", (req: any, res: any) => res.json(req.user));
userRouter.put("/", auth, updateUser);
userRouter.post("/signup", signupUser);
userRouter.post("/signin", passport.authenticate("local"), signinUser);
userRouter.post("/logout", logoutUser);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, _: any, res: any, next: any) => {
  console.log("ERROR HANDLER", err);
  res.status(err.code).send(err.error);
});
