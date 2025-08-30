import { Strategy as RememberMeStrategy } from "passport-remember-me";
import { _getUserById } from "../userServices";
import * as jose from "jose";
import { generateToken, verifyToken } from "../jwt";
import { VerifyToken } from "../../interfaces/types";

const secretKey = new TextEncoder().encode(
  "8553ffcef635f049b738d700ada3b2c7fa355477cfe7c3b45eae326e3dd58ee2db12e3d08b1a8df38a78141329e78e4a2ed219717d5b6ef780ac09bc754bd4a6"
);

export const rememberMeStrategy = new RememberMeStrategy(
  async function (token, done) {
    console.log("VerifyFunction");
    try {
      const verified = await verifyToken<VerifyToken>(token);
      const user = await _getUserById(verified.payload.userId);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
  async function (user, done) {
    console.log("IssueFunction");
    try {
      var token = await generateToken({ userId: user.id });
      return done(null, token);
    } catch (err) {
      return done(err);
    }
  }
);
