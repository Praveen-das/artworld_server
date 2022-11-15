import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import { getUserById, getUserByEmail, _signupUser } from "./userServices";

const initializePassport = (passport: any) => {
  // localStrategy(passport);
  googleStrategy(passport);

  passport.serializeUser((user: any, done: any) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: any, done: any) => {
    const user = await getUserById(id);
    return done(null, user);
  });
};

function localStrategy(passport: any) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user: any = await getUserByEmail(email);
        try {
          if (!user)
            return done(
              {
                error: { field: "email", message: "User doesn't exist " },
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
      }
    )
  );
}

function googleStrategy(passport: any) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "579389242399-8p3nfb3n07nqecr7ct92k95fp9359oru.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3001/auth/google/redirect",
      },
      (accessToken, refreshToken, profile, done) => {
        // const user = getUserById(profile.id);

        console.log(profile);
        // if (!user) {
        // }
          
          // _signupUser({
          //   displayName: profile.displayName,
          //   email: profile.emails,
          // });
          // done(null, profile);
          // User.findOrCreate({ googleId: profile.id }, function (err, user) {
          //   return cb(err, user);
          // });
        // return done(null, user);
      }
    )
  );
}

export default initializePassport;
