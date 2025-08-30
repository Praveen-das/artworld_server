import express from "express";
import passport from "passport";
import {
  facebookAuth,
  facebookAuthRedirect,
  googleAuth,
  googleAuthRedirect,
} from "../controller/oAuthController";

const authRouter = express.Router();

//------------------------GOOGLE------------------------//

authRouter.get("/google", googleAuth);

authRouter.get("/google/redirect", googleAuthRedirect);

//------------------------FACEBOOK------------------------//
authRouter.get("/facebook", facebookAuth);

authRouter.get("/facebook/redirect", facebookAuthRedirect);

//------------------------TWITTER------------------------//
authRouter.get("/twitter", passport.authenticate("twitter"));

authRouter.get(
  "/twitter/redirect",
  passport.authenticate("twitter", { failureRedirect: "/sign-in" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

export default authRouter;
