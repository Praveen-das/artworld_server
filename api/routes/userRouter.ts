import express from "express";
import passport from "passport";

import { signupUser, signinUser } from "../controller/userController";
import { auth } from "../services/global";

export const userRouter = express.Router();

userRouter.get("/", auth, (req: any, res: any) => res.json(req.user));
userRouter.post("/signup", signupUser);
userRouter.post("/signin", passport.authenticate("local"), signinUser);

/*---------------------->> ERROR HANDLER <<----------------------*/

userRouter.use((err: any, _: any, res: any, next: any) => {
  console.log("errrrrr", err);
  res.status(err.code).send(err.message);
});
