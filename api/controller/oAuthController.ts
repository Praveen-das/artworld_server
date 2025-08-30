import passport from "passport";
import { CLIENT_URL } from "../utils/urls";

//------------------------GOOGLE------------------------//

const googleAuth = (req: any, res: any, next: any) => {
  console.log('googleAuth')
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

const googleAuthRedirect = (req: any, res: any, next: any) => {
  console.log('googleAuthRedirect')
  return passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: `${CLIENT_URL}/sign-in`,
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
    successRedirect: CLIENT_URL,
    failureRedirect: `${CLIENT_URL}/sign-in`,
  })(req, res, next);
};

export { googleAuth, googleAuthRedirect, facebookAuth, facebookAuthRedirect };
