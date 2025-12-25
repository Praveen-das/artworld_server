import * as jose from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

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

export { generateToken, verifyToken };
