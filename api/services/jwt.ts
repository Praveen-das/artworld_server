import jwt from "jsonwebtoken";
import db from "../config/prismaClient";
import { _updateUser } from "./userServices";

const SECRET = "asdasdasdasdasd";

const generateToken = (payload: any) => {
  return jwt.sign(payload, SECRET, { expiresIn: "5m", algorithm: "HS256" });
};

const verifyToken = (token: string) => {
  jwt.verify(token, SECRET, { algorithms: ["HS256"] }, (err, decoded: any) => {
    if (err) throw err;
    if (decoded) {
      _updateUser(decoded.user_id, decoded.data);
    }
  });
};

// const setUserVerificationRecord = async (user_id: string, token: string) => {
//   return await db.userVerificationRecords.create({
//     data: {
//       user_id,
//       token,
//     },
//   });
// };

// const getUserVerificationRecord = async (user_id: string) => {
//   return await db.userVerificationRecords.findMany({
//     where: { user_id },
//   });
// };

// const deleteUserVerificationRecord = async (user_id: string) => {
//   return await db.userVerificationRecords.deleteMany({
//     where: { user_id },
//   });
// };

export {
  generateToken,
  verifyToken,
  // setUserVerificationRecord,
  // getUserVerificationRecord,
  // deleteUserVerificationRecord,
};
