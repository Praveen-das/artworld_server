import express from "express";
import passport from "passport";

const authRouter = express.Router();

//------------------------GOOGLE------------------------//

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

authRouter.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("google authed");

    // Successful authentication, redirect home.
    res.send("ok");
  }
);

authRouter.get("/facebook");
authRouter.get("/twitter");

export default authRouter;
