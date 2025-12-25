import { Strategy as RememberMeStrategy } from "@jmilanes/passport-remember-me";
import { _getUserById } from "../userServices";
import { generateToken, verifyToken } from "../jwt";
import { VerifyToken } from "../../interfaces/types";

export const rememberMeStrategy = new RememberMeStrategy(
  { key: "remember_me", salt: "random salt" } as any,
  async function (token: string, done: any) {
    try {
      const verified = await verifyToken<VerifyToken>(token);
      const user = await _getUserById(verified.payload.userId);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
  async function (user: any, done: any) {
    try {
      var token = await generateToken({ userId: user.id });
      return done(null, token);
    } catch (err) {
      return done(err);
    }
  }
);
