import { Strategy } from "passport-local";
import { _getAdminByEmail, _getUserByEmail } from "../userServices";
import bcrypt from "bcryptjs";

export const userLocalStrategy = new Strategy({ usernameField: "email" }, async (email, password, done) => {
  process.nextTick(async () => {
    const user: any = await _getUserByEmail(email);

    try {
      if (!user)
        return done(
          {
            error: { field: "email", message: "User doesn't exist " },
            code: 401,
          },
          false
        );

      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        try {
          delete user.password;
          return done(null, user);
        } catch (error) {
          console.log(error);
        }
      } else
        done(
          {
            error: { field: "password", message: "Incorrect password" },
            code: 401,
          },
          false
        );
    } catch (error) {
      done(error);
    }
  });
});

export const adminLocalStrategy = new Strategy({ usernameField: "email" }, async (email, password, done) => {
  process.nextTick(async () => {
    const admin: any = await _getAdminByEmail(email);

    try {
      if (!admin)
        return done(
          {
            error: { field: "email", message: "Admin doesn't exist " },
            code: 401,
          },
          false
        );

      const isValid = await bcrypt.compare(password, admin.password);

      if (isValid) {
        try {
          delete admin.password;
          return done(null, admin);
        } catch (error) {
          console.log(error);
        }
      } else
        done(
          {
            error: { field: "password", message: "Incorrect password" },
            code: 401,
          },
          false
        );
    } catch (error) {
      done(error);
    }
  });
});
