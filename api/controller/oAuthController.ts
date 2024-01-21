import passport from "passport";
import { SERVER_URL } from "../utils/urls";

//------------------------GOOGLE------------------------//

const googleAuth = (req: any, res: any, next: any) => {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

const googleAuthRedirect = (req: any, res: any, next: any) => {
  return passport.authenticate("google", {
    successRedirect: SERVER_URL,
    failureRedirect: `${SERVER_URL}/login`,
  })(req, res, next);
};

//------------------------FACEBOOK------------------------//

const facebookAuth = (req: any, res: any, next: any) => {
  return passport.authenticate("facebook", {
    scope: ["email"],
  })(req, res, next);
};

const facebookAuthRedirect = (req: any, res: any, next: any) => {
  return passport.authenticate("facebook", {
    successRedirect: SERVER_URL,
    failureRedirect: `${SERVER_URL}/login`,
  })(req, res, next);
};

export { googleAuth, googleAuthRedirect, facebookAuth, facebookAuthRedirect };
