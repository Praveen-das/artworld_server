import { JWTExpired, JWTInvalid } from "jose/errors";
import { verifyToken } from "../services/jwt";
import services from "../services/tokenServices";
import { VerifyToken } from "../interfaces/types";

const _saveToken = async (req: any, res: any, next: any) => {
  const { token, userId } = req.body;
  if (token && userId) {
    await services
      .saveToken(token, userId)
      .then(() => res.json(1))
      .catch(next);
  } else return res.json(-1);
};

const _verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json("token not provided");

    const data = await verifyToken<VerifyToken>(token).catch((error) => {
      if (error instanceof JWTExpired) {
        return { payload: { ...error.payload, expired: true } as VerifyToken };
      }

      throw error;
    });

    if (data.payload) {
      const savedToken = await services.fetchTokenByUserId(data.payload.userId);
      if (!savedToken) return res.status(401).json("Token not found");
      else if (data.payload.expired) {
        services.deleteToken(savedToken.id);
        return res.status(401).json("Token expired");
      }
      res.json(true);
    }
  } catch (error) {
    if (error instanceof JWTInvalid) return res.status(401).json("Invalid token");
    res.json(error);
  }
};

const _deleteToken = async (req: any, res: any, next: any) => {
  const tokenId = req.query.tokenId;

  if (!tokenId) return res.status(400).json("tokenId not provided");

  await services
    .deleteToken(tokenId)
    .then((data) => res.send(data))
    .catch(next);
};

export default {
  _saveToken,
  _verifyToken,
  _deleteToken,
};
