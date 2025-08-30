import jwt from "jsonwebtoken";
import db from "../config/prismaClient";
import { _updateUser } from "./userServices";
import * as jose from "jose";

const SECRET_KEY = new TextEncoder().encode(
  "8553ffcef635f049b738d700ada3b2c7fa355477cfe7c3b45eae326e3dd58ee2db12e3d08b1a8df38a78141329e78e4a2ed219717d5b6ef780ac09bc754bd4a6"
);

const generateToken = async (payload: any, expirationTime: string = "10min") => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(SECRET_KEY);
};

const verifyToken = async <T>(token: string) => {
  return await jose.jwtVerify<T>(token, SECRET_KEY);
};

export {
  generateToken,
  verifyToken,
};
