import passport from "passport";

//------------------------GOOGLE------------------------//

const googleAuth = (req: any, res: any, next: any) => {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

const googleAuthRedirect = (req: any, res: any, next: any) => {
  return passport.authenticate("google", {
    successRedirect: "https://artsworld.vercel.app",
    failureRedirect: "https://artsworld.vercel.app/login",
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
    successRedirect: "https://artsworld.vercel.app",
    failureRedirect: "https://artsworld.vercel.app/login",
  })(req, res, next);
};

export { googleAuth, googleAuthRedirect, facebookAuth, facebookAuthRedirect };
