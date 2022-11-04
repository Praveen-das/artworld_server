import { _signupUser } from "../services/userServices";
import bcrypt from "bcrypt";
import passport from "passport";

const signupUser = async (req: any, res: any) => {
  const { username, email } = req.body;
  const salt = 12;

  const hashPass = await bcrypt.hash(req.body.password, salt);

  const credentials = {
    first_name: "asdasd",
    last_name: "asdasdasd",
    username,
    email,
    password: hashPass,
  };

  _signupUser(credentials)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
  res.sendStatus(200);
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

export { signupUser, signinUser };

{
  /*
username: 'asdasd',
password: asdasdasd,
*/
}
