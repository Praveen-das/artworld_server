import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { getUserById, getUserByUsername } from "./userServices";

const initializePassport = (passport: any) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user: any = await getUserByUsername(username);
      try {
        if (!user)
          return done(
            {
              error: { field: "username", message: "User doesn't exist " },
              code: 401,
            },
            false
          );

        if (await bcrypt.compare(password, user.password)) {
          delete user.password;
          return done(null, user);
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
    })
  );

  passport.serializeUser((user: any, done: any) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: any, done: any) => {
    const user = await getUserById(id);
    return done(null, user);
  });
};

export default initializePassport;
