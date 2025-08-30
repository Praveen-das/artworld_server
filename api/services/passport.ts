import { _getUserById } from "./userServices";
import { User as IUser } from "@prisma/client";
import { PassportStatic } from "passport";
import { googleStrategy } from "./Strategies/googleStrategy";
import { facebookStrategy } from "./Strategies/facebookStrategy";
import { adminLocalStrategy, userLocalStrategy } from "./Strategies/localStrategy";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

const initializePassport = (passport: PassportStatic) => {
  passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
    try {
      done(null, user.id);
    } catch (error) {
      console.log("error serializeUser", error);
    }
  });

  passport.deserializeUser(async (id: any, done: any) => {
    try {
      const user = await _getUserById(id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      console.log("deserializeUser", error);
    }
  });

  passport.use("user-local", userLocalStrategy);
  passport.use("admin-local", adminLocalStrategy);
  // passport.use(rememberMeStrategy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
};

export default initializePassport;
