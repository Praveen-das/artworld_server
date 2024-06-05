import { _signupUser, _updateUser } from "../services/userServices";
import bcrypt from "bcrypt";
import passport from "passport";
import { sendMail } from "../services/nodeMailer";
import { generateToken, verifyToken } from "../services/jwt";

const signupUser = async (req: any, res: any, next: any) => {
  const credentials = req.body;
  const salt = 12;

  const hashPass = await bcrypt.hash(req.body.password, salt);

  credentials.password = hashPass;

  _signupUser(credentials)
    .then((data) => res.json(data))
    .catch((err) => {
      if (err.code === "P2002") {
        next({
          error: { field: "username", message: "User alredy exists" },
          code: 403,
        });
      } else next(err);
    });
};

const signinUser = (req: any, res: any, next: any) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    req.logIn(user, (err: any) => {
      if (err) next(err);
      else res.send(req.user);
    });
  })(req, res, next);
};

const logoutUser = (req: any, res: any, next: any) => {
  req.logout((err: any) => {
    if (err) return next(err);
    res.send("logout successfully");
  });
};

const updateUser = (req: any, res: any, next: any) => {
  try {
    _updateUser(req.user.id, req.body)
      .then((data) => res.status(200).json(data))
      .catch(next);
  } catch (error) {
    console.log(error);
  }
};

const sendEmailVerification = async (req: any, res: any, next: any) => {
  // await deleteUserVerificationRecord(req.user.id);

  const payload = req.body;

  const token = generateToken({ ...payload, user_id: req.user.id });
  console.log(token);

  // await setUserVerificationRecord(user_id, token);
  // // sendMail(token, email).then(() => {
  // // });
};

const confirmVerification = async (req: any, res: any, next: any) => {
  try {
    verifyToken(req.query.token);
  } catch (error: any) {
    return res.status(410).send(error.message);
  }
  res.send("ok");
};

export {
  signupUser,
  signinUser,
  logoutUser,
  sendEmailVerification,
  confirmVerification,
  updateUser,
};
